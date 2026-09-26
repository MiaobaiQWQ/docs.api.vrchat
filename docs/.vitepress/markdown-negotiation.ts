/* ==================================================================== *
 *  Markdown for Agents —— 内容协商的共享实现
 *
 *  两处代码共用本文件：
 *    1. 构建期（seo.ts → buildEnd）：计算 token 数并写出
 *       docs/.vitepress/dist/_agents/markdown.json；
 *    2. 运行期（/functions/[[path]].ts，Cloudflare Pages Function）：
 *       读取该清单，把 Accept: text/markdown 的请求映射到页面的 .md 源文件。
 *
 *  之所以把「协商规则」和「token 估算」集中在这里，是为了让构建产物与
 *  线上行为永远基于同一套判断，避免两边各写一份而慢慢跑偏。
 * ==================================================================== */

/** 构建期清单在站点上的路径 */
export const MANIFEST_PATH = '/_agents/markdown.json'

/** 站点自己发布的 .md 版本链接（Link: rel="alternate"）遵循的约定 */
export const LINK_REL = 'alternate'

/**
 * 把请求路径规整成清单键。
 *
 * 页面的规范形式不带末尾斜杠（与 VitePress 的 cleanUrls 一致），但用户和爬虫
 * 都可能带斜杠访问；`/zh/index` 与 `/zh/` 是同一个页面，所以统一收成 `/zh`。
 */
export function normalizeRoutePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '').replace(/\/index$/, '')
  return trimmed === '' ? '/' : trimmed
}

/** 取 Accept 头里某个媒体类型的 q 值；未出现则返回 undefined */
function qualityOf(accept: string, type: string): number | undefined {
  for (const raw of accept.split(',')) {
    const [media = '', ...params] = raw.trim().split(';')
    const name = media.trim().toLowerCase()
    if (name !== type) continue
    let q = 1
    for (const param of params) {
      const [key, value] = param.split('=')
      if (key?.trim().toLowerCase() === 'q') {
        const parsed = Number.parseFloat((value ?? '').trim())
        q = Number.isFinite(parsed) ? parsed : 1
      }
    }
    return q
  }
  return undefined
}

/**
 * 客户端是否明确点名要 Markdown，且没有把 HTML 排在更高的优先级上。
 *
 * 判定规则（照抄 RFC 9110 的 Accept 语义，且只认显式点名）：
 *
 *   1. text/markdown            直接命中      -> 返回 Markdown
 *   2. text/markdown + text/plain + 通配      -> 返回 Markdown（扫描器就是这种）
 *   3. text/markdown;q=0        显式拒绝       -> 返回 HTML
 *   4. text/html 的 q 更高                    -> 返回 HTML（浏览器语义优先）
 *   5. 没有 Accept，或只有 通配               -> 返回 HTML（HTML 仍是默认）
 *
 * 第 5 条特意不把通配范围（星号斜杠星号）当作「接受 Markdown」：通配只表示
 * 「什么都能收」，拿它当 Markdown 的许可会让少发 Accept 的普通客户端意外拿到 Markdown。
 */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false
  const markdown = qualityOf(accept, 'text/markdown')
  if (markdown === undefined || markdown <= 0) return false

  // 显式声明更偏好 HTML 时尊重客户端
  for (const type of ['text/html', 'application/xhtml+xml']) {
    const q = qualityOf(accept, type)
    if (q !== undefined && q > markdown) return false
  }

  return true
}

/**
 * 粗估 token 数，供 `x-markdown-tokens` / `x-original-tokens` 使用。
 *
 * 本站以中文为主：CJK 字符在主流 BPE 词表里几乎一字一 token（约 1.2~1.7），
 * 拉丁文本约 4 字符一 token。这里取保守的 1.2 与 4，宁可略高估也不要让
 * 调用方低估上下文占用。
 */
export function estimateTokens(text: string): number {
  let cjk = 0
  let rest = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    if (
      (code >= 0x2e80 && code <= 0x9fff) || // CJK 部首、假名、汉字
      (code >= 0xac00 && code <= 0xd7ff) || // 谚文
      (code >= 0xf900 && code <= 0xfaff) || // CJK 兼容汉字
      (code >= 0xff00 && code <= 0xffef) // 全角标点
    ) {
      cjk += 1
    } else {
      rest += 1
    }
  }
  return Math.ceil(cjk * 1.2 + rest / 4)
}

/** 在已有 Vary 的基础上补上 Accept，且不产生重复维度 */
export function withVaryAccept(current: string | null | undefined): string {
  const parts = (current ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  if (!parts.some((part) => part.toLowerCase() === 'accept')) parts.push('Accept')
  return parts.join(', ')
}

/* ------------------------------------------------------------------ *
 *  构建期清单
 * ------------------------------------------------------------------ */

export interface MarkdownManifestEntry {
  /** 请求侧的路由（`/zh/video-parser/api`） */
  route: string
  /** 相对于站点根的 .md 资源路径，例如 /zh/video-parser/api.md */
  source: string
  /** Link: rel="alternate" 里用的相对地址，即 source 去掉前导斜杠 */
  link: string
  /** 该 .md 的估算 token 数 */
  tokens: number
  /** 对应 HTML 页面的估算 token 数（没有则为 null） */
  originalTokens: number | null
}

export interface MarkdownManifest {
  version: 1
  generatedAt: string
  routes: Record<string, MarkdownManifestEntry>
}

/** Node 侧的 UTF-8 解码（构建期用，避免依赖 Buffer 类型声明） */
function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder('utf-8').decode(bytes)
}

/**
 * 生成 `/_agents/markdown.json`。
 *
 * 每个条目记录：请求路由、该路由对应的 .md 资源、以及 Markdown / HTML 的 token 数。
 * 运行时函数据此判断某个请求路径有没有 Markdown 版本，并回填 token 头。
 *
 * 这里的做法是「以构建产物为准」：路由到底发布成 `zh.md` 还是 `zh/index.md`，
 * 直接看输出目录里哪个文件存在，而不是去猜 VitePress 的落盘规则。
 */
export async function writeMarkdownManifest(options: {
  routes: string[]
  outDir: string
  /** 把站点路径映射到构建输出目录中的绝对文件路径 */
  resolve: (sitePath: string) => string
  readFile: (filePath: string) => Promise<Uint8Array>
  writeFile: (filePath: string, data: string) => Promise<void>
  join: (...parts: string[]) => string
  mkdir: (dir: string, opts: { recursive: boolean }) => Promise<unknown>
  exists: (filePath: string) => boolean
}): Promise<MarkdownManifest> {
  const routes: Record<string, MarkdownManifestEntry> = {}
  const cache = new Map<string, number | null>()
  const seen = new Set<string>()

  const tokensOf = async (sitePath: string): Promise<number | null> => {
    if (cache.has(sitePath)) return cache.get(sitePath) ?? null
    try {
      const text = decodeUtf8(await options.readFile(options.resolve(sitePath)))
      const tokens = estimateTokens(text)
      cache.set(sitePath, tokens)
      return tokens
    } catch {
      // 构建产物里没有这个文件，记 null 即可，不阻断构建
      cache.set(sitePath, null)
      return null
    }
  }

  for (const rawRoute of options.routes) {
    const route = normalizeRoutePath(rawRoute)
    if (seen.has(route)) continue
    seen.add(route)

    // 具体文件请求（末段带扩展名）没有对应的页面 Markdown 版本
    const last = route.slice(route.lastIndexOf('/') + 1)
    if (route !== '/' && last.includes('.')) continue

    // 优先级：目录下的 index.md 优先，其次同名 .md
    const candidates = route === '/' ? ['/index.md'] : [`${route}/index.md`, `${route}.md`]

    let source: string | null = null
    let tokens: number | null = null
    for (const candidate of candidates) {
      if (!options.exists(options.resolve(candidate))) continue
      const counted = await tokensOf(candidate)
      if (counted === null) continue
      source = candidate
      tokens = counted
      break
    }
    if (source === null || tokens === null) continue

    const htmlPath = route === '/' ? '/index.html' : `${route}.html`
    const original = await tokensOf(htmlPath)
    routes[route] = {
      route,
      source,
      link: source.replace(/^\//, ''),
      tokens,
      originalTokens: original
    }
  }

  const manifest: MarkdownManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    routes
  }

  const dir = options.join(options.outDir, '_agents')
  await options.mkdir(dir, { recursive: true })
  await options.writeFile(options.join(dir, 'markdown.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  return manifest
}
