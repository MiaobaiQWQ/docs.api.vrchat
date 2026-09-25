---
outline: deep
description: "Usage guide for the api.kipfel.link video parser: calling /v1/vrc, /v1/music and the alternative endpoints with full links, BV ids and short links."
---

# Usage Guide

This document details how to use the Kipfel video parsing service.

## Video Parsing

Video parsing uses the main `/v1/vrc` endpoint: append the video link directly after `url=`, and opening it in a browser returns a 302 redirect to the watermark-free direct link.

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

If the main interface is unavailable (for example a failed route or rate limiting), switch to the alternative endpoints below, which behave identically but run on different routes.

::: info Alternative Options
- Video Alternative: `https://api.kipfel.link/v1/kfc?url=`
- Music Alternative: `https://api.kipfel.link/v1/musickfc?url=`
:::

## More Help

For other questions, please refer to the [FAQ](/en/video-parser/faq) page.

## Related Pages

- [Video Parser API Reference](/en/video-parser/api) — endpoints, parameters, response fields and rate limits
- [FAQ](/en/video-parser/faq) — troubleshooting playback and parsing failures
- [CDN Domain List](/en/video-parser/cdn) — domains to add to your VRChat map whitelist
