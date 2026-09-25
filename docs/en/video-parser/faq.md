---
outline: deep
description: "VRChat video parsing FAQ: supported platforms, live streams, playback failures, Douyin links, playlist tracks, map whitelists and error codes."
---

# FAQ

This page answers the most frequently asked questions about the api.kipfel.link video parsing service. Every question is its own section heading, and the first sentence of each section is the direct answer.

## Supported Platforms and Content

### Which platforms does the VRChat video parser support?

It supports six video platforms: Douyin, Bilibili, YouTube, Twitter(X), Instagram and Kuaishou.

::: info Supported Platforms
- **Video Platforms**: Douyin, Bilibili, YouTube, Twitter(X), Instagram, Kuaishou
- **Danmaku Support**: Douyin, Bilibili
- **Live Stream Support**: Bilibili Live, Douyin Live, Kuaishou Live (supports automatic short link recognition)
- **Music Platforms**: NetEase Cloud Music, Kugou Music, Migu Music, YouTube Music
:::

## Live Stream Parsing

### Can I just paste a live stream link and have it parsed?

Yes, no type selection is needed: paste the live room address and the system automatically switches to the live stream parsing engine. Bilibili, Douyin and Kuaishou are all supported, and short links shared from mobile (such as `b23.tv` and `v.douyin.com`) are redirected and parsed automatically.

::: tip Remove the surrounding text before pasting
When pasting a live room address, remove all surrounding text (remove the copy! remove the copy! important things said three times!) and keep only the link itself.
:::

::: warning Note
- **Live Stream Parsing**: Live stream links usually have strong timeliness and anti-leeching restrictions. It is recommended to use them as soon as possible after parsing.
- **Danmaku Parsing**: Danmaku can currently only be played in cafes, and cannot be used in other maps.
:::

## Playback and Parsing Problems

### Why can the web page play normally, but VRChat cannot?

VRChat built-in players, and some other players, have incomplete support for 302 redirects or long links. First open the link you copied in a browser to parse it once, let it redirect to the final address (usually it becomes a "direct link"), then copy the redirected link into VRChat to play.

### Why can't some rooms play?

After the official VRChat update on 2024.12.11, all maps are required to ship their own [domain whitelist](https://docs.vrczh.org/creators.vrchat.com/worlds/udon/video-players/www-whitelist). In public rooms only resource links that the author has put in that map's whitelist can be accessed, while private rooms are not restricted.

### Why can't Douyin links be parsed?

Because the `#` in a share caption truncates the link in the browser, the server never receives anything after the `#`. Do not paste shared content with its caption; delete all text and keep only the link body, then retry.

### How do I select the Nth song in a playlist, and why is the wrong song playing?

Playlists are counted from 1: use `&i=1` / `&i=2` to select the Nth song, or append `@1` / `@2` to the end of the link. An out-of-range index returns "Playlist sequence number out of range".

### Some videos parse fine but are stuck or slow to load in VRChat.

That is usually network fluctuation on the source site, or the source site restricting domestic/overseas access. This site has stopped relaying video traffic, so it is recommended to use an appropriate network environment to access source resources directly.

## Maps and Whitelists

### I am a public map author and want to add support for this parser. What should I do?

See the [CDN List](/en/video-parser/cdn) page for the complete list of domains that must be added to your whitelist, then send an [email](mailto:admin@kipfel.link?subject=Domain Parsing List Application&body=Hello, I am xxx, the author of xxx map. I need to add parsing support for this site. This is the invitation link to my map:) to the author with information about you and your map link, and we will add it to the partner worlds.

::: warning Note
VRChat map URL lists have a maximum of 100 entries. Please add them as needed.
:::

## About This Site

### Is this site an official project of the Kipfel community?

No. This website was not created by the Kipfel community, but by an individual author who loves Kipfel. This site is completely free. If anyone guides you to use it for a fee, please give me feedback or report it. I hope everyone can help promote it so that more people can use it. Thank you meow!

## Common Error Codes

| HTTP Status Code | Business Code | Description |
| --- | --- | --- |
| `403` | No fixed business code | Unsupported platform link redirect denied |
| `405` | `METHOD_NOT_ALLOWED` | Missing `url` parameter key |
| `418` | `IM_A_TEAPOT` | `url` parameter is an empty string |
| `422` | `INVALID_URL` | Failed to extract a valid URL from the input |
| `422` | `MISSING_PARAMETER` | Missing required parameter |
| `422` | `UNSUPPORTED_PLATFORM` | Current platform or current link type not supported |
| `451` | `CONTENT_RESTRICTED` | Not supported due to copyright or compliance reasons |
| `500` | `PARSE_ERROR` | General parsing failed |
| `500` | `COLLECTION_PARSE_ERROR` | Collection parsing failed |
| `500` | `PLAYLIST_ERROR` | Failed to get playlist details |
| `503` | `NO_NODES_AVAILABLE` | No parsing nodes currently available |
| `504` | `PARSE_ERROR` | Upstream parsing node timed out or refused connection |
| `429` | `API_LIMIT_EXCEEDED` | API request too frequent |

## Contact Information

::: info Contact Us
- **Cooperation and Problem Contact**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **Operations Staff / Error and Unusable Contact**: Hailuo QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)
- **VRChat Group**: [https://vrc.group/KOOYL.8164](https://vrc.group/KOOYL.8164)
:::

## Related Pages

- [Video Parser API Reference](/en/video-parser/api) — endpoints, request parameters, response fields and rate limits
- [Usage Guide](/en/video-parser/guide) — how to call each endpoint and the supported link formats
- [CDN Domain List](/en/video-parser/cdn) — the complete domain list for your map whitelist
