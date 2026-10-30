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
Append a simple link after `url=`. URL-encode inner links containing `&`, `#` or part parameters so they are not truncated. For scripted calls, use `--data-urlencode`.
:::

### Supported Link Formats

You can use any of the following formats:

::: details 1. Full Link
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6
```
:::

::: details 2. BV Number
```
https://api.kipfel.link/v1/vrc?url=BV1aAhm6vEA6
```
:::

::: details 3. Full Link with Parameters
```
https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1aAhm6vEA6%3Fp%3D2
```
:::

::: details 4. Short Link
```
https://api.kipfel.link/v1/vrc?url=https://b23.tv/xxxx
```
:::

## Music Parsing

Use `/v1/music?url={music link}` for an individual song; success redirects to playable media. Current native parsers cover NetEase, Kugou, QQ Music, Kuwo and Qishui.

::: tip Selecting Playlist Songs
Read each song's `tracks[].url` from `/v4/playlist?url={NetEase playlist link}`, or load it through `/p?world={world ID}&u={playlist ID}` and play `/s/{i}?world={world ID}` using the returned `songs[].i`. `i` / `index` / `@N` selection is not connected.
:::

::: warning Note
YouTube, YouTube Music and Migu native parsers are not connected in the current workspace. Switching to the music interface does not restore them.
:::

## Alternative Interfaces

The alternative addresses below currently use the same handlers as the main interfaces. They preserve existing addresses but do not guarantee independent routes.

::: info Alternative Options
- Video Alternative: `https://api.kipfel.link/v1/kfc?url=`
- Music Alternative: `https://api.kipfel.link/v1/musickfc?url=`
:::

## JSON, Lyrics and Danmaku

Use an ordinary player UA for playable media. Lyrics / danmaku components use a UA containing `Unity`, or `json=1`. These are separate requests, not two UAs in one request.

```bash
curl -G "https://api.kipfel.link/v1/music" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "json=1"
curl -G -A "Unity demo" "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "media=1"
```

v1 JSON uses `code` / `data.content.play_url`. For v3 / v4, read danmaku from `data.comments`, lyrics from `data.lyrics` (timestamps in seconds), and covers according to `cover_mode` / `cover_encoding`. See the [API reference](/en/video-parser/api) for complete fields.

## World Slots and Video Parts

Have an administrator create a world ID first, then bake `/s/{n}?world={world ID}` (music) and `/sell/{n}?world={world ID}` (video) into the world. Read music through `/poll?world=...`, video through `/pocl?world=...`, and load lists through `/p?world=...&u={link}`. Bilibili supports `scope=parts` / `scope=collection`; always use returned `i` values.

## More Help

For other questions, please refer to the [FAQ](/en/video-parser/faq) page.

## Related Pages

- [Video Parser API Reference](/en/video-parser/api) — endpoints, parameters and response fields
- [FAQ](/en/video-parser/faq) — troubleshooting playback and parsing failures
- [CDN Domain List](/en/video-parser/cdn) — domains to add to your VRChat map whitelist
