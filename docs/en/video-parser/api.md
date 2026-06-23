---
outline: deep
---

# API Documentation

This document describes the HTTP APIs provided by `api.kipfel.link`.

- Base paths: `/v1`, `/v2`
- Request method: `GET` unless specified otherwise
- Response format:
  - Parsing interfaces return `302` redirect to the actual media URL by default
  - Return JSON when `json=1`, `json=true` is provided or `Accept: application/json` header is used
- Content type:
  - JSON interfaces: `application/json`
  - Image proxy: Pass through the original image type
  - Background image: Returns `302` to static resource URL

It is recommended to use JSON mode when integrating on the server side for more stable error handling and results.

## Basic Information

### Base URL

```text
Main: https://api.kipfel.link/
V1 only: https://api.kipfel.vrchat.org.cn/
```

### Domain Description

| Domain | Description |
| --- | --- |
| `https://api.kipfel.link/` | Main site, supports `v1` and other public interfaces |
| `https://api.kipfel.vrchat.org.cn/` | Only supports `v1` API, no `v2` or additional interfaces |

### Common Request Headers

```http
Accept: application/json
```

### Common Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Required for most parsing interfaces | Original URL to parse, supports mixed sharing text, server automatically extracts the real URL |
| `json` | string | No | Force return JSON instead of 302 redirect when `1` or `true` is provided |
| `real_ip` | string | No | Client real public IP for more accurate regional node selection |
| `type` | string | No | Specify parsing type, common values: `video`, `music`, `live`, `playlist`, `collection` |
| `i` | number | No | Index for music playlist or multi-resource scenarios, starting from 1 is safer |

### Response Convention

#### 1. Success with JSON mode

```json
{
  "success": true,
  "url": "https://cdn.example.com/media.mp4"
}
```

#### 2. Success with default mode

Server returns:

```http
302 Found
Location: https://cdn.example.com/media.mp4
```

#### 3. Error

```json
{
  "error": true,
  "status": 422,
  "code": "INVALID_URL",
  "message": "The provided parameters do not contain a valid URL"
}
```

## Security &amp; Limits

### Rate Limiting

| Scope | Limit |
| --- | --- |
| Whole site | Max 150 requests per 15 minutes per IP |
| `/v1`, `/v2` APIs | Max 50 requests per minute per IP |

Typically returns `429 Too Many Requests` when limit is triggered.

### IP Ban Mechanism

IPs that play illegal content will be banned. If your IP is banned or you have questions, please contact:
- **Admin**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **Operations**: 海落QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)

### 302 Redirect Restrictions

Removed 302 redirect for non-video platforms and non-whitelist addresses, only links from supported video platforms will be parsed and redirected.

### Copyright &amp; Compliance Restrictions

The following sources are directly blocked and return `451`:

- Tencent Video
- iQIYI
- Youku
- Mango TV
- Bilibili Bangumi
- Xigua Video
- Sohu Video

### Supported Platforms

| Platform | Type | Description |
| --- | --- | --- |
| Bilibili | `video` / `live` | Supports regular videos, live streams, short links and some direct links |
| Douyin | `video` / `live` | Supports short link expansion |
| Kuaishou | `video` / `live` | Supports videos and live streams |
| AcFun | `video` | Supports video parsing |
| NetEase Cloud Music | `music` / `playlist` | Supports singles and playlist details |
| Kugou Music | `music` | Supports audio parsing |
| Migu Music | `music` | Supports audio parsing |
| YouTube | `video` / `music` | Supports YouTube and YouTube Music |
| X / Twitter | `video` | Supports public video links |
| Instagram | `video` | Supports public video links |

## V1 Parsing Interfaces

### `GET /v1/vrc`

Main video parsing interface. For short videos, regular videos and some live stream links.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Video or live stream share link |
| `json` | string | No | Return JSON when `1` or `true` |
| `type` | string | No | Manually specify parsing type, auto-detection by default, fallback to `video` |
| `real_ip` | string | No | Client real public IP |

#### Request Example

```bash
curl "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1xx411c7mD&json=1"
```

#### Success Response

```json
{
  "success": true,
  "url": "https://cdn.example.com/video.mp4"
}
```

#### Notes

- Auto-expands short links like `b23.tv`, `v.douyin.com`, `youtu.be`
- Auto-detects live stream links and switches to live parsing logic
- Directly returns the original link if the target is already a supported platform media direct link

### `GET /v1/music`

Main music parsing interface. For singles and tracks from some playlists.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Music link |
| `i` | number | No | Playlist track index |
| `json` | string | No | Return JSON when `1` or `true` |
| `type` | string | No | Auto-detection by default, fallback to `music` |
| `real_ip` | string | No | Client real public IP |

#### Request Example

```bash
curl "https://api.kipfel.link/v1/music?url=https%3A%2F%2Fmusic.163.com%2Fsong%3Fid%3D19013859097&json=1"
```

#### Success Response

```json
{
  "success": true,
  "url": "https://cdn.example.com/audio.mp3"
}
```

#### Notes

- Auto-compatible with NetEase Cloud `song`, `playlist` link formats
- Falls back to single parsing logic when playlist parsing fails
- Prioritizes parsing the track at the specified index when `i` is provided

### `GET /v1/kfc`

Backup video parsing interface. Does not depend on WebRTC geolocation logic, suitable as a compatibility fallback entry.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target link |
| `json` | string | No | Return JSON when `1` or `true` |
| `type` | string | No | Can manually specify type |
| `i` | number | No | Specific resource index |
| `real_ip` | string | No | Client real public IP |

#### Response Notes

- Returns playlist details JSON instead of direct link redirect when `type=playlist`
- Otherwise generally consistent with `/v1/vrc`

### `GET /v1/musickfc`

Backup music parsing interface, behavior similar to `/v1/music`.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Music link |
| `i` | number | No | Track index |
| `json` | string | No | Return JSON when `1` or `true` |
| `type` | string | No | Auto-detection by default, fallback to `music` |
| `real_ip` | string | No | Client real public IP |

### `GET /v1/collection`

Parses video collections and returns list of child items.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Collection page link |
| `format` | string | No | Returns JavaScript array text when `js`, otherwise returns JSON |
| `real_ip` | string | No | Client real public IP |

#### JSON Response Example

```json
{
  "title": "Collection title",
  "items": [
    {
      "title": "Episode 1",
      "url": "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fexample.com%2Fitem-1"
    }
  ]
}
```

#### JavaScript Response Example

```javascript
[
  {
    title: "Episode 1",
    url: "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fexample.com%2Fitem-1"
  }
]
```

#### Notes

- Currently only supports platform collections identifiable as `video` type
- The returned `items[].url` are already converted to our `/v1/vrc` callable addresses

### `GET /v1/playlist-detail`

Get NetEase Cloud playlist details.

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | NetEase Cloud playlist link |
| `real_ip` | string | No | Client real public IP |

#### Response Notes

This interface directly passes through the playlist details from the parsing node. Common structure resembles:

```json
{
  "title": "Playlist title",
  "tracks": [
    {
      "index": 1,
      "title": "Song name",
      "artist": "Artist",
      "url": "https://cdn.example.com/audio.mp3"
    }
  ]
}
```

#### Limitations

- Only supports NetEase Cloud playlists
- Returns `422` for non-NetEase Cloud links

## V2 Auxiliary Interfaces

Note: The following `v2` interfaces can only be accessed via `https://api.kipfel.link/`, not supported by `https://api.kipfel.vrchat.org.cn/`.

### `GET /v2/background/:type/:timestamp?`

Random background image redirect interface.

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | Yes | `mobile` for portrait, others handled as landscape |
| `timestamp` | string | No | Can be used for frontend force refresh, not used in business logic |

#### Response Notes

- Returns `302` on success, redirects to `/assets/background/...` or `/assets/pin/...`
- Returns `404` when no available image is found

## Common Error Codes

| HTTP Status | Business Code | Description |
| --- | --- | --- |
| `403` | No fixed code | Unsupported platform links rejected for redirection |
| `405` | `METHOD_NOT_ALLOWED` | Missing `url` parameter key |
| `418` | `IM_A_TEAPOT` | `url` parameter is empty string |
| `422` | `INVALID_URL` | Failed to extract valid URL from input |
| `422` | `MISSING_PARAMETER` | Missing required parameter |
| `422` | `UNSUPPORTED_PLATFORM` | Current platform or link type not supported |
| `451` | `CONTENT_RESTRICTED` | Not supported for copyright or compliance reasons |
| `500` | `PARSE_ERROR` | Generic parsing failure |
| `500` | `COLLECTION_PARSE_ERROR` | Collection parsing failed |
| `500` | `PLAYLIST_ERROR` | Failed to get playlist details |
| `503` | `NO_NODES_AVAILABLE` | No parsing nodes available |
| `504` | `PARSE_ERROR` | Upstream parsing node timeout or connection refused |
| `429` | `API_LIMIT_EXCEEDED` | Too many API requests |
