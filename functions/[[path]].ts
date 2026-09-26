/* ==================================================================== *
 *  Markdown for Agents —— Cloudflare Pages Function
 *
 *  这个函数只做一件事：内容协商。
 *
 *    请求 Accept: text/markdown  -> 返回该页面的 Markdown 版本
 *                                   Content-Type: text/markdown; charset=utf-8
 *                                   Vary: Accept
 *                                   x-markdown-tokens / x-original-tokens
 *    其余请求（浏览器）           -> 原样返回 HTML，行为与以前完全一致
 *
 *  Markdown 正文直接复用构建时发布的页面 .md 源文件（见 seo.ts 的 buildEnd），
 *  因此线上 Markdown 与文档源文件永远同源，不存在两份内容需要同步的问题。
 *  某个路径有没有 Markdown 版本、token 数是多少，由构建期生成的
 *  /_agents/markdown.json 决定。
 *
 *  注意：函数里的相对 import 会被 Pages 构建器打包进 Worker，所以共享模块
 *  保留在 functions/ 下一份副本（构建期使用的是 docs/.vitepress/ 下的同名实现，
 *  两者的协商规则与 token 估算算法必须保持一致）。
 * ==================================================================== */

/** 构建期清单在站点上的路径（清单自身的缓存由 public/_headers 声明） */
const MANIFEST_PATH = '/_agents/markdown.json'

/** Markdown 与 HTML 共用的缓存策略，与站点既有静态资源保持一致 */
const BODY_CACHE_CONTROL = 'public, max-age=3600, must-revalidate'

/** 把请求路径规整成清单键（/zh/、/zh/index 都归到 /zh） */
function normalizeRoutePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '').replace(/\/index$/, '')
  return trimmed === '' ? '/' : trimmed
}

/** 取 Accept 头里某个媒体类型的 q 值；未出现则返回 undefined（通配不算命中） */
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
 * 只认显式点名，通配范围（星号斜杠星号）不算数，因此：
 *
 *   1. text/markdown                      -> true
 *   2. text/markdown + text/plain + 通配   -> true（扫描器用的就是这种）
 *   3. text/markdown;q=0                  -> false（显式拒绝）
 *   4. text/html 的 q 更高                 -> false（浏览器语义优先 HTML）
 *   5. 无 Accept / 只有通配                -> false（HTML 仍是默认）
 */
function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false
  const markdown = qualityOf(accept, 'text/markdown')
  if (markdown === undefined || markdown <= 0) return false

  for (const type of ['text/html', 'application/xhtml+xml']) {
    const q = qualityOf(accept, type)
    if (q !== undefined && q > markdown) return false
  }

  return true
}

/** 在已有 Vary 的基础上补上 Accept，且不产生重复维度 */
function withVaryAccept(current: string | null | undefined): string {
  const parts = (current ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  if (!parts.some((part) => part.toLowerCase() === 'accept')) parts.push('Accept')
  return parts.join(', ')
}

interface MarkdownManifestEntry {
  route: string
  source: string
  /** Link: rel="alternate" 里用的相对地址 */
  link: string
  tokens: number
  originalTokens: number | null
}

interface MarkdownManifest {
  version: number
  generatedAt: string
  routes: Record<string, MarkdownManifestEntry>
}

interface AssetFetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
}

interface PagesContext {
  request: Request
  env: { ASSETS: AssetFetcher }
}

/** 请求是否针对一个「可能被渲染成页面」的路径（而非字体、图片等静态资源） */
function isPagePath(pathname: string): boolean {
  const last = pathname.split('/').filter(Boolean).pop() ?? ''
  return !last.includes('.')
}

/** 把 404.html 的正文包成真正的 404 响应（直接透传 404.html 会带回 200） */
async function notFoundResponse(request: Request): Promise<Response> {
  const url = new URL(request.url)
  url.pathname = '/404.html'
  url.search = ''
  const asset = await fetch(new Request(url.toString(), { method: 'GET', headers: request.headers }))
  const headers = new Headers(asset.headers)
  headers.set('Vary', withVaryAccept(asset.headers.get('vary')))
  return new Response(await asset.arrayBuffer(), { status: 404, headers })
}

/** 读取构建期清单；失败时返回空清单，让请求干净地退回 HTML */
async function loadManifest(request: Request): Promise<MarkdownManifest> {
  const empty: MarkdownManifest = { version: 1, generatedAt: '', routes: {} }
  try {
    const url = new URL(MANIFEST_PATH, request.url)
    const res = await fetch(url.toString())
    if (!res.ok) return empty
    const parsed = (await res.json()) as Partial<MarkdownManifest>
    return { version: 1, generatedAt: parsed.generatedAt ?? '', routes: parsed.routes ?? {} }
  } catch {
    return empty
  }
}

/** 把页面的 .md 源文件包装成 Markdown 响应，并补齐协商相关响应头 */
async function markdownResponse(
  context: PagesContext,
  entry: MarkdownManifestEntry
): Promise<Response | null> {
  const { request, env } = context
  const asset = await env.ASSETS.fetch(new URL(entry.source, request.url).toString())
  if (!asset.ok) return null

  const body = await asset.arrayBuffer()
  const headers = new Headers()

  // 保留静态资源上已有的安全头与缓存头，只覆盖与正文相关的部分
  for (const name of ['cache-control', 'expires', 'content-language', 'x-content-type-options', 'referrer-policy', 'x-frame-options']) {
    const value = asset.headers.get(name)
    if (value) headers.set(name, value)
  }

  headers.set('Content-Type', 'text/markdown; charset=utf-8')
  headers.set('Vary', withVaryAccept(asset.headers.get('vary')))
  headers.set('Cache-Control', asset.headers.get('cache-control') ?? BODY_CACHE_CONTROL)

  // 正文已被替换，这些描述原始正文的头必须丢弃
  for (const name of ['content-encoding', 'content-range', 'transfer-encoding', 'etag', 'last-modified']) {
    headers.delete(name)
  }

  const tokens = entry.tokens || undefined
  if (tokens) headers.set('x-markdown-tokens', String(tokens))
  if (entry.originalTokens) headers.set('x-original-tokens', String(entry.originalTokens))

  // 告诉探针/Agent 这份内容的 Markdown 版本还能直接取
  if (entry.link) {
    headers.set('Link', `</${entry.link}>; rel="alternate"; type="text/markdown"`)
  }

  return new Response(body, { status: 200, headers })
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context

  // 只处理 GET / HEAD，且只对「明确点名要 Markdown」的请求做协商。
  // 浏览器、爬虫、监控探针的 Accept 不含 text/markdown，一律走原来的静态资源路径。
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return env.ASSETS.fetch(request)
  }

  const url = new URL(request.url)
  if (!prefersMarkdown(request.headers.get('accept')) || !isPagePath(url.pathname)) {
    return env.ASSETS.fetch(request)
  }

  const manifest = await loadManifest(request)
  const entry = manifest.routes[normalizeRoutePath(url.pathname)]

  if (entry) {
    const negotiated = await markdownResponse(context, entry)
    if (negotiated) return negotiated
  }

  // 有 Markdown 版本且取到了就返回；否则按原来的方式回退到 HTML
  const fallback = await env.ASSETS.fetch(request)
  if (fallback.status === 404) return notFoundResponse(request)
  return fallback
}
