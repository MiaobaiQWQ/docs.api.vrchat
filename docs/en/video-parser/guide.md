---
outline: deep
---

# Usage Guide

This document details how to use the Kipfel video parsing service.

## Video Parsing

### Basic Usage

Use the main interface for general video parsing:

```
https://api.kipfel.link/v1/vrc?url=
```

::: tip Tip
Simply paste the video link after `url=` without any additional processing.
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

Use the music interface to parse music, supporting playlist indexing. **YouTube Music links must use this interface.**

```
https://api.kipfel.link/v1/music?url=
```

::: warning Important
YouTube Music links must use the `/v1/music` interface, otherwise they cannot be parsed correctly.
:::

## Alternative Interfaces

If the main interface is unavailable, you can try the alternative interfaces:

::: info Alternative Options
- Video Alternative: `https://api.kipfel.link/v1/kfc?url=`
- Music Alternative: `https://api.kipfel.link/v1/musickfc?url=`
:::

## More Help

For other questions, please refer to the [FAQ](/en/video-parser/faq) page.
