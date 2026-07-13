---
outline: deep
---

# VRC Video Parsing API Call and Restriction Documentation

## Project Overview

VRC Video Parsing is a multi-source video/audio parsing proxy gateway designed for VRChat players, providing free and fast video and audio parsing services.

## Basic Information

### Interface Address

```text
https://api.kipfel.link/
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
  "code": 0,
  "message": "success",
  "log_id": "",
  "data": {
    "video_id": "7636287742653074728",
    "avid": "116855574365910",
    "bvid": "BV17PTt6fEJJ",
    "title": "Video title content",
    "desc": "Detailed description information of the video",
    "duration": 2136,
    "cover": "http://example.com/cover.jpg",
    "create_time": 1783075293,
    "update_time": 0,
    "status": 0,
    "category": "130",
    "category_name": "Music",
    "author": {
      "user_id": "1035330202",
      "nickname": "Author nickname",
      "avatar": "http://example.com/avatar.jpg"
    },
    "stat": {
      "play_count": 36234,
      "like": 2089,
      "comment": 11,
      "share": 32,
      "favorite": 3237
    },
    "content": {
      "play_url": "https://example.com/video_no_watermark.mp4",
      "cover_url": "http://example.com/cover_original.jpg",
      "hashtags": [],
      "mentions": [],
      "music_info": {}
    }
  }
}
```

Field description:
- `code` (Number): Business status code, `0` indicates success.
- `message` (String): Business response message, usually `"success"`.
- `log_id` (String): The platform's log request ID (if any).
- `data.video_id` (String): The unique project ID within the platform (such as Douyin's `aweme_id` / `item_id`, Kuaishou's `photo_id`).
- `data.avid` (String): Unique to Bilibili, AV number ID (may be an empty string for other platforms).
- `data.bvid` (String): Unique to Bilibili, BV number (may be an empty string for other platforms).
- `data.title` (String): The title of the video or audio.
- `data.desc` (String): The description/introduction of the video or audio.
- `data.duration` (Number): Total media duration, unit: seconds.
- `data.cover` (String): Direct link to the default display cover image.
- `data.create_time` (Number): Timestamp when the work was published (in seconds).
- `data.update_time` (Number): Timestamp when the work was updated (in seconds).
- `data.status` (Number): Media status code.
- `data.category` (String): Work category ID.
- `data.category_name` (String): Work category name.
- `data.author.user_id` (String): The creator's unique UID / sec_uid within the platform.
- `data.author.nickname` (String): The creator's nickname.
- `data.author.avatar` (String): URL of the creator's avatar image.
- `data.stat.play_count` (Number): Total plays.
- `data.stat.like` (Number): Total likes.
- `data.stat.comment` (Number): Total comments.
- `data.stat.share` (Number): Total shares/forwards.
- `data.stat.favorite` (Number): Total favorites.
- `data.content.play_url` (String): **Core data**: Direct link to play media without watermark.
- `data.content.cover_url` (String): Direct link to the original quality cover.
- `data.content.hashtags` (Array): Extracted list of hashtag labels.
- `data.content.mentions` (Array): Extracted list of @users.
- `data.content.music_info` (Object): Associated background music information (original soundtrack, etc.).

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

::: warning Note
- The access frequency will be adjusted dynamically and does not represent an absolute rate limit.
:::

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
- I will be watching your requests.
:::

---

## Restricted Content

Content from the following platforms is not supported for parsing:

- 腾讯视频 (Tencent Video)
- 爱奇艺 (iQiyi)
- 优酷 (Youku)
- 芒果TV (Mango TV)
- 哔哩哔哩番剧 (Bilibili Anime)
- 西瓜视频 (Xigua Video)
- 搜狐视频 (Sohu Video)

---
