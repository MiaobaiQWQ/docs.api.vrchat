---
outline: deep
---

# 使用教程

本文档详细介绍如何使用 Kipfel 视频解析服务。

## 视频解析

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

### 歌单选择

歌单从 1 开始计数。用 `&i=1` / `&i=2` 选择第 N 首；也支持在末尾加 `@1` / `@2`。

```
https://api.kipfel.link/v1/music?url=https://music.163.com/playlist?id=123456&i=1
```

## 合集解析

`/v1/collection` 返回 JS 格式播放列表，支持 B站多P、YouTube 列表等。

```
https://api.kipfel.link/v1/collection?url=
```

## 备用接口

如果主接口无法使用，可以尝试备用接口：

::: info 备用选项
- 视频备用：`https://api.kipfel.link/v1/kfc?url=`
- 音乐备用：`https://api.kipfel.link/v1/musickfc?url=`
:::

## JSON 模式

添加 `json=1` 参数可以让接口返回 JSON 格式而不是 302 跳转：

```
https://api.kipfel.link/v1/vrc?url=BVxxxxx&json=1
```

JSON 响应示例：

```json
{
  "success": true,
  "url": "https://cdn.example.com/video.mp4"
}
```

## 更多帮助

如有其他问题，请查看 [常见问题](/zh/faq) 页面。
