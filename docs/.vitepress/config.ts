import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'kipfel.link 接口文档',
  description: 'kipfel.link 接口文档站',
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'kipfel.link 接口文档站',
      link: '/zh/'
    },
    en: {
      label: 'English',
      lang: 'en',
      description: 'kipfel.link API documentation site',
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
        ]
      }
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      description: 'kipfel.link API ドキュメントサイト',
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
        ]
      }
    }
  },

  head: [
    ['link', { rel: 'icon', href: 'https://logo.kipfel.link/logos/favicon.svg', type: 'image/svg+xml' }]
  ],

  themeConfig: {
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
