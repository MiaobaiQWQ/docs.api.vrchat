#!/usr/bin/env node
/* ==================================================================== *
 *  SEO 静态检查（构建产物扫描）
 *
 *  背景：Bing 站长平台报过两类问题 ——
 *    1. 「缺少图像的 Alt 属性」：VitePress 的 VPImage 在 logo 写成字符串时
 *       会渲染出 <img ... alt>（空 alt），全站每页都中招；
 *    2. 「缺少 h1 标记」：根跳转页没有 hero、内置 404 模板也没有标题。
 *
 *  这两类问题都属于「改一处、漏一处」的典型，所以不只修内容，还在这里加一道
 *  构建期兜底：npm run build 之后自动扫描 dist 里每一份 HTML，
 *  任何页面缺 <h1>、或存在 alt 为空/缺失的 <img>，就让构建失败。
 *
 *  这么做的好处：
 *    - 免费：纯 Node 标准库，无第三方依赖、无外部服务；
 *    - 多平台：只看最终 HTML，与托管平台无关（Cloudflare Pages / Vercel /
 *      Netlify / 本地），换平台照样生效；标准 HTML 也对所有搜索引擎通用；
 *    - 持续维护：新增页面若漏了 h1 或图片 alt，构建当场失败，不靠人工记得。
 *
 *  用法：
 *    node scripts/check-seo.mjs [distDir]      # 默认 docs/.vitepress/dist
 *
 *  注意：如果确实需要放行某张图（例如纯装饰图），请给它显式的
 *  alt="" 之外的语义 —— 但不建议；Bing 会继续报「缺少 Alt 属性」。
 * ==================================================================== */

import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.argv[2] ?? 'docs/.vitepress/dist')

if (!fs.existsSync(distDir)) {
  console.error(`[check-seo] 找不到构建产物目录：${distDir}`)
  console.error('[check-seo] 请先执行 npm run build（本检查必须在 VitePress 构建之后运行）。')
  process.exit(1)
}

/** 递归收集目录下所有 .html 文件（返回相对 distDir 的路径，便于阅读） */
function collectHtml(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) collectHtml(full, base, out)
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(path.relative(base, full))
  }
  return out
}

/**
 * 提取 <img> 的 alt 值。
 * 返回 undefined 表示属性缺失（含裸 alt），返回 '' 表示 alt=""，两者都算不合格。
 */
function readAlt(tag) {
  const match = tag.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i)
  if (!match) return undefined
  return match[1] ?? match[2] ?? match[3] ?? ''
}

/** 检查单份 HTML，返回该页的问题列表 */
function inspectHtml(html) {
  const problems = []

  // <h1> 计数：<h1> 或 <h1 class="..."> 都算，<h1x> 不算
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length
  if (h1Count === 0) problems.push({ kind: 'error', message: '缺少 <h1> 标记' })
  else if (h1Count > 1) problems.push({ kind: 'warn', message: `检测到 ${h1Count} 个 <h1>，建议每页只保留一个` })

  // <img> 的 alt 必须存在且非空
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = readAlt(tag)
    if (alt === undefined) {
      problems.push({ kind: 'error', message: `图片缺少 alt 属性：${tag.slice(0, 120)}` })
    } else if (alt.trim() === '') {
      problems.push({ kind: 'error', message: `图片 alt 为空：${tag.slice(0, 120)}` })
    }
  }

  return problems
}

const files = collectHtml(distDir).sort()
let errors = 0
let warnings = 0
const failedPages = []

for (const file of files) {
  const html = fs.readFileSync(path.join(distDir, file), 'utf8')
  const problems = inspectHtml(html)
  const pageErrors = problems.filter((p) => p.kind === 'error')
  const pageWarnings = problems.filter((p) => p.kind === 'warn')

  errors += pageErrors.length
  warnings += pageWarnings.length

  if (problems.length > 0) {
    failedPages.push(file)
    console.log(`\n✗ ${file}`)
    for (const problem of problems) console.log(`    ${problem.kind === 'error' ? '错误' : '警告'}：${problem.message}`)
  }
  if (pageErrors.length > 0) process.exitCode = 1
}

/* ------------------------------------------------------------------ *
 *  sitemap 卫生检查
 *
 *  VitePress 的 sitemap 生成器不做任何过滤，而它拿到的 item.url 是**不带前导
 *  斜杠的相对路径**（根首页 ''、404 页 '404'），很容易过滤漏掉：
 *    - 根首页是纯跳转页（canonical 指向 /zh/），收录它会与 canonical 信号冲突；
 *    - 404 页不应出现在 sitemap 里。
 *  这两个都真实踩过，所以在这里钉死。
 * ------------------------------------------------------------------ */
const SITEMAP_FORBIDDEN = new Set(['/', '/404', '/404.html'])

const sitemapPath = path.join(distDir, 'sitemap.xml')
if (fs.existsSync(sitemapPath)) {
  const locs = [...fs.readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1])
  for (const loc of locs) {
    let pathname
    try {
      pathname = new URL(loc).pathname
    } catch {
      pathname = loc
    }
    if (SITEMAP_FORBIDDEN.has(pathname)) {
      errors += 1
      process.exitCode = 1
      console.log(`\n✗ sitemap.xml\n    错误：不应收录 ${loc}`)
    }
  }
}

if (errors === 0 && warnings === 0) {
  console.log(`[check-seo] 通过：${files.length} 个页面，全部含 <h1>，且所有 <img> 都有非空 alt。`)
} else {
  console.log(
    `\n[check-seo] 扫描 ${files.length} 个页面，${failedPages.length} 个页面有问题：` +
      `错误 ${errors} 个，警告 ${warnings} 个。`
  )
  if (errors > 0) {
    console.log('[check-seo] 存在错误，构建判定为失败。请修好上面的页面后重新构建。')
  }
}
