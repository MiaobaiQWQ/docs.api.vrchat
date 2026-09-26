import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import type { HeadConfig, SiteConfig, TransformContext } from 'vitepress'
import { writeMarkdownManifest } from './markdown-negotiation'

/* ==================================================================== *
 *  一、站点品牌常量
 *  全站（含页面 head、JSON-LD、llms.txt、sitemap）唯一的品牌口径来源。
 *  改动这里即可统一「全网品牌描述」，避免多处不一致。
 * ==================================================================== */

export const SITE_URL = 'https://docs.api.vrchat.kipfel.wiki'
export const SITE_NAME = 'kipfel.link 接口文档'
export const SITE_NAME_EN = 'kipfel.link API Documentation'

export const ORG_NAME = 'kipfel.link'
export const LANDING_URL = 'https://www.kipfel.wiki/'
export const REPO_URL = 'https://github.com/MiaobaiQWQ/docs.api.vrchat'
export const CONTACT_EMAIL = 'admin@kipfel.link'

export const API_BASE = 'https://api.kipfel.link/'
export const BUSUANZI_BASE = 'https://busuanzi.kipfel.link/'

const OG_IMAGE = `${SITE_URL}/favicon.png`

/* ==================================================================== *
 *  二、语言与路由工具
 * ==================================================================== */

type Locale = 'zh' | 'en' | 'ja'

const ALL_LOCALES: Locale[] = ['zh', 'en', 'ja']

const LOCALE_META: Record<Locale, { prefix: string; lang: string; ogLocale: string }> = {
  zh: { prefix: '/zh', lang: 'zh-CN', ogLocale: 'zh_CN' },
  en: { prefix: '/en', lang: 'en', ogLocale: 'en' },
  ja: { prefix: '/ja', lang: 'ja', ogLocale: 'ja' }
}

const HOME_LABEL: Record<Locale, string> = {
  zh: '首页',
  en: 'Home',
  ja: 'ホーム'
}

/** `zh/video-parser/api.md` -> `/zh/video-parser/api`（与 cleanUrls 一致，不带 .html） */
function toRoutePath(relativePath: string): string {
  const route = relativePath.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  return `/${route}`
}

function localeOf(routePath: string): Locale {
  for (const locale of ALL_LOCALES) {
    const { prefix } = LOCALE_META[locale]
    if (routePath === `${prefix}/` || routePath.startsWith(`${prefix}/`)) return locale
  }
  return 'zh'
}

/** 去掉语言前缀后的「页面键」，用于生成 hreflang 互链 */
function pageKey(routePath: string): string {
  const locale = localeOf(routePath)
  const { prefix } = LOCALE_META[locale]
  if (routePath === `${prefix}/`) return '/'
  return routePath.startsWith(`${prefix}/`) ? routePath.slice(prefix.length) : routePath
}

/** 同一页面在三种语言下的绝对地址 */
function alternatesFor(routePath: string) {
  const key = pageKey(routePath)
  return ALL_LOCALES.map((locale) => ({
    locale,
    lang: LOCALE_META[locale].lang,
    url: `${SITE_URL}${LOCALE_META[locale].prefix}${key}`
  }))
}

/* ==================================================================== *
 *  三、页面类型判定
 *  GEO 的关键：告诉 AI「这一页是什么」，它才知道该怎么引用。
 * ==================================================================== */

type PageKind = 'home' | 'api' | 'faq' | 'guide' | 'team' | 'article'

function kindOf(routePath: string): PageKind {
  const key = pageKey(routePath)
  if (key === '/') return 'home'
  if (key.endsWith('/api')) return 'api'
  if (key.endsWith('/faq')) return 'faq'
  if (key.endsWith('/guide')) return 'guide'
  if (key.endsWith('/team')) return 'team'
  return 'article'
}

const SECTION_LABEL: Record<string, Record<Locale, string>> = {
  '/video-parser': { zh: '视频解析接口', en: 'Video Parser API', ja: 'ビデオ解析 API' },
  '/busuanzi': { zh: 'Busuanzi 接口', en: 'Busuanzi API', ja: 'Busuanzi API' }
}

/* ==================================================================== *
 *  四、API 端点表
 *  schema.org 用 EntryPoint(httpMethod / urlTemplate) 精确描述每个端点，
 *  这是 API 文档能被 AI 准确引用（而不是猜错参数）的核心。
 * ==================================================================== */

interface EndpointDef {
  method: string
  urlTemplate: string
  name: Record<Locale, string>
}

const API_ENDPOINTS: Record<string, EndpointDef[]> = {
  '/video-parser/api': [
    { method: 'GET', urlTemplate: `${API_BASE}v1/vrc?url={url}`, name: { zh: '视频解析（302 跳转直链）', en: 'Video parsing (302 redirect to direct link)', ja: 'ビデオ解析（302 で直リンクへリダイレクト）' } },
    { method: 'GET', urlTemplate: `${API_BASE}v1/vrc-json?url={url}`, name: { zh: '视频解析（始终返回 JSON）', en: 'Video parsing (always returns JSON)', ja: 'ビデオ解析（常に JSON を返す）' } },
    { method: 'GET', urlTemplate: `${API_BASE}v1/kfc?url={url}`, name: { zh: '备用视频解析接口', en: 'Alternative video parsing endpoint', ja: '代替ビデオ解析エンドポイント' } },
    { method: 'GET', urlTemplate: `${API_BASE}v1/music?url={url}&i={index}`, name: { zh: '音乐解析（支持歌单索引）', en: 'Music parsing (supports playlist index)', ja: '音楽解析（プレイリスト索引対応）' } },
    { method: 'GET', urlTemplate: `${API_BASE}v1/musickfc?url={url}&i={index}`, name: { zh: '备用音乐解析接口', en: 'Alternative music parsing endpoint', ja: '代替音楽解析エンドポイント' } },
    { method: 'GET', urlTemplate: `${API_BASE}v3/vrc-danmaku?url={url}&limit={limit}`, name: { zh: '弹幕接口（需 Unity User-Agent）', en: 'Danmaku endpoint (requires Unity User-Agent)', ja: '弾幕エンドポイント（Unity User-Agent 必須）' } },
    { method: 'GET', urlTemplate: `${API_BASE}v3/vrc-lyric?url={url}`, name: { zh: '歌词接口（需 Unity User-Agent）', en: 'Lyrics endpoint (requires Unity User-Agent)', ja: '歌詞エンドポイント（Unity User-Agent 必須）' } }
  ],
  '/busuanzi/api': [
    { method: 'POST', urlTemplate: `${BUSUANZI_BASE}api`, name: { zh: '上报访问并返回统计值', en: 'Report a visit and return counters', ja: 'アクセスを送信して統計値を返す' } },
    { method: 'PUT', urlTemplate: `${BUSUANZI_BASE}api`, name: { zh: '仅上报访问（PV/UV +1）', en: 'Report a visit only (PV/UV +1)', ja: 'アクセス送信のみ（PV/UV +1）' } },
    { method: 'GET', urlTemplate: `${BUSUANZI_BASE}api`, name: { zh: '仅读取统计值（不改变计数）', en: 'Read counters only (does not mutate)', ja: '統計値の読み取りのみ（カウントは変更しない）' } },
    { method: 'GET', urlTemplate: `${BUSUANZI_BASE}jsonp?callback={callback}`, name: { zh: 'JSONP 兼容接口', en: 'JSONP compatible endpoint', ja: 'JSONP 互換エンドポイント' } }
  ]
}

/* ==================================================================== *
 *  五、JSON-LD 结构化数据（GEO 的“可读、可信”）
 * ==================================================================== */

interface RegisteredPage {
  routePath: string
  key: string
  locale: Locale
  kind: PageKind
  title: string
  description: string
}

/** transformHead 期间收集，buildEnd 时用于生成 llms.txt */
const registry = new Map<string, RegisteredPage>()

function breadcrumbNode(routePath: string, title: string, locale: Locale) {
  const key = pageKey(routePath)
  const segments = key.split('/').filter(Boolean)
  const items: Record<string, unknown>[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: HOME_LABEL[locale],
      item: `${SITE_URL}${LOCALE_META[locale].prefix}/`
    }
  ]

  if (segments.length > 1) {
    const section = `/${segments[0]}`
    const label = SECTION_LABEL[section]?.[locale]
    if (label) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: `${SITE_URL}${LOCALE_META[locale].prefix}${section}`
      })
    }
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: title,
    item: `${SITE_URL}${routePath}`
  })

  return { '@type': 'BreadcrumbList', '@id': `${SITE_URL}${routePath}#breadcrumb`, itemListElement: items }
}

function mainEntityFor(kind: PageKind, routePath: string, locale: Locale) {
  const key = pageKey(routePath)

  if (kind === 'api') {
    const endpoints = API_ENDPOINTS[key]
    if (!endpoints) return undefined
    return {
      '@type': 'WebAPI',
      name: key.startsWith('/busuanzi') ? 'Busuanzi API' : 'VRChat Video Parser API',
      documentation: `${SITE_URL}${routePath}`,
      provider: { '@id': `${SITE_URL}/#organization` },
      potentialAction: endpoints.map((endpoint) => ({
        '@type': 'Action',
        name: endpoint.name[locale],
        target: {
          '@type': 'EntryPoint',
          urlTemplate: endpoint.urlTemplate,
          httpMethod: endpoint.method,
          contentType: 'application/json'
        }
      }))
    }
  }

  return undefined
}

/* ------------------------------------------------------------------ *
 *  FAQ 提取：直接从页面正文的 `### 问题？` + 紧随其后的答案段落生成
 *  FAQPage.mainEntity，避免在 frontmatter 里重复维护一份问答。
 * ------------------------------------------------------------------ */

function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 从 Markdown 源文件中提取指定层级标题，以及紧随其后的第一个正文段落。
 * 这样 FAQPage / HowTo 的结构化数据与页面正文始终同源，不需要在 frontmatter 里重复维护。
 * 约定见 README「维护约定」：标题后必须紧跟一段直接回答，容器块放在其后。
 */
function extractSections(filePath: string, level: 2 | 3): { title: string; text: string }[] {
  if (!fs.existsSync(filePath)) return []

  const source = fs.readFileSync(filePath, 'utf-8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  const lines = source.split(/\r?\n/)
  const headingRe = new RegExp(`^#{${level}}\\s+(.+?)\\s*$`)
  const items: { title: string; text: string }[] = []

  for (let i = 0; i < lines.length; i += 1) {
    const heading = lines[i].match(headingRe)
    if (!heading) continue

    let text = ''
    for (let j = i + 1; j < lines.length; j += 1) {
      const line = lines[j].trim()
      if (!line) continue
      if (/^#{1,6}\s/.test(line)) break
      // 跳过 VitePress ::: 容器标记，直到遇到真正的正文段落
      if (line.startsWith(':::')) continue
      // 列表 / 表格 / 代码块不算「首句直接答案」
      if (/^([-*+]|\d+\.)\s/.test(line) || line.startsWith('|') || line.startsWith('```')) break
      text = line
      break
    }

    if (text) items.push({ title: plainText(heading[1]), text: plainText(text) })
  }

  return items
}

function buildStructuredData(ctx: TransformContext, routePath: string, reg: RegisteredPage) {
  const { locale, kind, title, description } = reg
  const lang = LOCALE_META[locale].lang
  const url = `${SITE_URL}${routePath}`
  const orgId = `${SITE_URL}/#organization`
  const websiteId = `${SITE_URL}/#website`
  const pageId = `${url}#webpage`
  const mainId = `${url}#main`

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: ORG_NAME,
      url: LANDING_URL,
      logo: { '@type': 'ImageObject', url: OG_IMAGE },
      sameAs: [REPO_URL, LANDING_URL],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'technical support',
          email: CONTACT_EMAIL,
          availableLanguage: ALL_LOCALES.map((l) => LOCALE_META[l].lang)
        }
      ]
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: SITE_NAME_EN,
      inLanguage: ALL_LOCALES.map((l) => LOCALE_META[l].lang),
      publisher: { '@id': orgId }
    }
  ]

  const webpage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': pageId,
    url,
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { '@id': websiteId },
    publisher: { '@id': orgId },
    isAccessibleForFree: true
  }

  if (ctx.pageData.lastUpdated) {
    webpage.dateModified = new Date(ctx.pageData.lastUpdated).toISOString()
  }

  if (kind === 'home') {
    webpage.about = { '@id': orgId }
  } else {
    webpage.breadcrumb = { '@id': `${url}#breadcrumb` }
    webpage.mainEntity = { '@id': mainId }
    graph.push(breadcrumbNode(routePath, title, locale))
  }

  graph.push(webpage)

  if (kind !== 'home') {
    const main: Record<string, unknown> = {
      '@id': mainId,
      '@type':
        kind === 'api'
          ? 'APIReference'
          : kind === 'faq'
            ? 'FAQPage'
            : kind === 'guide'
              ? 'HowTo'
              : kind === 'team'
                ? 'AboutPage'
                : 'TechArticle',
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { '@id': websiteId },
      url
    }

    const entity = mainEntityFor(kind, routePath, locale)
    if (entity) main.mainEntity = entity

    if (kind === 'faq') {
      const faq = extractSections(path.join(ctx.siteConfig.srcDir, ctx.pageData.filePath), 3)
      if (faq.length > 0) {
        main.mainEntity = faq.map((item) => ({
          '@type': 'Question',
          name: item.title,
          acceptedAnswer: { '@type': 'Answer', text: item.text }
        }))
      }
    }

    if (kind === 'guide') {
      const steps = extractSections(path.join(ctx.siteConfig.srcDir, ctx.pageData.filePath), 2)
      if (steps.length > 0) {
        main.step = steps.map((step) => ({
          '@type': 'HowToStep',
          name: step.title,
          text: step.text
        }))
      }
    }

    graph.push(main)
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

/* ==================================================================== *
 *  六、transformHead —— 每页独立的 canonical / hreflang / OG / JSON-LD
 * ==================================================================== */

export function transformHead(ctx: TransformContext): HeadConfig[] {
  // VitePress 在没有自定义 404.md 时也会用一份内部数据渲染该页，跳过即可。
  if (ctx.page === '404.md') return []

  const routePath = toRoutePath(ctx.page)
  const locale = localeOf(routePath)
  const kind = kindOf(routePath)
  const url = `${SITE_URL}${routePath}`
  // ctx.title 已带上「 | kipfel.link 接口文档」后缀，结构化数据里用不带后缀的页面标题，
  // 品牌由 og:site_name / WebSite 节点承担，避免标题里品牌重复。
  const title = ctx.pageData.title || ctx.title
  const description = ctx.description

  const reg: RegisteredPage = {
    routePath,
    key: pageKey(routePath),
    locale,
    kind,
    title,
    description
  }
  registry.set(routePath, reg)

  const alternates = alternatesFor(routePath)

  // 允许页面用 frontmatter.canonical 覆盖规范地址（用于 / 这类跳转页归并到 /zh/）
  const canonicalOverride = ctx.pageData.frontmatter?.canonical
  const canonicalUrl = canonicalOverride ? `${SITE_URL}${canonicalOverride}` : url

  const head: HeadConfig[] = [
    ['link', { rel: 'canonical', href: canonicalUrl }],
    // hreflang 互链：让搜索引擎与 AI 明确知道三语版本是同一份文档
    ...alternates.map((alt): HeadConfig => ['link', { rel: 'alternate', hreflang: alt.lang, href: alt.url }]),
    ['link', { rel: 'alternate', hreflang: 'x-default', href: alternates[0].url }],
    ['meta', { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' }],

    ['meta', { property: 'og:type', content: kind === 'home' ? 'website' : 'article' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: LOCALE_META[locale].ogLocale }],
    ...ALL_LOCALES.filter((l) => l !== locale).map(
      (l): HeadConfig => ['meta', { property: 'og:locale:alternate', content: LOCALE_META[l].ogLocale }]
    ),
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],

    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],

    ['script', { type: 'application/ld+json' }, buildStructuredData(ctx, routePath, reg)]
  ]

  return head
}

/* ==================================================================== *
 *  六之二、transformHtml —— 404 页的静态兜底正文
 * ==================================================================== */

/**
 * VitePress 对 404.md 的正文有特殊处理，模板里写死了：
 *
 *     <div id="app">${page === "404.md" ? "" : content}</div>
 *
 * 也就是说渲染好的正文会被整个丢掉，内容完全交给客户端渲染。
 * 后果是构建产物 404.html 里没有任何 <h1>；而它同时又是 CDN 上真实存在的
 * 静态资源（线上 /404.html 返回的是 200，而不是 404），Bing 会把它当普通
 * 页面抓取，于是报「缺少 h1 标记」。
 *
 * 这里把 VitePress 丢掉的那段正文补回 <div id="app">：
 *   - 爬虫与禁用 JavaScript 的用户能看到标题与语言入口；
 *   - 正常浏览器加载脚本后由 Vue 接管并覆盖，视觉与之前完全一致。
 * 正文唯一来源仍是 docs/404.md，不需要在这里重复维护一份。
 */
export function transformHtml(code: string, _id: string, ctx: TransformContext): string {
  if (ctx.page !== '404.md') return code
  return code.replace('<div id="app"></div>', `<div id="app">${ctx.content}</div>`)
}

/* ==================================================================== *
 *  七、sitemap
 *  说明：
 *  1. VitePress 只会把「根 locale」之外的翻译配对成 hreflang links，本站中文位于
 *     /zh/ 前缀下，配对结果不完整，因此剔除 sitemap 内的 alternate 链接，
 *     统一交由页面 head 中的 hreflang 承担。
 *  2. 根路径 / 是一个纯跳转页（canonical 指向 /zh/），按搜索引擎规范不应出现在
 *     sitemap 中，否则会与 canonical 信号冲突。VitePress 对根 index.md 生成的
 *     item.url 是空字符串（不是绝对地址），因此要按相对路径过滤。
 *  3. 自定义 404.md 会被算进 siteConfig.pages，VitePress 的 sitemap 生成器不做
 *     404 过滤，会多出一条 /404，同样需要剔除。
 * ==================================================================== */

const ROOT_REDIRECT_URL = `${SITE_URL}/`

/**
 * 不应出现在 sitemap 中的地址。
 *
 * 注意：transformItems 收到的 item.url 是**相对路径**，而且不带前导斜杠 ——
 * 根首页是空字符串 ''，404 页是 '404'（VitePress 只做 .md 后缀剥离）。
 * 这里把带/不带斜杠的形式都列上，避免依赖上游的字符串细节。
 */
const SITEMAP_EXCLUDED_URLS = new Set(['', '404', '/404', '404.html', '/404.html', ROOT_REDIRECT_URL])

export const sitemapOptions = {
  hostname: SITE_URL,
  transformItems: (items: Record<string, unknown>[]) =>
    items
      .filter((item) => typeof item.url === 'string' && !SITEMAP_EXCLUDED_URLS.has(item.url))
      .map(({ links: _links, ...rest }) => rest)
}

/* ==================================================================== *
 *  八、buildEnd —— 输出给 AI 直接抓取的纯 Markdown + llms.txt
 * ==================================================================== */

const PAGE_ORDER = [
  '/video-parser/api',
  '/video-parser/guide',
  '/video-parser/faq',
  '/video-parser/cdn',
  '/busuanzi/api',
  '/video-parser/changelog',
  '/video-parser/domains',
  '/video-parser/partners',
  '/video-parser/team'
]

const LOCALE_SECTION: Record<Locale, string> = {
  zh: '## 简体中文 (zh-CN)',
  en: '## English (en)',
  ja: '## 日本語 (ja)'
}

const LLMS_INTRO = `# kipfel.link 接口文档 (kipfel.link API Documentation)

> kipfel.link 是面向 VRChat 玩家的免费视频 / 音频解析与网站访问统计接口服务。本站是它的官方接口文档站，
> 覆盖 VRChat 视频解析 API（v1 / v3）、弹幕与歌词接口、Busuanzi 访问统计接口的端点地址、请求参数、
> 返回字段与错误码，并提供简体中文、English、日本語 三个语言版本。
>
> kipfel.link is the official documentation site for the free VRChat video/audio parsing API and the
> self-hosted Busuanzi analytics API. It documents every endpoint, parameter, response field and error
> code in Simplified Chinese, English and Japanese.

## 关键事实 / Key facts

- 文档站 / Docs: ${SITE_URL}/zh/
- 视频解析接口基础地址 / Video parser API base: ${API_BASE}
- Busuanzi 接口基础地址 / Busuanzi API base: ${BUSUANZI_BASE}
- 源码仓库 / Source repository: ${REPO_URL}
- 联系方式 / Contact: ${CONTACT_EMAIL}
- 授权模式 / Licensing: 免费使用，禁止转售；非 Kipfel 社区官方项目，由个人作者维护 / Free to use, not for resale; an independent personal project, not affiliated with the Kipfel community.

## 阅读建议 / How to read this site

- 需要调用接口：先读「视频解析接口」的 API 文档，再看使用教程与常见问题。
- 需要适配 VRChat 地图白名单：读「CDN 域名列表」。
- 每个页面都提供对应的 \`.md\` 源文件（下方链接），没有导航与样式噪音，解析成本更低。
- 所有页面均提供 zh-CN / en / ja 三个语言版本，路径前缀分别为 \`/zh/\`、\`/en/\`、\`/ja/\`。
`

interface LlmsEntry {
  routePath: string
  title: string
  description: string
  key: string
  locale: Locale
}

function sortEntries(entries: LlmsEntry[]) {
  return entries.sort((a, b) => {
    const ai = PAGE_ORDER.indexOf(a.key)
    const bi = PAGE_ORDER.indexOf(b.key)
    const ar = ai === -1 ? PAGE_ORDER.length : ai
    const br = bi === -1 ? PAGE_ORDER.length : bi
    return ar - br || a.key.localeCompare(b.key)
  })
}

function renderLlmsTxt(entries: LlmsEntry[]) {
  const lines: string[] = [LLMS_INTRO]

  for (const locale of ALL_LOCALES) {
    const group = sortEntries(entries.filter((entry) => entry.locale === locale))
    if (group.length === 0) continue
    lines.push('', LOCALE_SECTION[locale], '')
    for (const entry of group) {
      lines.push(`- [${entry.title}](${SITE_URL}${entry.routePath}.md): ${entry.description}`)
    }
  }

  lines.push(
    '',
    '## 机器可读资源 / Machine-readable',
    '',
    `- [sitemap.xml](${SITE_URL}/sitemap.xml): 全站页面索引 / full page index`,
    `- [robots.txt](${SITE_URL}/robots.txt)`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): 本文件所有页面的 Markdown 全文拼接 / all pages concatenated`,
    ''
  )

  return lines.join('\n')
}

export async function buildEnd(siteConfig: SiteConfig) {
  const { srcDir, outDir } = siteConfig

  // 1) 把每个页面的 Markdown 源文件原样发布出去，供 AI 直接抓取。
  let copied = 0
  for (const page of siteConfig.pages) {
    const from = path.join(srcDir, page)
    if (!fs.existsSync(from)) continue
    const to = path.join(outDir, page)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to)
    copied += 1
  }

  // 2) 生成 llms.txt
  const entries: LlmsEntry[] = []
  for (const reg of registry.values()) {
    if (reg.kind === 'home') continue
    entries.push({
      routePath: reg.routePath,
      title: reg.title,
      description: reg.description,
      key: reg.key,
      locale: reg.locale
    })
  }
  fs.writeFileSync(path.join(outDir, 'llms.txt'), renderLlmsTxt(entries), 'utf-8')

  // 3) 生成 Markdown 内容协商清单（/_agents/markdown.json）
  //    Pages Function 靠它把 Accept: text/markdown 的请求映射到上面的 .md 文件，
  //    并给出 x-markdown-tokens / x-original-tokens。
  //    注意：registry 里包含三语首页（前面 llms.txt 会跳过它们），首页同样需要协商。
  const manifest = await writeMarkdownManifest({
    // 运行时查表用的是规整后的路径（/zh/、/zh/index 都归到 /zh），清单键必须与之一致
    routes: [...registry.keys()].sort(),
    outDir,
    resolve: (sitePath) => path.join(outDir, sitePath.replace(/^\//, '')),
    readFile: (filePath) => fsp.readFile(filePath),
    writeFile: (filePath, data) => fsp.writeFile(filePath, data, 'utf-8'),
    join: (...parts) => path.join(...parts),
    mkdir: (dir, opts) => fsp.mkdir(dir, opts),
    exists: (filePath) => fs.existsSync(filePath)
  })
  const negotiated = Object.keys(manifest.routes).length

  // 3) 生成 llms-full.txt
  const full: string[] = [
    '# kipfel.link 接口文档 — 全文 / Full content',
    '',
    `> ${SITE_NAME}（${SITE_URL}）全部页面的 Markdown 正文拼接，便于一次性读取。`,
    ''
  ]
  for (const locale of ALL_LOCALES) {
    for (const entry of sortEntries(entries.filter((item) => item.locale === locale))) {
      const file = path.join(srcDir, `${entry.routePath.replace(/^\//, '')}.md`)
      if (!fs.existsSync(file)) continue
      full.push(
        '---',
        '',
        `<!-- 页面 / page: ${SITE_URL}${entry.routePath} -->`,
        '',
        fs
          .readFileSync(file, 'utf-8')
          .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
          .trim(),
        ''
      )
    }
  }
  fs.writeFileSync(path.join(outDir, 'llms-full.txt'), full.join('\n'), 'utf-8')

  siteConfig.logger.info(
    `seo: published ${copied} markdown source file(s), llms.txt (${entries.length} pages), llms-full.txt and markdown negotiation manifest (${negotiated} routes)`
  )
}
