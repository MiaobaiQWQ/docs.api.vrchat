---
outline: deep
---

# Tutorial

This document details how to use the Kipfel video parsing service.

## Video Parsing

### Basic Usage

Use the main interface for regular video parsing:

```
https://api.kipfel.link/v1/vrc?url=
```

::: tip
Just paste the video link after `url=`, no extra processing needed.
:::

### Supported Link Formats

You can use any of the following formats:

::: details 1. Full Link
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BVxxxxx
```
:::

::: details 2. BV Number
```
https://api.kipfel.link/v1/vrc?url=BVxxxxx
```
:::

::: details 3. Full Link with Parameters
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BVxxxx/?spm_id_from=333.1007.tianma.1-1-1.click&vd_source=f7c54e4cff604fb7865caae2a39f8041
```
:::

::: details 4. Short Link
```
https://api.kipfel.link/v1/vrc?url=https://b23.tv/xxxx
```
:::

## Music Parsing

Use the music interface to parse music, supporting playlist indexes. **Please use this interface for YouTube Music links.**

```
https://api.kipfel.link/v1/music?url=
```

::: warning Important
YouTube Music links must use the `/v1/music` interface, otherwise they cannot be parsed correctly.
:::

### Playlist Selection

Playlists count from 1. Use `&i=1` / `&i=2` to select the Nth song; you can also add `@1` / `@2` at the end.

```
https://api.kipfel.link/v1/music?url=https://music.163.com/playlist?id=123456&i=1
```

## Collection Parsing

`/v1/collection` returns a JS format playlist, supporting Bilibili multi-part videos, YouTube lists, etc.

```
https://api.kipfel.link/v1/collection?url=
```

## Backup Interfaces

If the main interface is unavailable, you can try the backup interfaces:

::: info Backup Options
- Video backup: `https://api.kipfel.link/v1/kfc?url=`
- Music backup: `https://api.kipfel.link/v1/musickfc?url=`
:::

## JSON Mode

Add the `json=1` parameter to make the interface return JSON format instead of a 302 redirect:

```
https://api.kipfel.link/v1/vrc?url=BVxxxxx&json=1
```

JSON response example:

```json
{
  "success": true,
  "url": "https://cdn.example.com/video.mp4"
}
```

## More Help

For other questions, please check the [FAQ](/en/video-parser/faq) page.
