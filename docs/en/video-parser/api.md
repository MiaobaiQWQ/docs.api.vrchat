---
outline: deep
description: "VRChat video parsing API reference: v1 video and music parsing with JSON variants, v3 danmaku and lyrics with Bilibili AI subtitles and cover images, error codes."
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

The v3 interface targets players that need richer content such as danmaku and lyrics: alongside direct links it returns structured JSON data.

#### User-Agent Requirements

::: warning Note
- You need to send two user agents, one containing `Unity xxxxxxxx` and one not containing `Unity xxxx`.
- You need to send a user agent containing `Unity xxxxxxxx` to get danmaku/lyrics.
- You need to send a user agent not containing `Unity xxxxxxxx` to get direct video links/direct song links.
:::

#### Recommendations

::: tip Tip
- It is recommended that you use different user agents for each map to prevent being blocked and to verify the source of the request.
- For example, if I am a map author, I recommend naming it `Unity xiaokong` or following the specification that the name must start with `Unity ` otherwise danmaku/lyrics will not be returned. The other can be named freely.
:::

#### Danmaku Interface

**Interface**: `/v3/vrc-danmaku?url={video link}`  
**Parameters**:
- `url` (required): Video link
- `limit` (optional): Danmaku quantity limit, default 10000; **it only limits danmaku and does not affect subtitles**
- `start_time` (optional): Start time (seconds); only content after this point is returned. Combine it with `duration` to form a time window
- `duration` (optional): Length of the time window (seconds); must be sent together with `start_time`
- `ai_subtitle` (optional): Whether to return Bilibili subtitles (AI subtitles + CC subtitles uploaded by the uploader). `1` / `true` / `yes` / `on` turns it on, `0` / `false` / `no` / `off` turns it off; when omitted the server default applies (currently on by default)
- `lang` (optional): Subtitle language filter, comma separated (e.g. `ai-zh,zh-CN,ja`); `*` or an empty value returns every available language. It can also be written as `subtitle_lang`

::: tip Subtitles (Bilibili)
- Subtitles only apply to **Bilibili**; other platforms ignore `ai_subtitle` / `lang` automatically
- AI subtitles (`ai-zh`, `ai-ja`, …) and CC subtitles uploaded by the uploader (`zh`, `zh-CN`, `zh-Hans`, …) are returned together, and the `l` of each entry tells them apart
- Language codes are case-insensitive and support primary-language prefix matching (passing `zh` also matches `zh-CN`)
- The subtitle text requires a logged-in Bilibili cookie configured on the server; when it is missing, `subtitles` is an empty array, which **does not affect danmaku**
- If you only need one language, filter it on the server with `lang=` instead of fetching everything and filtering yourself — it saves bandwidth
- The `start_time` + `duration` time window applies to danmaku and subtitles separately
:::

**Response**:

**Unity Player (User-Agent contains Unity), Bilibili as an example:**

```json
{
  "success": true,
  "platform": "哔哩哔哩",
  "video_id": "BV1aAhm6vEA6",
  "title": "Video title",
  "has_more": false,
  "danmaku": [
    {
      "t": 0.5,
      "c": "Danmaku content",
      "ty": 1,
      "co": 16777215,
      "fs": 25
    }
  ],
  "subtitles": [
    {
      "t": 0.04,
      "to": 1.72,
      "c": "Subtitle text",
      "l": "ai-zh"
    },
    {
      "t": 0.04,
      "to": 1.72,
      "c": "subtitle",
      "l": "ai-ja"
    }
  ],
  "subtitle_langs": ["ai-zh", "ai-ja"]
}
```

Field description:
- `success` (boolean): Whether the request was successful (it stays `true` even when subtitles cannot be fetched, `subtitles` is simply an empty array)
- `platform` (string): Chinese platform name, such as `哔哩哔哩`
- `video_id` (string): Video ID; the BV number for Bilibili
- `title` (string): Video title
- `has_more` (boolean): Whether more content follows when slicing with `start_time` + `duration`
- `danmaku` (array): Danmaku list
  - `danmaku[].t` (number): Danmaku timestamp (seconds)
  - `danmaku[].c` (string): Danmaku content
  - `danmaku[].ty` (number): Danmaku type (`1` scrolling, `4` bottom, `5` top, etc.)
  - `danmaku[].co` (number): Danmaku color, decimal RGB (`16777215` = white)
  - `danmaku[].fs` (number): Font size
- `subtitles` (array): Subtitles as a **flat array** — all languages mixed together with no nested dictionary; `[]` when there are none
  - `subtitles[].t` (number): Subtitle start time (seconds)
  - `subtitles[].to` (number): Subtitle end time (seconds)
  - `subtitles[].c` (string): Subtitle text (line breaks and leading/trailing whitespace already stripped)
  - `subtitles[].l` (string): Language code (such as `ai-zh`, `zh-CN`, `ja`)
- `subtitle_langs` (array, optional): The language codes **actually returned** this time, matching the values that appear in `subtitles[].l`; the field is not returned when there are no subtitles
- `subtitle_locked` (boolean, optional): `true` means the video really does have a subtitle track, but the server has no logged-in cookie configured so the text cannot be fetched; it only appears when "subtitles were attempted but not obtained" (explicitly disabling with `ai_subtitle=0` does not produce it)
- `subtitle_locked_langs` (array, optional): The language codes blocked by the login requirement; it appears together with `subtitle_locked`

::: tip Call examples

```bash
# Default: danmaku + subtitles in every available language
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6"

# Chinese AI subtitles only
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=ai-zh"

# Only the Chinese/English subtitles uploaded by the uploader (excludes AI subtitles starting with ai-)
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=zh-CN,zh-Hans,en-US"

# No subtitles
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&ai_subtitle=0"
```

:::

::: warning Field order
Small fields such as `title` **always come before the two large arrays `danmaku` / `subtitles`**.
Some JSON parsers on the Udon side only look for keys within the first few characters of the response, so once the arrays push those fields to the back they can no longer be read; clients must not rely on those fields appearing at the end.
:::

**Other platforms (Douyin, Kuaishou, etc.)** return the same `danmaku` array, but without subtitle fields such as `subtitles` / `subtitle_langs`.

**Non-Unity Player:**
- **Success**: 302 redirect to direct link address
- **Failure**: Returns JSON formatted error message

---

#### Lyrics Interface

**Interface**: `/v3/vrc-lyric?url={music link}`  
**Parameters**:
- `url` (required): Music link
- `size` / `cover_size` (optional): Resolution of the returned cover image; only `64` or `128` are supported, defaulting to `128`. The two parameter names are equivalent (`size` wins), and any other **numeric** value is treated as `128`

::: tip Cover image
- The cover is returned **embedded as base64** inside the lyrics JSON — no separate image URL is provided, so the Udon side can decode it into a texture directly
- `size` / `cover_size` are parameters of this endpoint itself and are not treated as part of the music link (a same-named parameter inside `url` does not affect the parsing result either)
- When the server cannot get a cover (the platform has none, the image download fails, etc.) both fields are empty strings and no error is raised
:::

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
    ],
    "song_name": "와",
    "singer": "李贞贤",
    "audio_id": "25645594",
    "album_id": "2264131",
    "duration": 212,
    "singer_id": "125616",
    "cover_base64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQ...",
    "cover_size": "128x128"
  }
}
```

Field description:
- `success` (boolean): Whether the request was successful (it stays `true` even when lyrics cannot be fetched, `lyrics` is simply empty)
- `data.platform` (string): Platform identifier
- `data.lyrics` (array): Original lyric list
  - `lyrics[].time` (number): Lyric timestamp (seconds)
  - `lyrics[].text` (string): Lyric content
- `data.tlyrics` (array): Translated lyric list
  - `tlyrics[].time` (number): Lyric timestamp (seconds)
  - `tlyrics[].text` (string): Translated lyric content
- `data.song_name` (string, optional): Song name; the field is not returned when the platform does not provide it
- `data.singer` (string, optional): Singer name
- `data.audio_id` (string, optional): The platform's internal audio ID
- `data.album_id` (string, optional): Album ID
- `data.duration` (number, optional): Total song duration, in seconds
- `data.singer_id` (string, optional): Singer ID
- `data.cover_base64` (string): Album cover image, compressed into a square and then base64-encoded (**the original image URL is not returned**); an empty string `""` when there is no cover
- `data.cover_size` (string): The cover's actual size, either `"64x64"` or `"128x128"`; an empty string `""` when there is no cover

::: tip Call examples
```bash
# Default 128×128 cover
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230"

# 64×64 cover (the two parameter names are equivalent)
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&size=64"
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&cover_size=64"
```

:::

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

### Nginx Restriction

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

## Related Pages

- [Usage Guide](/en/video-parser/guide) — how to call each endpoint and the supported link formats
- [FAQ](/en/video-parser/faq) — troubleshooting playback and parsing failures, plus error codes
- [CDN Domain List](/en/video-parser/cdn) — domains to add to your VRChat map whitelist
- [Busuanzi API Reference](/en/busuanzi/api) — the website analytics API from the same project
