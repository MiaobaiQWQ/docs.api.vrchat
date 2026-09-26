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
├─ zh|en|ja/                 三个语言版本的内容
│  ├─ index.md               首页
│  ├─ video-parser/          视频解析：api / guide / faq / cdn / changelog / domains / partners / team
│  └─ busuanzi/api.md        Busuanzi 接口文档
├─ public/                   直接复制到站点根目录的静态资源
│  ├─ robots.txt             搜索引擎与 AI 爬虫规则 + sitemap 声明
│  └─ _headers               Cloudflare Pages 响应头（含 .md 的 Content-Type）
└─ .vitepress/
   ├─ config.ts              站点配置：导航、侧边栏、SEO 开关
   └─ seo.ts                 SEO / GEO 的全部实现（head、JSON-LD、sitemap、llms.txt）
```

## SEO / GEO 实现说明

所有与搜索引擎、AI 引用相关的逻辑都集中在 `docs/.vitepress/seo.ts`，`config.ts` 只负责挂载。

| 能力 | 实现位置 | 说明 |
| --- | --- | --- |
| 每页独立 `<title>` / `description` | 各页面 frontmatter | `description` 是必填项，见下方「维护约定」 |
| `sitemap.xml` | `seo.ts` → `sitemapOptions` | 由 VitePress 内置生成，附带 git 提交日期作为 `lastmod` |
| 干净 URL | `config.ts` → `cleanUrls: true` | 页面地址为 `/zh/video-parser/api`，不带 `.html` |
| `canonical` | `seo.ts` → `transformHead` | 每页指向自身；`/` 通过 frontmatter `canonical: /zh/` 归并 |
| `hreflang` 三语互链 | `seo.ts` → `transformHead` | zh-CN / en / ja + `x-default` |
| Open Graph / Twitter Card | `seo.ts` → `transformHead` | 含 `og:locale:alternate` |
| JSON-LD 结构化数据 | `seo.ts` → `buildStructuredData` | `Organization` + `WebSite` + `WebPage` + `BreadcrumbList` + 页面主体类型 |
| API 端点结构化 | `seo.ts` → `API_ENDPOINTS` | 用 `WebAPI` + `EntryPoint`（`httpMethod` / `urlTemplate`）描述每个端点 |
| FAQ 结构化 | `seo.ts` → `extractFaq` | 从正文的 `### 问题？` + 首句答案自动生成 `FAQPage`，无需重复维护 |
| 教程步骤结构化 | `seo.ts` → `transformHead` | 由 H2 标题自动生成 `HowTo.step` |
| `robots.txt` | `docs/public/robots.txt` | 显式允许 GPTBot / ClaudeBot / PerplexityBot 等 AI 爬虫 |
| `llms.txt` | 构建时生成 | 由各页 frontmatter 的 title / description 自动汇总 |
| `llms-full.txt` | 构建时生成 | 全部页面 Markdown 正文拼接 |
| 页面 `.md` 直出版本 | 构建时生成 | 每个页面同时发布一份 Markdown 源文件，供 AI 直接抓取 |

构建时 `seo.ts` 的 `buildEnd` 会自动：

1. 把 `docs/**/*.md` 原样复制到 `docs/.vitepress/dist/` 下同名路径；
2. 依据收集到的页面元数据生成 `llms.txt` 与 `llms-full.txt`。

因此 **`.md`、`llms.txt`、`llms-full.txt` 都不需要手动维护**，新增页面后重新构建即可。

## 维护约定

新增或修改页面时，请遵守以下几条，否则 SEO / GEO 效果会打折：

1. **每个页面必须有 `description`**（150–160 字符左右，中文约 60–90 字）。
   它是页面的 `<meta name="description">`，也是 `llms.txt` 里该页的摘要。
2. **正文只用一个 H1**，层级不要跳级（`## → ### → ####`）。
   标题层级既影响搜索引擎理解，也决定 `HowTo` 步骤的生成。
3. **FAQ 页每个问题写成 `### 问题？`，紧接着用一段话直接给出答案**，
   容器块（`:::`）放在答案段落之后。`FAQPage` 结构化数据就是按这个结构自动提取的。
4. **新增页面后把页面键加进 `seo.ts` 的 `PAGE_ORDER`**，用于控制 `llms.txt` 里的排序；
   不加也能工作，只是排在同组末尾。
5. **新增 API 页时在 `seo.ts` 的 `API_ENDPOINTS` 中补上端点表**，
   否则该页不会输出 `WebAPI` / `EntryPoint` 结构化数据。
6. **保持品牌口径统一**：对外一律使用 `kipfel.link 接口文档`、`docs.api.vrchat.kipfel.wiki`
   与 `https://github.com/MiaobaiQWQ/docs.api.vrchat`。站点名称、仓库地址等常量集中在
   `seo.ts` 顶部，改一处即可全站生效。

## 部署

Cloudflare Pages：

- 构建命令：`npm run build`
- 输出目录：`docs/.vitepress/dist`

`_headers` 必须位于**输出目录**才能生效，所以它放在 `docs/public/` 而不是仓库根目录。

推送 `main` 后 Cloudflare Pages 自动部署，**约 2~3 分钟**线上生效。

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
