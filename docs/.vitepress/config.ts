import { defineConfig } from 'vitepress'
import { buildEnd, sitemapOptions, transformHead } from './seo'

export default defineConfig({
  title: 'kipfel.link 接口文档',
  description:
    'kipfel.link 官方接口文档：面向 VRChat 的免费视频解析 API（v1 / v3）、弹幕与歌词接口、Busuanzi 访问统计接口的端点、参数、返回字段与错误码说明。',
  lang: 'zh-CN',
  ignoreDeadLinks: true,

  // 生成干净 URL（/zh/video-parser/api 而非 /api.html）
  cleanUrls: true,

  // 让 VitePress 读取 git 提交时间，为每页与 sitemap 提供真实的更新日期
  lastUpdated: true,

  // sitemap.xml（定义在 .vitepress/seo.ts 中）
  sitemap: sitemapOptions,

  // 每页独立的 canonical / hreflang / Open Graph / JSON-LD
  transformHead,

  // 构建结束后发布 .md 源文件、llms.txt、llms-full.txt
  buildEnd,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description:
        'kipfel.link 官方接口文档：面向 VRChat 的免费视频解析 API（v1 / v3）、弹幕与歌词接口、Busuanzi 访问统计接口的端点、参数、返回字段与错误码说明。',
      link: '/zh/'
    },
    en: {
      label: 'English',
      lang: 'en',
      description:
        'Official kipfel.link API documentation: free VRChat video parsing API (v1 / v3), danmaku and lyrics endpoints, and the self-hosted Busuanzi analytics API, with endpoints, parameters, response fields and error codes.',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          {
            text: 'Video Parser API',
            items: [
              { text: 'API Docs', link: '/en/video-parser/api' },
              { text: 'Video Parser Guide', link: '/en/video-parser/guide' },
              { text: 'Video Parser FAQ', link: '/en/video-parser/faq' },
              { text: 'CDN List', link: '/en/video-parser/cdn' }
            ]
          },
          { text: 'Busuanzi API', link: '/en/busuanzi/api' },
          { text: 'Landing Page', link: 'https://www.kipfel.wiki/' },
          {
            text: 'More',
            items: [
              { text: 'Changelog', link: '/en/video-parser/changelog' },
              { text: 'Team', link: '/en/video-parser/team' },
              { text: 'Domain Allocation', link: '/en/video-parser/domains' },
              { text: 'Partner Worlds', link: '/en/video-parser/partners' }
            ]
          }
        ],
        sidebar: [
          {
            text: 'Site Entry',
            items: [
              { text: 'Home', link: '/en/' },
              { text: 'Landing Page', link: 'https://www.kipfel.wiki/' }
            ]
          },
          {
            text: 'API Docs',
            items: [
              { text: 'Video Parser API', items: [
                { text: 'API Docs', link: '/en/video-parser/api' },
                { text: 'Video Parser Guide', link: '/en/video-parser/guide' },
                { text: 'Video Parser FAQ', link: '/en/video-parser/faq' },
                { text: 'CDN List', link: '/en/video-parser/cdn' }
              ]},
              { text: 'Busuanzi', items: [
                { text: 'API Docs', link: '/en/busuanzi/api' }
              ]},
              { text: 'Other', items: [
                { text: 'Changelog', link: '/en/video-parser/changelog' },
                { text: 'Team', link: '/en/video-parser/team' },
                { text: 'Domain Allocation', link: '/en/video-parser/domains' },
                { text: 'Partner Worlds', link: '/en/video-parser/partners' }
              ]}
            ]
          }
        ],
        outline: { label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Last updated' },
        editLink: {
          pattern: 'https://github.com/MiaobaiQWQ/docs.api.vrchat/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance'
      }
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      description:
        'kipfel.link 公式 API ドキュメント：VRChat 向け無料ビデオ解析 API（v1 / v3）、弾幕・歌詞エンドポイント、セルフホスト型 Busuanzi アクセス解析 API のエンドポイント、パラメータ、レスポンス項目、エラーコードをまとめています。',
      link: '/ja/',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/ja/' },
          {
            text: 'ビデオ解析 API',
            items: [
              { text: 'API ドキュメント', link: '/ja/video-parser/api' },
              { text: 'ビデオ解析チュートリアル', link: '/ja/video-parser/guide' },
              { text: 'ビデオ解析 FAQ', link: '/ja/video-parser/faq' },
              { text: 'CDN リスト', link: '/ja/video-parser/cdn' }
            ]
          },
          { text: 'Busuanzi API', link: '/ja/busuanzi/api' },
          { text: 'ランディングページ', link: 'https://www.kipfel.wiki/' },
          {
            text: 'その他',
            items: [
              { text: '更新履歴', link: '/ja/video-parser/changelog' },
              { text: 'チーム', link: '/ja/video-parser/team' },
              { text: 'ドメイン割り当て', link: '/ja/video-parser/domains' },
              { text: 'パートナーワールド', link: '/ja/video-parser/partners' }
            ]
          }
        ],
        sidebar: [
          {
            text: 'サイト入口',
            items: [
              { text: 'ホーム', link: '/ja/' },
              { text: 'ランディングページ', link: 'https://www.kipfel.wiki/' }
            ]
          },
          {
            text: 'API ドキュメント',
            items: [
              { text: 'ビデオ解析 API', items: [
                { text: 'API ドキュメント', link: '/ja/video-parser/api' },
                { text: 'ビデオ解析チュートリアル', link: '/ja/video-parser/guide' },
                { text: 'ビデオ解析 FAQ', link: '/ja/video-parser/faq' },
                { text: 'CDN リスト', link: '/ja/video-parser/cdn' }
              ]},
              { text: 'Busuanzi', items: [
                { text: 'API ドキュメント', link: '/ja/busuanzi/api' }
              ]},
              { text: 'その他', items: [
                { text: '更新履歴', link: '/ja/video-parser/changelog' },
                { text: 'チーム', link: '/ja/video-parser/team' },
                { text: 'ドメイン割り当て', link: '/ja/video-parser/domains' },
                { text: 'パートナーワールド', link: '/ja/video-parser/partners' }
              ]}
            ]
          }
        ],
        outline: { label: 'このページの内容' },
        docFooter: { prev: '前のページ', next: '次のページ' },
        lastUpdated: { text: '最終更新' },
        editLink: {
          pattern: 'https://github.com/MiaobaiQWQ/docs.api.vrchat/edit/main/docs/:path',
          text: 'GitHub でこのページを編集'
        },
        returnToTopLabel: 'トップへ戻る',
        sidebarMenuLabel: 'メニュー',
        darkModeSwitchLabel: '外観'
      }
    }
  },

  head: [
    ['link', { rel: 'icon', href: 'https://logo.kipfel.link/logos/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.png' }],
    ['link', { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }]
  ],

  themeConfig: {
    siteTitle: 'kipfel.link 接口文档',
    logo: '/favicon.png',
    nav: [
      { text: '首页', link: '/zh/' },
      {
        text: '视频解析接口',
        items: [
          { text: '接口文档', link: '/zh/video-parser/api' },
          { text: '视频解析使用教程', link: '/zh/video-parser/guide' },
          { text: '视频解析常见问题', link: '/zh/video-parser/faq' },
          { text: 'CDN 列表', link: '/zh/video-parser/cdn' }
        ]
      },
      { text: 'Busuanzi 接口', link: '/zh/busuanzi/api' },
      { text: '引导站', link: 'https://www.kipfel.wiki/' },
      {
        text: '更多',
        items: [
          { text: '更新日志', link: '/zh/video-parser/changelog' },
          { text: '团队', link: '/zh/video-parser/team' },
          { text: '域名分配', link: '/zh/video-parser/domains' },
          { text: '合作地图', link: '/zh/video-parser/partners' }
        ]
      }
    ],
    sidebar: [
      {
        text: '站点入口',
        items: [
          { text: '首页', link: '/zh/' },
          { text: '引导站', link: 'https://www.kipfel.wiki/' }
        ]
      },
      {
        text: '接口文档',
        items: [
          { text: '视频解析接口', items: [
            { text: '接口文档', link: '/zh/video-parser/api' },
            { text: '视频解析使用教程', link: '/zh/video-parser/guide' },
            { text: '视频解析常见问题', link: '/zh/video-parser/faq' },
            { text: 'CDN 列表', link: '/zh/video-parser/cdn' }
          ]},
          { text: 'Busuanzi', items: [
            { text: '接口文档', link: '/zh/busuanzi/api' }
          ]},
          { text: '其他', items: [
            { text: '更新日志', link: '/zh/video-parser/changelog' },
            { text: '团队', link: '/zh/video-parser/team' },
            { text: '域名分配', link: '/zh/video-parser/domains' },
            { text: '合作地图', link: '/zh/video-parser/partners' }
          ]}
        ]
      }
    ],
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' }
    },
    editLink: {
      pattern: 'https://github.com/MiaobaiQWQ/docs.api.vrchat/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    footer: {
      message: '非 Kipfel 社区制作，仅为个人作品',
      copyright: 'Copyright © 2026'
    },
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MiaobaiQWQ/docs.api.vrchat' }
    ]
  }
})
