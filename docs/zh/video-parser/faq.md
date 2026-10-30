---
outline: deep
description: "VRChat 视频解析常见问题解答：支持哪些平台、直播解析、网页能播但 VRChat 不能播、抖音解析失败、歌单选曲、地图白名单申请与常见错误码。"
---

# 常见问题

本文档列出使用 api.kipfel.link 视频解析服务时的常见问题。每个问题都是一个小节标题，小节的第一句话就是直接答案，便于快速取用。

## 支持的平台与内容

### VRChat 视频解析支持哪些平台？

当前 Go 工作区原生支持抖音、Bilibili、Twitter(X)、Instagram、快手、AcFun 六个视频平台；音乐支持网易云、酷狗、QQ音乐、酷我、汽水音乐。

::: info 已支持的平台
- **视频平台**：抖音、Bilibili、Twitter(X)、Instagram、快手、AcFun
- **弹幕支持**：抖音、Bilibili
- **直播支持**：Bilibili 直播、抖音直播、快手直播 (支持短链自动识别)
- **音乐平台**：网易云音乐、酷狗音乐、QQ音乐、酷我音乐、汽水音乐
:::

::: warning 注意
YouTube、YouTube Music、咪咕在当前工作区中为停用 / 未接入状态。以上是原生实现范围；独立部署的节点能力请以实际配置为准。
:::

## 直播解析

### 直播链接可以直接粘贴解析吗？

可以，无需选择类型，直接粘贴直播间地址，系统会自动切换到直播解析引擎。Bilibili、抖音、快手三大直播平台都支持，手机端分享的短链接（如 `b23.tv`、`v.douyin.com`）会自动执行重定向后再解析。

::: tip 粘贴前请务必去掉文案
粘贴直播间地址时请去掉所有文案（去掉文案！去掉文案！重要的事情说三遍！），只保留链接本体。
:::

::: warning 注意
- **直播解析**：直播链接通常带有较强的时效性和防盗链限制，建议解析后尽快使用。
- **弹幕解析**：弹幕目前只能咖啡厅使用播放，其他地图无法使用。
:::

## 播放与解析问题

### 为什么网页可以正常播放，但 VRChat 无法正常播放？

VRChat 内置播放器/某些播放器对 302 跳转或长链接支持不完整。先把你复制的链接在浏览器里打开解析一次，让它跳转到最终地址（通常会变成 `直链`），再把跳转后的链接复制到 VRChat 里播放。

### 为什么有的房间无法播放？

VRChat 官方于 2024.12.11 更新后，强制所有地图自行配备[域名白名单](https://docs.vrczh.org/creators.vrchat.com/worlds/udon/video-players/www-whitelist)。公开房中只有作者在该地图白名单里配置的资源链接才允许访问，私人类型房间则不受此限制。

### 为什么抖音无法正常解析？

因为分享文案里的 `#` 会被浏览器截断，服务端收不到 `#` 之后的链接。不要直接粘贴带文案的分享内容，建议删除所有文字，只保留链接本体再重试。

### 歌单怎么选第 N 首？为什么播放的不是我想要的那首？

先用 `/v4/playlist?url={网易云歌单链接}` 取到各首歌的 `tracks[].url`，选择后直接使用该链接。世界点歌则用 `/p?world={世界编号}&u={歌单ID}` 加载，再按返回的 `songs[].i` 使用 `/s/{i}?world={世界编号}`。当前代码没有接入旧版的 `i` / `index` / `@N` 选曲，不要自己用列表序号替代记录编号。

### 有些视频能解析，但在 VRChat 里卡顿/加载慢？

通常是源站网络波动，或者源站限制了国内/海外访问。本站已停止视频流量中转服务，建议使用合适的网络环境直接访问源站资源。

## 地图与白名单

### 我是公开地图作者，想添加这个解析站的支持，该怎么做？

请查看 [CDN 列表](/zh/video-parser/cdn) 页面，获取需要添加到白名单中的完整域名列表；然后发送[邮件](mailto:admin@kipfel.link?subject=域名解析列表申请&body=您好，我是xxx地图的作者xxx，需要添加对本站点的解析支持，这是我的地图的邀请链接：) 给作者，并附上你地图链接的信息，进行合作，会放到合作世界里面。

::: warning 注意
VRChat地图限制URLlist最大只有100个，请按需选添。
:::

## 关于本站

### 本站是 Kipfel 社区的官方项目吗？

不是。本网站非 Kipfel 社区制作，只是一个喜欢 Kipfel 的个人作者制作。本站完全免费，如果有人通过付费引导您使用，请向我反馈或举报。希望大家能帮忙推广，让更多人使用，谢谢大家喵！

## 常见错误码

| HTTP 状态码 | 业务代码 | 说明 |
| --- | --- | --- |
| `405` | `METHOD_NOT_ALLOWED` | 缺少 url 参数 |
| `418` | `IM_A_TEAPOT` | url 为空 |
| `422` | `INVALID_URL / UNSUPPORTED_PLATFORM` | 无效链接 / 不支持的平台 |
| `451` | `CONTENT_RESTRICTED` | 受限制内容 |
| `400 / 403` | `PARSE_ERROR` | 普通播放 / 非 Unity JSON 解析失败；规则拦截为 403 |
| `400` | `INVALID_WORLD / INVALID_POOL` | 世界编号或池参数无效 |
| `400` | `INVALID_INPUT / INVALID_LIST_SCOPE` | 缺少列表来源或 scope 无效 |
| `400` | `UNSUPPORTED_PLAYLIST` | 不支持该平台的列表 |
| `404` | `WORLD_OR_SLOT_NOT_FOUND` | 世界或记录不存在 |
| `403` | `WORLD_DISABLED` | 世界已停用 |
| `409` | `SLOT_POOL_FULL` | 池满且剩余记录仍受保护 |
| `502` | `SLOT_MEDIA_ERROR` | 记录的播放直链解析失败 |

::: tip JSON 判断
v1 JSON 的解析失败通常为 HTTP 200、`code: -1`；v3 / v4 Unity 分支解析失败可能仍为 `success: true` 的空数组。参数校验错误仍正常返回 HTTP 错误。详细结构见 [接口文档](/zh/video-parser/api)。
:::

## 联系方式

::: info 联系我们
- **合作以及问题联系**：[admin@kipfel.link](mailto:admin@kipfel.link)
- **运维人员 / 错误以及无法使用联系**：海落QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)
- **VRChat群组**：[https://vrc.group/KOOYL.8164](https://vrc.group/KOOYL.8164)
:::

## 相关页面

- [视频解析接口文档](/zh/video-parser/api) —— 端点地址、请求参数与返回字段
- [视频解析使用教程](/zh/video-parser/guide) —— 各接口的调用方式与支持的链接格式
- [CDN 域名列表](/zh/video-parser/cdn) —— 添加到地图白名单所需的完整域名清单
