import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Kipfel Wiki',
  description: 'VRChat 视频解析文档站',
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'VRChat 视频解析文档站',
      link: '/zh/'
    },
    en: {
      label: 'English',
      lang: 'en',
      description: 'VRChat Video Parser Documentation',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { 
            text: 'Guide', 
            items: [
              { text: 'Tutorial', link: '/en/video-parser/guide' },
              { text: 'FAQ', link: '/en/video-parser/faq' }
            ]
          },
          { text: 'API Docs', link: '/en/video-parser/api' },
          { text: 'CDN List', link: '/en/video-parser/cdn' },
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
            text: 'Quick Start',
            items: [
              { text: 'Home', link: '/en/' }
            ]
          },
          {
            text: 'Video Parser',
            items: [
              { text: 'Guide', items: [
                { text: 'Tutorial', link: '/en/video-parser/guide' },
                { text: 'FAQ', link: '/en/video-parser/faq' }
              ]},
              { text: 'Reference', items: [
                { text: 'API Docs', link: '/en/video-parser/api' },
                { text: 'CDN List', link: '/en/video-parser/cdn' }
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
      description: 'VRChat ビデオパーサードキュメント',
      link: '/ja/',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/ja/' },
          { 
            text: 'ガイド', 
            items: [
              { text: 'チュートリアル', link: '/ja/video-parser/guide' },
              { text: 'FAQ', link: '/ja/video-parser/faq' }
            ]
          },
          { text: 'API ドキュメント', link: '/ja/video-parser/api' },
          { text: 'CDN リスト', link: '/ja/video-parser/cdn' },
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
            text: 'クイックスタート',
            items: [
              { text: 'ホーム', link: '/ja/' }
            ]
          },
          {
            text: 'ビデオパーサー',
            items: [
              { text: 'ガイド', items: [
                { text: 'チュートリアル', link: '/ja/video-parser/guide' },
                { text: 'FAQ', link: '/ja/video-parser/faq' }
              ]},
              { text: 'リファレンス', items: [
                { text: 'API ドキュメント', link: '/ja/video-parser/api' },
                { text: 'CDN リスト', link: '/ja/video-parser/cdn' }
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
        text: '使用指南', 
        items: [
          { text: '使用教程', link: '/zh/video-parser/guide' },
          { text: '常见问题', link: '/zh/video-parser/faq' }
        ]
      },
      { text: 'API 文档', link: '/zh/video-parser/api' },
      { text: 'CDN 列表', link: '/zh/video-parser/cdn' },
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
        text: '快速开始',
        items: [
          { text: '首页', link: '/zh/' }
        ]
      },
      {
        text: '视频解析',
        items: [
          { text: '使用指南', items: [
            { text: '使用教程', link: '/zh/video-parser/guide' },
            { text: '常见问题', link: '/zh/video-parser/faq' }
          ]},
          { text: '参考文档', items: [
            { text: 'API 文档', link: '/zh/video-parser/api' },
            { text: 'CDN 列表', link: '/zh/video-parser/cdn' }
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
