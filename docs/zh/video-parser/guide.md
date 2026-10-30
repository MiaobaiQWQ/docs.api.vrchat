---
outline: deep
description: "VRChat 视频解析使用教程：如何在 api.kipfel.link 调用 /v1/vrc、/v1/music 与备用接口，并支持完整链接、BV 号、带参数链接与短链接四种输入格式。"
---

# 使用教程

本文档详细介绍如何使用 Kipfel 视频解析服务。

## 视频解析

视频解析使用主接口 `/v1/vrc`，把要解析的视频链接直接接在 `url=` 后面即可，浏览器里打开就会 302 跳转到去水印直链。

### 基本使用

使用主接口进行常规视频解析：

```
https://api.kipfel.link/v1/vrc?url=
```

::: tip 提示
普通链接直接接在 `url=` 后面即可。链接带 `&`、`#` 或分 P 参数时，请先把内层链接做 URL 编码，避免参数被截断；程序调用推荐用 `--data-urlencode`。
:::

### 支持的链接格式

你可以使用以下任意一种格式：

::: details 1. 完整链接
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6
```
:::

::: details 2. BV号
```
https://api.kipfel.link/v1/vrc?url=BV1aAhm6vEA6
```
:::

::: details 3. 带参数的完整链接
```
https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1aAhm6vEA6%3Fp%3D2
```
:::

::: details 4. 短链接
```
https://api.kipfel.link/v1/vrc?url=https://b23.tv/xxxx
```
:::

## 音乐解析

使用 `/v1/music?url={音乐链接}` 解析单首歌曲，成功时 302 跳转到播放直链。当前原生解析器支持网易云、酷狗、QQ音乐、酷我、汽水音乐。

::: tip 歌单选歌
先用 `/v4/playlist?url={网易云歌单链接}` 读取每首歌的 `tracks[].url`，或用 `/p?world={世界编号}&u={歌单ID}` 加载到世界，再按返回的 `songs[].i` 使用 `/s/{i}?world={世界编号}`。当前没有接入 `i` / `index` / `@N` 选曲。
:::

::: warning 注意
当前工作区的 YouTube、YouTube Music、咪咕原生解析器未接入，不能靠换成音乐接口恢复。
:::

## 备用接口

下面两个备用地址目前与主接口使用同一套处理逻辑，可以兼容旧地址，但不保证是独立线路。

::: info 备用选项
- 视频备用：`https://api.kipfel.link/v1/kfc?url=`
- 音乐备用：`https://api.kipfel.link/v1/musickfc?url=`
:::

## JSON、歌词与弹幕

只要直链就用普通播放器 UA；歌词 / 弹幕组件使用含 `Unity` 的 UA，或加 `json=1`。这是两次独立请求，不是在一次请求里放两个 UA。

```bash
curl -G "https://api.kipfel.link/v1/music" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "json=1"
curl -G -A "Unity demo" "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "media=1"
```

v1 JSON 使用 `code` / `data.content.play_url`；v3 / v4 弹幕读取 `data.comments`，歌词读取 `data.lyrics`（时间单位秒）。封面按 `cover_mode` / `cover_encoding` 读取。完整字段见 [接口文档](/zh/video-parser/api)。

## 世界槽位与视频分 P

先由管理员创建世界编号，再将 `/s/{n}?world={世界编号}`（音乐）与 `/sell/{n}?world={世界编号}`（视频）烤入世界。`/poll?world=...` 读取音乐，`/pocl?world=...` 读取视频；用 `/p?world=...&u={链接}` 加载列表。哔哩哔哩可加 `scope=parts` / `scope=collection`，编号以返回的 `i` 为准。

## 更多帮助

如有其他问题，请查看 [常见问题](/zh/video-parser/faq) 页面。

## 相关页面

- [视频解析接口文档](/zh/video-parser/api) —— 端点地址、请求参数与返回字段
- [视频解析常见问题](/zh/video-parser/faq) —— 播放失败与解析异常的排查方法
- [CDN 域名列表](/zh/video-parser/cdn) —— 添加到 VRChat 地图白名单所需的域名
