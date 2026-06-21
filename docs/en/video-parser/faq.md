---
outline: deep
---

# FAQ

This document lists frequently asked questions about using the api.Kipfel.link video parsing service.

## Supported Content

::: info Supported Platforms
- **Video platforms**: Douyin, Bilibili, YouTube, Twitter(X), Instagram, Kuaishou, AcFun
- **Live support**: Bilibili Live, Douyin Live, Kuaishou Live (supports automatic short link detection)
- **Music platforms**: NetEase Cloud Music, Kugou Music, Migu Music, YouTube Music
- **Parsing types**: Single video, collection (Bilibili multi-part/YouTube playlist), single music, music playlist
:::

## Live Parsing Notes

::: tip Live Parsing Features
- **Multi-platform coverage**: Supports Bilibili, Douyin, Kuaishou three major live platforms.
- **Short link compatible**: Supports short links shared from mobile (like `b23.tv`, `v.douyin.com`), the system will automatically perform redirect and parse.
- **Auto-detection**: No need to select type, just paste the live room link (remove captions! Remove captions! Remove captions! Important three times!), the system will automatically switch to live parsing engine.
:::

::: warning Note
Live links usually have stronger time sensitivity and anti-hotlinking restrictions, it's recommended to use quickly after parsing.
:::

## Basic Questions

::: details Why can web pages play normally but VRChat can't?
VRChat's built-in player/some players have incomplete support for 302 redirects or long URLs. First open and parse the copied URL in your browser to let it redirect to the final address (usually becomes a direct link), then copy that redirected URL to VRChat to play.
:::

::: details Why can't some rooms play videos?
After VRChat's update on 2024.12.11, all worlds are forced to configure their own [domain whitelist](https://docs.vrchat.com/docs/whitelists). Its purpose is to restrict that in public rooms, only resource links in the world author's configured whitelist can be accessed. Private rooms are not restricted.
:::

::: details Why isn't Douyin parsing properly?
Don't directly paste sharing text with captions, especially with # symbols. It's recommended to remove all text and keep only the link itself before trying again.
:::

::: details How to select the Nth song in a playlist? Why isn't the song I want playing?
Playlists count from 1. Use `&i=1` / `&i=2` to select the Nth song; also supports adding `@1` / `@2` at the end. If it exceeds the range, it will say "Playlist index out of range".
:::

::: details Some videos can be parsed but stutter/load slowly in VRChat?
Could be source site network issues; or the source site restricts domestic/overseas access. Since this site has stopped video traffic proxying, it's recommended to use an appropriate network environment to access the source resources directly.
:::

::: details I'm a public world author, I want to add support for this parser?
Please check the [CDN List](/en/video-parser/cdn) page to get the complete list of domains that need to be added to the whitelist. Send an email to the author at [admin@kipfel.link](mailto:admin@kipfel.link?subject=Domain whitelist request&body=Hello, I'm the author of [world name], I need to add support for this parser site, here's my world invite link:), and attach your world link information for collaboration, it will be added to the collaboration worlds.

::: warning Note
VRChat worlds limit URLlist to maximum 100 entries, please add selectively.
:::
:::

::: details Special statement about this site?
This site is not produced by the Kipfel community, it's only made by an individual author who likes Kipfel. This site is completely free. If someone guides you to use it through payment, please report it to me. Hope everyone can help promote it so more people can use it. Thank you meow!
:::

## Common Error Codes

| HTTP Status Code | Business Code | Description |
| --- | --- | --- |
| `403` | No fixed business code | Links from unsupported platforms are rejected for redirection |
| `405` | `METHOD_NOT_ALLOWED` | Missing `url` parameter key |
| `418` | `IM_A_TEAPOT` | `url` parameter is an empty string |
| `422` | `INVALID_URL` | Failed to extract a valid URL from input |
| `422` | `MISSING_PARAMETER` | Missing required parameters |
| `422` | `UNSUPPORTED_PLATFORM` | Current platform or link type is not supported |
| `451` | `CONTENT_RESTRICTED` | Not supported due to copyright or compliance reasons |
| `500` | `PARSE_ERROR` | General parsing failure |
| `500` | `COLLECTION_PARSE_ERROR` | Collection parsing failed |
| `500` | `PLAYLIST_ERROR` | Failed to get playlist details |
| `503` | `NO_NODES_AVAILABLE` | No parsing nodes available currently |
| `504` | `PARSE_ERROR` | Upstream parsing node timed out or refused connection |
| `429` | `API_LIMIT_EXCEEDED` | API requests are too frequent |

## Contact

::: info Contact Us
- **Cooperation and questions**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **Operations / Errors and unavailable issues**: 海落QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)
- **VRChat group**: [https://vrc.group/KOOYL.8164](https://vrc.group/KOOYL.8164)
:::
