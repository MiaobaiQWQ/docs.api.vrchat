---
outline: deep
description: "VRChat video parsing FAQ: supported platforms, live streams, playback failures, Douyin links, playlist tracks, map whitelists and error codes."
---

# FAQ

This page answers the most frequently asked questions about the api.kipfel.link video parsing service. Every question is its own section heading, and the first sentence of each section is the direct answer.

## Supported Platforms and Content

### Which platforms does the VRChat video parser support?

The current Go workspace has native parsers for six video platforms: Douyin, Bilibili, Twitter(X), Instagram, Kuaishou and AcFun. Music parsers cover NetEase, Kugou, QQ Music, Kuwo and Qishui.

::: info Supported Platforms
- **Video Platforms**: Douyin, Bilibili, Twitter(X), Instagram, Kuaishou, AcFun
- **Danmaku Support**: Douyin, Bilibili
- **Live Stream Support**: Bilibili Live, Douyin Live, Kuaishou Live (supports automatic short link recognition)
- **Music Platforms**: NetEase Cloud Music, Kugou Music, QQ Music, Kuwo Music, Qishui Music
:::

::: warning Note
YouTube, YouTube Music and Migu are retired / not implemented in the current workspace. The list above describes native parsers; separately deployed nodes depend on their actual configuration.
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

Fetch `/v4/playlist?url={NetEase playlist link}` and use the selected song's `tracks[].url`. For world playback, load `/p?world={world ID}&u={playlist ID}`, then use `/s/{i}?world={world ID}` with the returned `songs[].i`. The old `i` / `index` / `@N` selection methods are not connected; list positions are not record IDs.

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
| `405` | `METHOD_NOT_ALLOWED` | Missing url parameter |
| `418` | `IM_A_TEAPOT` | Empty url |
| `422` | `INVALID_URL / UNSUPPORTED_PLATFORM` | Invalid URL / unsupported platform |
| `451` | `CONTENT_RESTRICTED` | Restricted content |
| `400 / 403` | `PARSE_ERROR` | Playback / non-Unity JSON parsing failure; rule blocks use 403 |
| `400` | `INVALID_WORLD / INVALID_POOL` | Invalid world or pool parameter |
| `400` | `INVALID_INPUT / INVALID_LIST_SCOPE` | Missing list source or invalid scope |
| `400` | `UNSUPPORTED_PLAYLIST` | Unsupported platform for lists |
| `404` | `WORLD_OR_SLOT_NOT_FOUND` | World or record not found |
| `403` | `WORLD_DISABLED` | World disabled |
| `409` | `SLOT_POOL_FULL` | Pool full and remaining records protected |
| `502` | `SLOT_MEDIA_ERROR` | Record media URL parsing failed |

::: tip Checking JSON
v1 JSON parsing failures usually return HTTP 200 with `code: -1`. The Unity branch of v3 / v4 may return `success: true` with empty arrays on parsing failure. Parameter validation still returns HTTP errors. See the [API reference](/en/video-parser/api) for the exact structures.
:::

## Contact Information

::: info Contact Us
- **Cooperation and Problem Contact**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **Operations Staff / Error and Unusable Contact**: Hailuo QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)
- **VRChat Group**: [https://vrc.group/KOOYL.8164](https://vrc.group/KOOYL.8164)
:::

## Related Pages

- [Video Parser API Reference](/en/video-parser/api) — endpoints, request parameters and response fields
- [Usage Guide](/en/video-parser/guide) — how to call each endpoint and the supported link formats
- [CDN Domain List](/en/video-parser/cdn) — the complete domain list for your map whitelist
