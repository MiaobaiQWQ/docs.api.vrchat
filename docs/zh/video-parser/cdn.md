---
outline: deep
description: "VRChat 地图白名单所需的完整 CDN 域名列表：Bilibili、快手、抖音与音乐平台的视频、直播与音频节点，可直接复制添加到 URLlist。"
---

# CDN 域名列表

本页面列出了 VRChat 公开房间需要添加到白名单中的 CDN 域名。

::: tip 注意
VRChat地图限制URLlist最大只有100个，请按需选添。
:::

::: tip 建议
建议在 VRChat 播放器使用 `api.kipfel.link` 域名作为接口。
:::

## 解析接口

- `api.kipfel.link`

## Bilibili CDN

- `upos-sz-mirroraliov.bilivideo.com`
- `upos-sz-mirrorhw.bilivideo.com`
- `upos-sz-mirrorcos.bilivideo.com`
- `upos-hz-mirroraliov.bilivideo.com`
- `upos-hz-mirrorakam.akamaized.net`

## Bilibili 直播 CDN

- `d1--ov-gotcha207.bilivideo.com`
- `d1--ov-gotcha105.bilivideo.com`
- `d1--cn-gotcha104.bilivideo.com`

## 快手 CDN

- `txmov2.a.kwimgs.com`
- `ali2.a.yximgs.com`

## 抖音 CDN

- `v5-dy-ov-experiment.zjcdn.com`
- `v27-cold.douyinvod.com`
- `v5-se-sjy-daily-cold.douyinvod.com`
- `pull-hs-f5.flive.douyincdn.com`
- `v3.douyinvod.com`

## AcFun CDN

- `tx-safety-video.acfun.cn`

## 音乐 CDN

- `music-api-qedge.kipfel.cloud`
- `music-api.kipfel.cloud`
- `music-api-ally.kipfel.cloud`
- `music-api-tx.kipfel.cloud`

## 完整域名列表

以下是所有需要添加到白名单中的域名汇总：

```
api.kipfel.link
upos-sz-mirroraliov.bilivideo.com
upos-sz-mirrorhw.bilivideo.com
upos-sz-mirrorcos.bilivideo.com
upos-hz-mirroraliov.bilivideo.com
upos-hz-mirrorakam.akamaized.net
d1--ov-gotcha207.bilivideo.com
txmov2.a.kwimgs.com
ali2.a.yximgs.com
v5-dy-ov-experiment.zjcdn.com
v27-cold.douyinvod.com
v5-se-sjy-daily-cold.douyinvod.com
pull-hs-f5.flive.douyincdn.com
tx-safety-video.acfun.cn
v3.douyinvod.com
d1--ov-gotcha105.bilivideo.com
d1--cn-gotcha104.bilivideo.com
music-api-qedge.kipfel.cloud
music-api.kipfel.cloud
music-api-ally.kipfel.cloud
music-api-tx.kipfel.cloud
```

## 如何添加到 VRChat 地图

如果您是地图作者，需要将上述域名添加到您的地图白名单中：

1. 在白名单配置中添加上述域名
2. 注意 URLlist 最大只有 100 个，请按需选择。

## 申请添加解析站支持

如果您希望添加对本站点的解析支持，请发送邮件到 [admin@kipfel.link](mailto:admin@kipfel.link?subject=域名解析列表申请&body=您好，我是xxx地图的作者xxx，需要添加对本站点的解析支持，这是我的地图的邀请链接：)，并附上您和您地图的相关信息。

## 相关页面

- [视频解析接口文档](/zh/video-parser/api) —— 端点地址、请求参数与返回字段
- [视频解析使用教程](/zh/video-parser/guide) —— 各接口的调用方式
- [视频解析常见问题](/zh/video-parser/faq) —— 地图白名单与播放问题排查
- [域名分配](/zh/video-parser/domains) —— 各子域名的用途说明
