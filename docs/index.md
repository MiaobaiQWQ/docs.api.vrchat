---
layout: home

# SEO：首页独立标题与描述。titleTemplate: false 表示不再追加「 | kipfel.link 接口文档」。
title: kipfel.link 接口文档 - VRChat 视频解析与 Busuanzi API
titleTemplate: false
description: "kipfel.link 官方接口文档站入口：面向 VRChat 的免费视频解析 API、弹幕与歌词接口，以及自建 Busuanzi 访问统计接口的完整说明，提供简体中文、English 与日本語三个版本。"
# 本页只是跳转页，规范地址归并到中文首页，避免搜索引擎收录一个空白页。
canonical: /zh/
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => {
  router.go('/zh/')
})
</script>

# kipfel.link 接口文档

面向 VRChat 的免费视频解析 API 与自建 Busuanzi 访问统计 API 的官方文档站，提供简体中文、English 与日本語三个语言版本。

本页是文档站入口，会自动跳转到简体中文版首页。如果没有自动跳转，请直接选择要阅读的语言：

- [简体中文文档](/zh/)
- [English documentation](/en/)
- [日本語ドキュメント](/ja/)
