---
outline: deep
---

# VRC Video Parsing API Call and Restriction Documentation

## Project Overview

VRC Video Parsing is a multi-source video/audio parsing proxy gateway designed for VRChat players, providing free and fast video and audio parsing services.

## Basic Information

### Interface Address

```text
Main Site: https://api.kipfel.link/
```

#### v1 and v3 interfaces only

```text
https://api.kipfel.vrchat.org.cn/
```

### v1 Core Parsing Interface

#### Video Parsing

**Interface**: `/v1/vrc?url={video link}`
**Parameters**:
- `url` (required): Video link

**Response**:
- **Success**: 302 redirect to direct link address
- **Failure**: Returns JSON formatted error message

**JSON Version**: `/v1/vrc-json` - always returns JSON

**JSON Response Format**:

**Success Response**:
```json
{
  "success": true,
  "url": "https://example.com/parsed-video-url.mp4"
}
```

Field description:
- `success` (boolean): Whether the request was successful
- `url` (string): Direct link address after parsing

**Failure Response**:
```json
{
  "error": true,
  "status": 400,
  "code": "PARSE_ERROR",
  "message": "Parsing failed, please check if the link is correct"
}
```

Field description:
- `error` (boolean): Whether an error occurred
- `status` (number): HTTP status code
- `code` (string): Error code
- `message` (string): Error message

---

#### Alternative Video Parsing Interface

**Interface**: `/v1/kfc?url={video link}`
**Parameters**: Same as `/v1/vrc`

**Response**: Same as `/v1/vrc`

**JSON Version**: `/v1/kfc-json` - response format is the same as `/v1/vrc-json`

---

#### Music Parsing

**Interface**: `/v1/music?url={music link}&i={index}`
**Parameters**:
- `url` (required): Music link or playlist link
- `i` (optional): Playlist index (starts from 1)

**Response**:
- **Success**: 302 redirect to direct link address
- **Failure**: Returns JSON formatted error message

**JSON Version**: `/v1/music-json`

**JSON Response Format**: Same as `/v1/vrc-json`

---

#### Alternative Music Parsing Interface

**Interface**: `/v1/musickfc?url={music link}&i={index}`
**Parameters**: Same as `/v1/music`

**Response**: Same as `/v1/music`

**JSON Version**: `/v1/musickfc-json` - response format is the same as `/v1/music-json`

---

### v3 Advanced Interface

### User-Agent Requirements

::: warning Note
- You need to send two user agents, one containing `Unity xxxxxxxx` and one not containing `Unity xxxx`.
- You need to send a user agent containing `Unity xxxxxxxx` to get danmaku/lyrics.
- You need to send a user agent not containing `Unity xxxxxxxx` to get direct video links/direct song links.
:::

### Recommendations

::: tip Tip
- It is recommended that you use different user agents for each map to prevent being blocked and to verify the source of the request.
- For example, if I am a map author, I recommend naming it `Unity xiaokong` or following the specification that the name must start with `Unity ` otherwise danmaku/lyrics will not be returned. The other can be named freely.
:::

#### Danmaku Interface

**Interface**: `/v3/vrc-danmaku?url={video link}`
**Parameters**:
- `url` (required): Video link
- `limit` (optional): Danmaku quantity limit, default 10000

**Response**:

**Unity Player (User-Agent contains Unity):**

```json
{
  "success": true,
  "data": {
    "platform": "bilibili",
    "comments": [
      {
        "time": 10.5,
        "text": "Danmaku content",
        "user": "Username",
        "color": "FFFFFF"
      }
    ]
  }
}
```

Field description:
- `success` (boolean): Whether the request was successful
- `data.platform` (string): Platform identifier
- `data.comments` (array): Danmaku list
  - `comments[].time` (number): Danmaku timestamp (seconds)
  - `comments[].text` (string): Danmaku content
  - `comments[].user` (string): User identifier
  - `comments[].color` (string): Danmaku color (hexadecimal)

**Non-Unity Player:**
- **Success**: 302 redirect to direct link address
- **Failure**: Returns JSON formatted error message

---

#### Lyrics Interface

**Interface**: `/v3/vrc-lyric?url={music link}`
**Parameters**:
- `url` (required): Music link

**Response**:

**Unity Player (User-Agent contains Unity):**

```json
{
  "success": true,
  "data": {
    "platform": "netease",
    "lyrics": [
      {
        "time": 0.0,
        "text": "Lyric content"
      }
    ],
    "tlyrics": [
      {
        "time": 0.0,
        "text": "Translated lyric content"
      }
    ]
  }
}
```

Field description:
- `success` (boolean): Whether the request was successful
- `data.platform` (string): Platform identifier
- `data.lyrics` (array): Original lyric list
  - `lyrics[].time` (number): Lyric timestamp (seconds)
  - `lyrics[].text` (string): Lyric content
- `data.tlyrics` (array): Translated lyric list
  - `tlyrics[].time` (number): Lyric timestamp (seconds)
  - `tlyrics[].text` (string): Translated lyric content

**Non-Unity Player:**
- **Success**: 302 redirect to direct link address
- **Failure**: Returns JSON formatted error message

---

## General Response Format

### Error Response Format

The error response format for all interfaces is unified as follows:

```json
{
  "error": true,
  "status": 400,
  "code": "ERROR_CODE",
  "message": "Error description message"
}
```

Common error codes:
- `METHOD_NOT_ALLOWED` (405): Missing required url request parameters
- `IM_A_TEAPOT` (418): url parameter is empty
- `INVALID_URL` (422): The provided parameters do not contain a valid URL link
- `FORBIDDEN_URL` (403): This link contains an unsafe target address and has been blocked by the system
- `CONTENT_RESTRICTED` (451): Due to copyright or compliance reasons, parsing of this content is temporarily not supported
- `PARSE_ERROR` (500): Parsing failed
- `NO_NODES_AVAILABLE` (503): No parsing nodes are currently available

---

## Access Frequency Restrictions

### cloudflare and aliyun esa restriction frequency

| Restriction Type | Window Size | Restriction Count | Ban Time |
|-----------------|-------------|-------------------|----------|
| All interfaces    | 10 seconds  | 20 times          | 15 seconds |

#### Nginx Restriction

| Restriction Type | Window Size | Restriction Count | Ban Time |
|-----------------|-------------|-------------------|----------|
| Some interfaces   | 10 seconds  | 20 times          | 15 seconds |

### Rate Limit (Underlying)

| Restriction Type | Window Size | Restriction Count |
|-----------------|-------------|-------------------|
| All v1 and v3 interfaces | 1 minute | 50 times |

**Response when exceeding limit**:
```json
{
  "error": "API rate limit exceeded",
  "message": "Parsing frequency is too high, please slow down a bit",
  "code": "API_LIMIT_EXCEEDED"
}
```

### 404 Ban

| Restriction Type | Window Size | Restriction Count | Ban Time |
|-----------------|-------------|-------------------|----------|
| All interfaces    | 1 minute    | 3 times           | 5 minutes |

::: warning Note
- Normal access will not trigger a 404 error, unless you are trying to crack my website's API.
- The ban time will increase with the number of occurrences, up to a maximum of 24 hours.
:::

---

## Restricted Content

Content from the following platforms is currently not supported for parsing:

- 腾讯视频 (Tencent Video)
- 爱奇艺 (iQiyi)
- 优酷 (Youku)
- 芒果TV (Mango TV)
- 哔哩哔哩番剧 (Bilibili Anime)
- 西瓜视频 (Xigua Video)
- 搜狐视频 (Sohu Video)

---
