---
outline: deep
description: "VRChat video API reference: v1 video/music parsing, v3 danmaku, subtitles and lyrics, v4 merged endpoint, playlist parsing and the slot relay."
---

# VRC Video Parsing API Call and Restriction Documentation

## Project Overview

VRC Video Parsing is a multi-source video/audio parsing proxy gateway designed for VRChat players, providing free and fast video and audio parsing services.

## Basic Information

### Interface Address
```text
https://api.kipfel.link/
```

#### Another Domain (different deployment contents)

```text
https://api.kipfel.vrchat.org.cn/
```

The two domains are **not the same deployment**, and the available interfaces differ (measured on 2026-10-09):

| Interface | `api.kipfel.link` | `api.kipfel.vrchat.org.cn` |
|---|---|---|
| `/v1/*` (video / music parsing) | ✅ | ✅ |
| `/v3/*` (danmaku / lyrics) | ✅ | ✅ |
| `/v4/vrc` (merged endpoint) | ✅ | ✅ |
| `/v1/playlist`, `/v4/playlist` (playlist) | ✅ | ❌ (returns the homepage HTML) |
| `/poll`, `/s/<n>`, `/p` (slot relay) | ✅ | ✅ |

### User-Agent Requirements
::: warning Note
- You need to send two UAs, one containing `Unity xxxxxxxx` and one not containing `Unity xxxx`
:::

---

## v1 Core Parsing Interface

### Video Parsing

**Interface**: `/v1/vrc?url={video link}`  
**Parameters**:
- `url` (required): Video link

**Response**:
- **Success**: 302 redirect to the direct link address
- **Failure**: Returns JSON formatted error information

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
    "title": "视频标题内容",
    "desc": "视频的详细描述信息",
    "duration": 2136,
    "cover": "http://example.com/cover.jpg",
    "create_time": 1783075293,
    "update_time": 0,
    "status": 0,
    "category": "130",
    "category_name": "音乐",
    "author": {
      "user_id": "1035330202",
      "nickname": "作者昵称",
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
- `data.video_id` (String): The unique item ID within the platform (such as Douyin's `aweme_id` / `item_id`, Kuaishou's `photo_id`).
- `data.avid` (String): Unique to Bilibili, the AV number ID (may be an empty string for other platforms).
- `data.bvid` (String): Unique to Bilibili, the BV number (may be an empty string for other platforms).
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
- `data.content.play_url` (String): **Core data**: Direct link to the watermark-free media playback.
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
  "message": "解析失败，请检查链接是否正确"
}
```

Field description:
- `error` (boolean): Whether an error occurred
- `status` (number): HTTP status code
- `code` (string): Error code
- `message` (string): Error message

---

### Alternative Video Parsing Interface

**Interface**: `/v1/kfc?url={video link}`  
**Parameters**: Same as `/v1/vrc`

**Response**: Same as `/v1/vrc`

**JSON Version**: `/v1/kfc-json` - response format is the same as `/v1/vrc-json`

---

### Music Parsing

**Interface**: `/v1/music?url={music link}&i={index}`  
**Parameters**:
- `url` (required): Music link or playlist link
- `i` (optional): Playlist index (starts from 1)

**Response**:
- **Success**: 302 redirect to the direct link address
- **Failure**: Returns JSON formatted error information

**JSON Version**: `/v1/music-json`

**JSON Response Format**: Same as `/v1/vrc-json`

---

### Alternative Music Parsing Interface

**Interface**: `/v1/musickfc?url={music link}&i={index}`  
**Parameters**: Same as `/v1/music`

**Response**: Same as `/v1/music`

**JSON Version**: `/v1/musickfc-json` - response format is the same as `/v1/music-json`

---

## v3 Advanced Interface

The v3 interface targets players that need rich content such as danmaku and lyrics: besides direct links it also returns structured JSON data.

### Danmaku Interface

**Interface**: `/v3/vrc-danmaku?url={video link}`  
**Parameters**:
- `url` (required): Video link
- `limit` (optional): Danmaku quantity limit, default 10000; **it only limits danmaku and does not affect subtitles**
- `start_time` (optional): Start time (seconds); only content after this point is returned; combine it with `duration` to form a time window
- `duration` (optional): Length of the time window (seconds); must be sent together with `start_time`
- `ai_subtitle` (optional): Whether to return Bilibili subtitles (AI subtitles + CC subtitles uploaded by the uploader). `1` / `true` / `yes` / `on` turns it on, `0` / `false` / `no` / `off` turns it off; when omitted the server default applies (currently on by default)
- `lang` (optional): Subtitle language filter, comma separated (e.g. `ai-zh,zh-CN,ja`); `*` or an empty value returns every available language. It can also be written as `subtitle_lang`

::: tip Subtitles (Bilibili)
- Subtitles only apply to **Bilibili**; other platforms ignore `ai_subtitle` / `lang` automatically
- AI subtitles (`ai-zh`, `ai-ja`, …) and CC subtitles uploaded by the uploader (`zh`, `zh-CN`, `zh-Hans`, …) are returned together, and the `l` of each entry tells them apart
- Language codes are case-insensitive and support primary-language prefix matching (passing `zh` also matches `zh-CN`)
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
  "title": "视频标题",
  "has_more": false,
  "danmaku": [
    {
      "t": 0.5,
      "c": "弹幕内容",
      "ty": 1,
      "co": 16777215,
      "fs": 25
    }
  ],
  "subtitles": [
    {
      "t": 0.04,
      "to": 1.72,
      "c": "字幕文本",
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
- **Success**: 302 redirect to the direct link address
- **Failure**: Returns JSON formatted error information

---

### Lyrics Interface

**Interface**: `/v3/vrc-lyric?url={music link}`  
**Parameters**:
- `url` (required): Music link
- `size` / `cover_size` (optional): Cover image size, meaning the **upper bound of the longest side**; the aspect ratio is preserved and the original image is never upscaled. The two parameter names are equivalent (`size` wins); the values are `64` / `128` / `256` / `512` / `1024`, and `max` is also accepted (equivalent to the largest step, 1024); any other value is handled as the default step. When omitted: **NetEase Cloud Music defaults to 1024 (the largest image)**, other platforms default to `64`

::: tip Cover image
- The cover is returned **embedded as base64** inside the lyrics JSON — no separate image URL is provided, so the Udon side can decode it into a texture directly
- `size` / `cover_size` are parameters of this endpoint itself and are not treated as part of the music link (a same-named parameter inside `url` does not affect the parsing result either)
- When the server cannot get a cover (the platform has none, the image download fails, etc.) both `cover_base64` / `cover_size` are empty strings and no error is raised
:::

**Response**:

**Unity Player (User-Agent contains Unity):**

```json
{
  "success": true,
  "data": {
    "platform": "网易云音乐",
    "lyrics": [
      {
        "time": 0,
        "text": "作词 : 黄家驹"
      },
      {
        "time": 18466,
        "text": "今天我 寒夜里看雪飘过"
      }
    ],
    "tlyrics": [
      {
        "time": 0,
        "text": "翻译歌词内容"
      }
    ],
    "song_name": "海阔天空",
    "singer": "Beyond",
    "audio_id": "347230",
    "album_id": "2264131",
    "duration": 326,
    "singer_id": "125616",
    "cover_base64": "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0...",
    "cover_size": "1024x1024",
    "cover_w": 1024,
    "cover_h": 1024
  }
}
```

Field description:
- `success` (boolean): Whether the request was successful (it stays `true` even when lyrics cannot be fetched, `lyrics` is simply empty)
- `data.platform` (string): Chinese platform name (such as `网易云音乐`)
- `data.lyrics` (array): Original lyric list
  - `lyrics[].time` (number): Lyric timestamp, **unit: milliseconds (integer)** (NetEase Cloud Music / Kugou / QQ Music all use milliseconds)
  - `lyrics[].text` (string): Lyric content
- `data.tlyrics` (array): Translated lyric list (same structure as `lyrics`)
- `data.song_name` (string, optional): Song name; the field is not returned when the platform does not provide it
- `data.singer` (string, optional): Singer name
- `data.audio_id` (string, optional): The platform's internal audio ID
- `data.album_id` (string, optional): Album ID
- `data.duration` (number, optional): Total song duration, in seconds
- `data.singer_id` (string, optional): Singer ID
- `data.cover_base64` (string): Cover image base64 (**the original image URL is not returned**); an empty string `""` when there is no cover
- `data.cover_size` (string): The size of the **cover itself**, such as `"1024x1024"`; an empty string when there is no cover
- `data.cover_w` / `data.cover_h` (number): Cover (after scaling) width and height, equal to the two numbers of `cover_size`

::: tip Call examples
```bash
# Default step (NetEase Cloud Music = 1024, the largest image)
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230"

# Specify a size / the largest step (the two parameter names are equivalent)
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&cover_size=512"
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&size=max"
```

:::

**Non-Unity Player:**
- **Success**: 302 redirect to the direct link address
- **Failure**: Returns JSON formatted error information

---

## v4 Merged Endpoint

v4 combines the two v3 endpoints into a single entry point and **dispatches automatically** according to the platform the link belongs to:

| Link type | Which branch it takes |
|---|---|
| Music platforms (NetEase Cloud Music / Kugou / Migu / QQ Music / YouTube Music) | Lyrics branch |
| Video / live platforms (Bilibili / Douyin / Kuaishou / AcFun / YouTube / Twitter / Instagram) | Danmaku branch |
| Platform not recognized | Handled by the danmaku branch (`mode=lyric` can force the lyrics branch) |

**Interface**: `/v4/vrc?url={link}`

**Parameters**:

| Parameter | Description |
|---|---|
| `url` (required) | Video / music / playlist link |
| `mode` | `auto` (default, automatic dispatch) / `danmaku` danmaku only / `lyric` lyrics only / `both` fetch both (equivalent to `merge=1`) |
| `merge` | `1` returns the merged structure (see below); default `0`, i.e. "direct replacement mode" |
| `media` | `1` appends a top-level `url` field (a playable direct link) to the response body; default `0` |
| `json` | `1` makes non-Unity clients return JSON too (by default non-Unity clients get a 302 redirect to the direct link) |
| `limit` / `start_time` / `duration` / `ai_subtitle` / `subtitle_lang` / `lang` | Danmaku branch parameters, exactly the same as `/v3/vrc-danmaku` |
| `size` / `cover_size` | Lyrics branch parameters, exactly the same as `/v3/vrc-lyric` |
| `i` / `index` | Which track of a music playlist to take (starts from 1) |

### Direct Replacement Mode (default, `merge=0`)

The behavior is **exactly the same field by field** as v3: the client only has to change the address from `/v3/vrc-lyric` or `/v3/vrc-danmaku` to `/v4/vrc`, and not a single line of parsing code needs changing.

| Client | Behavior of `/v4/vrc` |
|---|---|
| UA contains `Unity` | Returns the full JSON of the corresponding branch (music → same as `/v3/vrc-lyric`; video → same as `/v3/vrc-danmaku`) |
| Other UA | 302 redirect to the direct link |
| Other UA + `json=1` | Returns `{ "success": true, "url": "<direct link>" }` |

```bash
# Music (Unity gets the lyrics JSON, with fields identical to /v3/vrc-lyric)
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"

# Video (Unity gets the danmaku JSON)
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6&limit=2000"

# Player (non-Unity: 302 to the direct link)
curl -I "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"

# Non-Unity clients also want JSON
curl "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230&json=1"
```

### Merge Mode (`merge=1` or `mode=both`)

Get "direct link + danmaku + lyrics" in one call:

```json
{
  "success": true,
  "url": "http://m704.music.126.net/xxxx.mp3?vuutv=...",
  "data": {
    "platform": "netease",
    "kind": "music",
    "mode": "lyric",
    "url": "http://m704.music.126.net/xxxx.mp3?vuutv=...",
    "is_direct_link": false,
    "danmaku": null,
    "lyric": {
      "success": true,
      "data": {
        "platform": "网易云音乐",
        "lyrics": [],
        "tlyrics": [],
        "cover_base64": "...",
        "cover_size": "1024x1024"
      }
    }
  }
}
```

Field description:
- `data.platform` (string): Platform **identifier** (`netease` / `bilibili` / `douyin` …); note that this is not the Chinese name — the `platform` inside the lyrics/danmaku sub-objects is the Chinese name
- `data.kind` (string): Platform type, `music` / `video` / `live` / `unknown`
- `data.mode` (string): The branch actually taken this time, `lyric` / `danmaku` / `both`
- `data.url` (string): Playable direct link (an empty string when parsing fails)
- `data.is_direct_link` (boolean): Whether the original link itself is a direct link
- `data.danmaku` (object|null): A response body **exactly the same** as `/v3/vrc-danmaku`; `null` when `mode` does not include danmaku
- `data.lyric` (object|null): A response body **exactly the same** as `/v3/vrc-lyric`; `null` when `mode` does not include lyrics
- `data.errors` (object, optional): Appears when one of the sub-requests fails, for example `{"media":"...","danmaku":"..."}`

::: tip Call examples for merge mode
```bash
# Direct link + lyrics + cover
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230&merge=1&size=512"

# Direct link + danmaku + subtitles
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6&mode=both&limit=5000"
```

:::

---

## Playlist Parsing Interface

Parses a shared playlist (links such as NetEase Cloud Music's `/m/playlist?id=xxx&creatorId=...`) into JSON, where every song carries a title and a **gateway link that can be played directly**.

**Interface**: `/v1/playlist?url={playlist link}` and `/v4/playlist?url={playlist link}` (the same route; the two addresses are equivalent)

**Parameters**:

| Parameter | Description |
|---|---|
| `url` (required) | Playlist link; supports `music.163.com/playlist?id=`, `/m/playlist?id=`, `#/playlist?id=`, and the chart `toplist?id=` |
| `base` | Gateway base address used to generate the inner playback links; when omitted the server's `PUBLIC_BASE_URL` is used, falling back to the current request domain |
| `encode` | `1` URL-encodes the inner song links (not encoded by default) |
| `limit` / `offset` | Take only a slice of the playlist (for fetching a large playlist in batches) |
| `raw` | `1` additionally attaches the raw playlist data returned by the parsing node |
| `nocache` | `1` skips the server cache (5 days by default) and forces a fresh parse |

**Response**:

```json
{
  "success": true,
  "platform": "网易云音乐",
  "platform_key": "netease",
  "playlist": {
    "id": "17883859097",
    "name": "歌单名称",
    "creator": "创建者昵称",
    "creator_id": "9948997429",
    "cover_url": "https://p1.music.126.net/xxxx.jpg?param=1024y1024",
    "track_count": 15,
    "count": 2,
    "returned": 2,
    "offset": 0,
    "tracks": [
      {
        "index": 1,
        "id": "3353908798",
        "title": "春风三月",
        "name": "春风三月",
        "artists": "歌手A, 歌手B",
        "album": "专辑名",
        "duration": 241,
        "url": "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=3353908798"
      }
    ],
    "cached": false
  }
}
```

Field description:
- `platform` (string): Chinese platform name; `platform_key` (string): platform identifier (`netease`)
- `playlist.id` (string): Playlist ID; `name` / `creator` / `creator_id`: playlist information
- `playlist.cover_url` (string): Direct link to the playlist cover (the server appends the largest-image parameter `?param=1024y1024`)
- `playlist.track_count` (number): The **total number of tracks** in the playlist; `count`: the number of tracks returned this time
- `playlist.returned` / `playlist.offset` (number, only present when `limit` is used): the starting point and length of this slice
- `playlist.cached` (boolean): Whether the server cache was hit this time
- `playlist.tracks[].index` (number): A **1-based** sequence number (can be fed directly to `/v1/music?i=`)
- `playlist.tracks[].id` (string): Song ID; `title` and `name` are the same title (both readings are supported)
- `playlist.tracks[].duration` (number): Duration (seconds)
- `playlist.tracks[].url` (string): A **gateway link that can be played directly**, pointing to `/v4/vrc` by default (Unity clients get the lyrics JSON, players get a 302 to the direct link)

::: tip Caching
The whole playlist (including every track and the generated links) is cached on the server for **5 days** (`PLAYLIST_CACHE_TTL`). Add `nocache=1` if the playlist content has changed and you want it to take effect immediately.
:::

**Errors**:
- `UNSUPPORTED_PLATFORM` (400): Playlists from this platform are not supported yet (currently only NetEase Cloud Music is supported)
- `PLAYLIST_NOT_FOUND` (404): The playlist does not exist or access is not permitted (private playlists need a login cookie configured on the parsing node)
- `NO_NODES_AVAILABLE` (503): No parsing nodes are currently available
- `PLAYLIST_ERROR` (502): Other parsing failure

---

## Slot Relay Interface (VRChat world song requests)

### Background

VRChat's Udon **cannot construct a `VRCUrl` at runtime**, so the player addresses inside a world can only come from "baked into the world at build time" or "typed in by the player". The world therefore only bakes a batch of empty addresses that **contain no song data at all** (equivalent to baking just one domain), and **the server** decides "which song the n-th address currently plays":

```text
GET /poll           Track list of the current playlist (clients render the list from it)
GET /s/<n>          The real direct link the n-th item currently corresponds to (302); when the UA contains Unity, returns the lyrics JSON instead
GET /p?u=<playlist> Players switch the playlist (token-free, idempotent)
```

Switching the playlist = changing server state; the client does not need a single change, a re-bake or a re-upload of the world.

### `GET /poll`

```json
{
  "ok": true,
  "zone": 0,
  "mode": "idpool",
  "name": "我喜欢的音乐",
  "platform": "netease",
  "source": "https://music.163.com/playlist?id=6886428436",
  "updatedAt": 1791488029088,
  "count": 45,
  "max": 20000,
  "songs": [
    {
      "i": 0,
      "id": "19460184",
      "title": "Omen",
      "artist": "The Prodigy",
      "album": "Invaders Must Die",
      "duration": 216
    }
  ]
}
```

- `mode` (string): `slot` (slot relay: `i` is a 0-based sequence number) or `idpool` (record id pool: `i` is a record id)
- `count` (number): The length of this list; `max` (number): the upper bound under the current mode (`slot` = capacity per zone, `idpool` = pool capacity)
- `songs[].i` (number): **The index the client should use** — use it to build `/s/<i>` for playback
- `songs[].id` (string): The song's ID on the source platform; `title` / `artist` / `album` / `duration` (seconds)

### `GET /s/<n>`

- **UA contains `Unity`**: returns the **lyrics JSON** of the song in that slot, with a structure exactly the same as `/v3/vrc-lyric` (for the lyrics component inside the world)
- **Other UA**: 302 redirect to the **real direct link** of the song in that slot (for players; the server parses it itself and will not 302 to a pool address that negotiates by UA)

Errors:

| Case | HTTP | code |
|---|---|---|
| `n` is not a valid integer / exceeds the upper bound | 400 | `BAD_SLOT` |
| That slot currently has no song | 404 | `SLOT_EMPTY` |
| Direct link parsing failed | 502 | `DIRECT_LINK_FAILED` |

### `GET /p?u={<playlist ID> or <playlist link>}`

Players switch the playlist, **token-free** (build it directly in an in-world input field). The response body is **completely isomorphic** to `/poll`, so a client can refresh its list as soon as it receives it.

- A bare playlist ID is supported (`/p?u=3778678`); the server assembles the full link itself (typing with a controller in VR is better kept as short as possible)
- **Idempotent**: when the request is for the playlist that is already current, the existing list is returned directly without re-parsing
- Rate limit: 30 requests per minute per IP
- The server can close this entry point with `SLOT_PLAYER_LOAD=0` (once closed it returns 404 `PLAYER_LOAD_DISABLED`)

::: warning Has side effects
`/p` **really does replace the playlist currently in use by that instance** (the `/poll` and `/s/<n>` of other rooms/worlds change accordingly). Be careful not to trigger it by accident while debugging.
:::

::: tip Difference between the two modes
- **Slot relay** (`mode: "slot"`): the `n` of `/s/<n>` is a **sequence number**, and the server keeps one global table → multiple rooms/worlds will **override each other's playlists**
- **Record id pool** (`mode: "idpool"`): `n` is a **record id** (the same song always has the same id), and the server keeps zero session state → multiple rooms do not interfere with each other and URLs can be shared directly; the cost is that the address pool size baked by the client must match the pool capacity (`max`)
:::

---

## General Response Format

### Error Response Format

The error response format of all interfaces is unified as follows:

```json
{
  "error": true,
  "status": 400,
  "code": "ERROR_CODE",
  "message": "错误描述信息"
}
```

Common error codes:

| code | HTTP | Description |
|---|---|---|
| `METHOD_NOT_ALLOWED` | 405 | Missing the required url request parameter |
| `IM_A_TEAPOT` | 418 | The url parameter is empty |
| `INVALID_URL` | 422 | The provided parameters do not contain a valid URL link |
| `FORBIDDEN_URL` | 403 | This link contains an unsafe target address and has been blocked by the system |
| `CONTENT_RESTRICTED` | 451 | Due to copyright or compliance reasons, parsing this content is temporarily not supported |
| `PARSE_ERROR` | 400 / 500 | Parsing failed |
| `NO_NODES_AVAILABLE` | 503 | No parsing nodes are currently available |
| `UNSUPPORTED_PLATFORM` | 400 | Playlists from this platform are not supported for parsing yet |
| `PLAYLIST_NOT_FOUND` | 404 | The playlist does not exist or access is not permitted |
| `PLAYLIST_EMPTY` | 404 | The playlist contains no playable tracks |
| `PLAYLIST_ERROR` | 502 | Playlist parsing failed |
| `MISSING_SOURCE` | 400 | The playlist address is missing when switching playlists |
| `BAD_SLOT` | 400 | The slot number is invalid or exceeds the upper bound |
| `SLOT_EMPTY` | 404 | That slot currently has no song assigned |
| `DIRECT_LINK_FAILED` | 502 | Slot direct link parsing failed |
| `SLOT_ERROR` | 502 | Other slot error |
| `PLAYER_LOAD_DISABLED` | 404 | The player-side playlist switching entry point is closed |
| `LOAD_FAILED` | 502 | Loading the playlist failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests (e.g. `/p` allows 30 per minute per IP) |

::: tip The "soft failure" of the lyrics/danmaku interfaces
`/v3/vrc-lyric`, `/v3/vrc-danmaku`, and `/v4/vrc` (Unity branch) **do not raise an error when the content cannot be parsed**: they still return `success: true`, only with empty arrays and empty cover strings. Clients do not need a dedicated fallback error for this case.
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
