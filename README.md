# kipfel.link 接口文档（docs.api.vrchat.kipfel.wiki）

面向 VRChat 的免费视频解析 API 与自建 Busuanzi 访问统计 API 的官方文档站，基于
[VitePress](https://vitepress.dev/) 构建，部署在 Cloudflare Pages。

- 线上地址：<https://docs.api.vrchat.kipfel.wiki>
- 源码仓库：<https://github.com/MiaobaiQWQ/docs.api.vrchat>
- 语言版本：简体中文（`/zh/`）、English（`/en/`）、日本語（`/ja/`）

## 本地开发

```bash
npm install
npm run dev       # 本地预览 http://localhost:5173
npm run build     # 构建到 docs/.vitepress/dist
npm run preview   # 预览构建产物
```

## 目录结构

```
docs/
├─ index.md                  根路径，跳转到 /zh/（canonical 指向 /zh/）
├─ 404.md                    自定义 404 页（含 <h1>，并声明 noindex）
├─ zh|en|ja/                 三个语言版本的内容
│  ├─ index.md               首页
│  ├─ video-parser/          视频解析：api / guide / faq / cdn / changelog / domains / partners / team
│  └─ busuanzi/api.md        Busuanzi 接口文档
├─ public/                   直接复制到站点根目录的静态资源
│  ├─ robots.txt             搜索引擎与 AI 爬虫规则 + Content Signals + sitemap 声明
│  ├─ _headers               Cloudflare Pages 响应头（含 .md 的 Content-Type、Vary: Accept）
│  └─ _routes.json           让 Pages Function 接管全站请求
└─ .vitepress/
   ├─ config.ts              站点配置：导航、侧边栏、SEO 开关
   ├─ seo.ts                 SEO / GEO 的全部实现（head、JSON-LD、sitemap、llms.txt、协商清单）
   └─ markdown-negotiation.ts 内容协商规则与 token 估算（构建期使用）

functions/
└─ [[path]].ts               Cloudflare Pages Function：Accept 内容协商（运行期使用）

scripts/
└─ check-seo.mjs             构建后 SEO 自检：缺 <h1> / 图片 alt 为空 / sitemap 收录 404 即失败
```

## SEO / GEO 实现说明

所有与搜索引擎、AI 引用相关的逻辑都集中在 `docs/.vitepress/seo.ts`，`config.ts` 只负责挂载。

| 能力 | 实现位置 | 说明 |
| --- | --- | --- |
| 每页独立 `<title>` / `description` | 各页面 frontmatter | `description` 是必填项，见下方「维护约定」 |
| `sitemap.xml` | `seo.ts` → `sitemapOptions` | 由 VitePress 内置生成，附带 git 提交日期作为 `lastmod`；剔除根跳转页与 404 页 |
| 干净 URL | `config.ts` → `cleanUrls: true` | 页面地址为 `/zh/video-parser/api`，不带 `.html` |
| `canonical` | `seo.ts` → `transformHead` | 每页指向自身；`/` 通过 frontmatter `canonical: /zh/` 归并 |
| `hreflang` 三语互链 | `seo.ts` → `transformHead` | zh-CN / en / ja + `x-default` |
| Open Graph / Twitter Card | `seo.ts` → `transformHead` | 含 `og:locale:alternate` |
| JSON-LD 结构化数据 | `seo.ts` → `buildStructuredData` | `Organization` + `WebSite` + `WebPage` + `BreadcrumbList` + 页面主体类型 |
| API 端点结构化 | `seo.ts` → `API_ENDPOINTS` | 用 `WebAPI` + `EntryPoint`（`httpMethod` / `urlTemplate`）描述每个端点 |
| FAQ 结构化 | `seo.ts` → `extractFaq` | 从正文的 `### 问题？` + 首句答案自动生成 `FAQPage`，无需重复维护 |
| 教程步骤结构化 | `seo.ts` → `transformHead` | 由 H2 标题自动生成 `HowTo.step` |
| `robots.txt` | `docs/public/robots.txt` | 显式允许 GPTBot / ClaudeBot / PerplexityBot 等 AI 爬虫 |
| Content Signals 内容使用信号 | `docs/public/robots.txt` | `Content-Signal: ai-train=yes, search=yes, ai-input=yes` |
| Markdown 内容协商 | `functions/[[path]].ts` | `Accept: text/markdown` 时返回页面的 Markdown 版本 |
| `llms.txt` | 构建时生成 | 由各页 frontmatter 的 title / description 自动汇总 |
| `llms-full.txt` | 构建时生成 | 全部页面 Markdown 正文拼接 |
| 页面 `.md` 直出版本 | 构建时生成 | 每个页面同时发布一份 Markdown 源文件，供 AI 直接抓取 |
| 每页 `<h1>` 与图片 `alt` | `scripts/check-seo.mjs` | 构建后扫描产物，缺 `<h1>` 或 `<img alt>` 为空即让构建失败 |
| 自定义 404 页 | `docs/404.md` + `seo.ts` → `transformHtml` | VitePress 会清空 404 正文，这里补回静态兜底并声明 `noindex` |

构建时 `seo.ts` 的 `buildEnd` 会自动：

1. 把 `docs/**/*.md` 原样复制到 `docs/.vitepress/dist/` 下同名路径；
2. 依据收集到的页面元数据生成 `llms.txt` 与 `llms-full.txt`；
3. 生成内容协商清单 `docs/.vitepress/dist/_agents/markdown.json`。

因此 **`.md`、`llms.txt`、`llms-full.txt`、协商清单都不需要手动维护**，新增页面后重新构建即可。

构建的最后一步是 `scripts/check-seo.mjs`（`npm run build` 已经串上，也可单独跑 `npm run check:seo`）。
它扫描 `docs/.vitepress/dist` 里的每一份 HTML 与 `sitemap.xml`，任何一项不达标就让构建失败：

| 检查项 | 判定 |
| --- | --- |
| 页面缺少 `<h1>` | 错误（Bing「缺少 h1 标记」） |
| 页面有多个 `<h1>` | 警告（不失败） |
| `<img>` 没有 `alt`，或 `alt=""` | 错误（Bing「缺少图像的 Alt 属性」） |
| `sitemap.xml` 收录了 `/`、`/404`、`/404.html` | 错误 |

纯 Node 标准库实现，不依赖任何第三方服务，且只看最终 HTML，
因此与托管平台无关（Cloudflare Pages / Vercel / Netlify / 本地都一样生效）。

## Markdown 内容协商（Markdown for Agents）

Agent 抓网页时最想要的是正文 Markdown，而不是带导航、样式、脚本的 HTML 外壳。
本站通过 [内容协商](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Guides/Content_negotiation)
在同一个 URL 上提供两种表示：

```bash
curl -H "Accept: text/markdown" https://docs.api.vrchat.kipfel.wiki/zh/video-parser/api
```

```
HTTP/2 200
content-type: text/markdown; charset=utf-8
vary: Accept
x-markdown-tokens: 3216
x-original-tokens: 19539
link: </zh/video-parser/api.md>; rel="alternate"; type="text/markdown"
```

实现拆成两半，都在仓库里：

| 环节 | 位置 | 职责 |
| --- | --- | --- |
| 构建期 | `.vitepress/markdown-negotiation.ts` + `seo.ts` 的 `buildEnd` | 算出每个路由的 `.md` 资源与 token 数，写出 `/_agents/markdown.json` |
| 运行期 | `functions/[[path]].ts` | 读清单做协商，命中就返回 `.md`，否则原样透传静态资源 |

协商判定（只认**显式**点名 `text/markdown`）：

| 请求的 `Accept` | 返回 |
| --- | --- |
| `text/markdown` / `text/markdown, text/plain, */*` | Markdown |
| `text/html,application/xhtml+xml,*/*;q=0.8`（浏览器） | HTML |
| `text/markdown;q=0` | HTML（显式拒绝） |
| `text/html` 的 q 更高 | HTML（尊重客户端偏好） |
| 没有 `Accept` / 只有 `*/*` | HTML（HTML 仍是默认） |

几个容易踩的点，都已经在实现里处理：

- **`Vary: Accept` 必须存在**。同一个 URL 有两种表示，少了它边缘缓存会把 HTML 变体
  喂给要 Markdown 的 Agent（反之亦然）。函数响应和 `_headers` 里都声明了。
- **首页路由的路径映射**：VitePress 把 `zh/index.md` 发布成 `/zh/index.md`，
  而 `/zh` 与 `/zh/` 指的是同一个页面，清单键统一收成 `/zh`。
  清单是**按构建产物实际存在的文件**生成的，不靠猜 VitePress 的落盘规则。
- **`.md` 正文与文档源文件同源**：协商返回的就是 `buildEnd` 发布的那份 Markdown，
  不存在两份内容需要同步。
- **静态资源不受影响**：图片、字体、`llms.txt`、`robots.txt` 即使带上
  `Accept: text/markdown` 也按原样返回（末段带扩展名的路径不参与协商）。
- `functions/[[path]].ts` 与 `.vitepress/markdown-negotiation.ts` 里的
  「协商规则 + token 估算」是同一套逻辑的两份副本（函数里必须用相对路径 import 才能被打包）。
  **改其中一处务必同步另一处**，否则构建期清单与线上行为会不一致。

本地验证（`functions/` 需要 wrangler 才能真正执行）：

```bash
npx wrangler pages dev docs/.vitepress/dist --port 8799
curl -s -D- -o- -H "Accept: text/markdown" http://127.0.0.1:8799/zh/video-parser/api | head -20
curl -s -D- -o- http://127.0.0.1:8799/zh/video-parser/api | head -5   # 应为 HTML
```

线上验收（第三方探针）：

```bash
curl -s -X POST https://isitagentready.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://docs.api.vrchat.kipfel.wiki"}'
# 期望 checks.contentAccessibility.markdownNegotiation.status == "pass"
```

当前线上状态（2026-09-26 实测）：

| 检查项 | 结果 |
| --- | --- |
| `contentAccessibility.markdownNegotiation` | `pass` |
| `botAccessControl.contentSignals` | `pass` |
| 站点等级 | 3 · Agent-Readable |

> 验收时务必带查询串或 `Cache-Control: no-cache` 绕过边缘缓存，
> 否则可能读到上一次部署的 HTML 变体，把「已支持」误判为「不支持」。

> 补充：Cloudflare 自身也有 zone 级的
> [Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)，
> 在 AI Crawl Control 里一键开启即可，但要 **Pro / Business 及以上套餐**。
> 本仓库的实现不依赖套餐，并且在功能上更可控（直接返回文档源 Markdown，而不是把 HTML 反推回 Markdown）。

## 维护约定

新增或修改页面时，请遵守以下几条，否则 SEO / GEO 效果会打折：

1. **每个页面必须有 `description`**（150–160 字符左右，中文约 60–90 字）。
   它是页面的 `<meta name="description">`，也是 `llms.txt` 里该页的摘要。
2. **正文只用一个 H1**，层级不要跳级（`## → ### → ####`）。
   标题层级既影响搜索引擎理解，也决定 `HowTo` 步骤的生成。
   **每张图片都要有非空的 `alt`**（写描述性文字；空字符串 `alt=""` 会被 Bing 判成
   「缺少图像的 Alt 属性」，屏幕阅读器也读不出内容）。
   这两条由 `scripts/check-seo.mjs` 在构建末尾强制校验，违规直接构建失败。
3. **FAQ 页每个问题写成 `### 问题？`，紧接着用一段话直接给出答案**，
   容器块（`:::`）放在答案段落之后。`FAQPage` 结构化数据就是按这个结构自动提取的。
4. **新增页面后把页面键加进 `seo.ts` 的 `PAGE_ORDER`**，用于控制 `llms.txt` 里的排序；
   不加也能工作，只是排在同组末尾。
5. **新增 API 页时在 `seo.ts` 的 `API_ENDPOINTS` 中补上端点表**，
   否则该页不会输出 `WebAPI` / `EntryPoint` 结构化数据。
6. **保持品牌口径统一**：对外一律使用 `kipfel.link 接口文档`、`docs.api.vrchat.kipfel.wiki`
   与 `https://github.com/MiaobaiQWQ/docs.api.vrchat`。站点名称、仓库地址等常量集中在
   `seo.ts` 顶部，改一处即可全站生效。
7. **改内容信号 / 爬虫策略时改 `docs/public/robots.txt`**。
   `Content-Signal` 只写一行、放在文件顶部的全局段：`ai-train` / `search` / `ai-input`
   三项分别代表「训练或微调模型」「建立搜索索引」「送入模型做检索增强」。
   本站是公开接口文档，三项均为 `yes`。
8. **改了 `_headers` 或函数后，测试时要重启本地 wrangler**（`_headers` 会热重载，
   但 `functions/` 的改动不一定立刻生效）。另外 `_headers` 每条规则**只允许一个通配符**，
   `/*/*.md` 这类写法会被 wrangler 警告并整条跳过 —— 单条 `/*.md` 已经能匹配任意层级。
9. **站点 Logo 的 `alt` 在 `config.ts` 里维护**，且必须把 `themeConfig.logo` 写成对象形式：

   ```ts
   logo: { src: '/favicon.png', alt: 'kipfel.link 接口文档' }
   ```

   写成字符串（`logo: '/favicon.png'`）时 VitePress 的 `VPImage` 会渲染出 `<img ... alt>`
   —— 一个空 `alt`，于是**全站每一页**都会被 Bing 报「缺少图像的 Alt 属性」。
   `en` / `ja` 两个 locale 各自覆盖了本地语言的 `alt`，新增语言时记得一并补上。

## 部署

Cloudflare Pages：

- 构建命令：`npm run build`
- 输出目录：`docs/.vitepress/dist`

`_headers` 与 `_routes.json` 必须位于**输出目录**才能生效，所以它们放在 `docs/public/`
而不是仓库根目录（`_routes.json` 的作用是让 Pages 把全站请求交给 `functions/` 处理）。

`functions/` 目录放在**仓库根目录**（不是 `docs/` 下），Pages 会在构建时自动识别并打包成 Worker。

推送 `main` 后 Cloudflare Pages 自动部署，**约 2~3 分钟**线上生效。

> 首次带 `functions/` 部署后，建议用 `curl -H "Accept: text/markdown"` 复核一次线上行为：
> 函数生效但 `_headers` 或清单没跟上，都会表现为「仍然返回 HTML」。

## ⚠️ 改完 head 内容后必须清缓存

Cloudflare Pages 对静态资源默认返回 `Cache-Control: public, max-age=3600, must-revalidate`，
而且**部署不会清掉边缘缓存里已有的旧条目**。实测：改完内容重新部署后，`/` 连续请求 10 次
全是 `CF-Cache-Status: HIT`，`Age` 只增不减（超过 14 小时），内容始终是旧版本 ——
`must-revalidate` 并不会触发重新验证，**不要指望它自愈**。

所以每次改动页面 `<head>`（验证标记、canonical、meta 等）之后：

> Cloudflare Dashboard → 选中 `kipfel.wiki` 这个 zone → 缓存 Caching → 配置 Configuration
> → **清除全部缓存 Purge Everything**

然后搜索引擎才抓得到新内容。只清 `/` 单条 URL 只解决该 URL。

自检新旧部署是否生效的可靠手段是加查询串绕过缓存键（会 MISS 并回源）：

```bash
curl -s "https://docs.api.vrchat.kipfel.wiki/?cb=$RANDOM" | grep -o 'google-site-verification'
```

## 两个平台行为上的坑

**1. `.html` 会被硬编码 308 重定向到无扩展名 URL，配置关不掉。**

```
/zh/video-parser/api      -> 200
/zh/video-parser/api.html -> 308  Location: /zh/video-parser/api
```

这带来两个结论：

- 开启 `cleanUrls: true` 是与平台对齐的正确选择。改之前站内每个链接都要吃一次 308。
- **Google Search Console 的「HTML 文件」校验方式在本站必然失败**，因为 GSC 要抓的是确切的
  `/googleXXXX.html`，被 308 掉之后内容不在原 URL 上。请一律使用 **meta 标记**方式验证，
  标记加在 `config.ts` 的 `head` 里（全站注入，不依赖校验的是 `/` 还是 `/zh/`）。
  另注意：GSC 的「HTML 标记」与「HTML 文件」给的 token 不一样，不能互相套用。

**2. `_headers` 的重叠规则优先级未验证。** 目前 `/*` 只设安全头，`/assets/*` 设长缓存，
两者没有冲突。如果想给 HTML 加 `max-age=0` 来免掉清缓存这一步，需要先确认 `/*` 与
`/assets/*` 同时设 `Cache-Control` 时哪条生效，否则可能覆盖掉静态资源的 `immutable` 缓存。

## 站点归属验证标记

Google 与神马的验证 meta 标记统一加在 `docs/.vitepress/config.ts` 的 `head` 数组里，
由 `siteConfig.head` 注入，因此**每个页面**的 `<head>` 都带，无论站长平台校验的是 `/`
还是 `/zh/` 等语言首页都能命中。

**验证成功后不可移除**，否则会掉验证状态；所以走配置 + 版本管理，不要临时手改 HTML。

## 提交 sitemap

构建产物中的 `sitemap.xml` 位于 `/sitemap.xml`。首次上线后需手动提交：

- Google Search Console
- Bing Webmaster Tools
- 神马搜索站长平台

`robots.txt` 已包含 `Sitemap:` 声明，多数爬虫会自动发现。
