---
outline: deep
---

# FAQ

This document lists frequently asked questions about using the api.Kipfel.link video parsing service.

## Supported Content

::: info Supported Platforms
- **Video Platforms**: Douyin, Bilibili, YouTube, Twitter(X), Instagram, Kuaishou
- **Danmaku Support**: Douyin, Bilibili
- **Live Stream Support**: Bilibili Live, Douyin Live, Kuaishou Live (supports automatic short link recognition)
- **Music Platforms**: NetEase Cloud Music, Kugou Music, Migu Music, YouTube Music
:::

## Live Stream Parsing Description

::: tip Live Stream Parsing Features
- **Multi-platform Coverage**: Supports Bilibili, Douyin, and Kuaishou, three major live streaming platforms.
- **Short Link Compatibility**: Supports short links shared from mobile phones (e.g., `b23.tv`, `v.douyin.com`), and the system will automatically redirect and parse.
- **Automatic Recognition**: No need to select a type, just paste the live stream room address (remove the copy! remove the copy! remove the copy! Important things said three times!), and the system will automatically switch to the live stream parsing engine.
:::

::: warning Note
- **Live Stream Parsing**: Live stream links usually have strong timeliness and anti-leeching restrictions. It is recommended to use them as soon as possible after parsing.
- **Danmaku Parsing**: Danmaku can currently only be played in cafes, and cannot be used in other maps.
:::

## Basic Questions

::: details Why can the web page play normally, but VRChat cannot?
VRChat built-in players/some players have incomplete support for 302 redirects or long links. First, open the link you copied in a browser to parse it once, let it redirect to the final address (usually it will become a "direct link"), and then copy the redirected link to VRChat to play.
:::

::: details Why can't some rooms play?
After the official VRChat update on 2024.12.11, the official mandated that all maps must be equipped with their own [domain whitelist](https://docs.vrczh.org/creators.vrchat.com/worlds/udon/video-players/www-whitelist). Its function is to restrict that in public rooms, only resource links in the whitelist of this map configured by the author can be accessed, while private rooms are not restricted.
:::

::: details Why can't Douyin be parsed normally?
Do not directly paste shared content with copy, especially with the # symbol. It is recommended to delete all text and only keep the link body before retrying.
:::

::: details How to select the Nth song in a playlist? Why isn't the song I want playing?
Playlists are counted from 1. Use `&i=1` / `&i=2` to select the Nth song; adding `@1` / `@2` at the end is also supported. If it is out of range, it will prompt "Playlist sequence number out of range".
:::

::: details Some videos can be parsed, but they are stuck/load slowly in VRChat?
It may be due to network fluctuations of the source site; or the source site may restrict domestic/overseas access. Since this site has stopped video traffic relay services, it is recommended to use an appropriate network environment to directly access source site resources.
:::

::: details I am the author of a public map? I want to add support for this parsing site?
Please refer to the [CDN List](/en/video-parser/cdn) page for the complete list of domains that need to be added to the whitelist. Send an [email](mailto:admin@kipfel.link?subject=Domain Parsing List Application&body=Hello, I am xxx, the author of xxx map. I need to add parsing support for this site. This is the invitation link to my map:) to the author, and include information about you and your map link to cooperate and be included in the cooperation world.
::: warning Note
VRChat map URL lists have a maximum of 100 entries. Please add them as needed.
:::
:::

::: details Special statement about this website?
This website was not created by the Kipfel community, but by an individual author who loves Kipfel. This site is completely free. If anyone guides you to use it for a fee, please give me feedback or report it. I hope everyone can help promote it so that more people can use it. Thank you meow!
:::

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
