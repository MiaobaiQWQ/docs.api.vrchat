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
直接在 `url=` 后面粘贴视频链接即可，无需额外处理。
:::

### 支持的链接格式

你可以使用以下任意一种格式：

::: details 1. 完整链接
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BVxxxxx
```
:::

::: details 2. BV号
```
https://api.kipfel.link/v1/vrc?url=BVxxxxx
```
:::

::: details 3. 带参数的完整链接
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BVxxxx/?spm_id_from=333.1007.tianma.1-1-1.click&vd_source=f7c54e4cff604fb7865caae2a39f8041
```
:::

::: details 4. 短链接
```
https://api.kipfel.link/v1/vrc?url=https://b23.tv/xxxx
```
:::

## 音乐解析

使用音乐接口解析音乐，支持歌单索引。**YouTube Music 链接请务必使用此接口。**

```
https://api.kipfel.link/v1/music?url=
```

::: warning 重要
YouTube Music 链接必须使用 `/v1/music` 接口，否则无法正常解析。
:::

## 备用接口

如果主接口无法使用（例如线路故障或被限流），可以换用下面这两个功能完全相同、但走不同线路的备用接口。

::: info 备用选项
- 视频备用：`https://api.kipfel.link/v1/kfc?url=`
- 音乐备用：`https://api.kipfel.link/v1/musickfc?url=`
:::

## 更多帮助

如有其他问题，请查看 [常见问题](/zh/video-parser/faq) 页面。

## 相关页面

- [视频解析接口文档](/zh/video-parser/api) —— 端点地址、请求参数、返回字段与频率限制
- [视频解析常见问题](/zh/video-parser/faq) —— 播放失败与解析异常的排查方法
- [CDN 域名列表](/zh/video-parser/cdn) —— 添加到 VRChat 地图白名单所需的域名
