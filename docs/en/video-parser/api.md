---
outline: deep
description: "VRChat video API reference: v1 video and music, v3 danmaku and lyrics, v4 unified parsing, cover encoding, playlists, world slots and JSON responses."
---

# VRC Video Parsing API Call and Restriction Documentation

## Project Overview

VRC Video Parsing provides free and fast video and audio parsing for VRChat players.

## Basic Information

### Interface Address
```text
https://api.kipfel.link/
```

#### Alternative Interface Address

```text
https://api.kipfel.vrchat.org.cn/
```

### User-Agent Requirements
::: warning Note
- For v3 / v4, lyrics and danmaku components use a UA containing `Unity`; media players use one without it. These are **two separate requests**, not two UAs in one request. Non-Unity clients can use `json=1` for JSON.
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
  "log_id": "req_example",
  "data": {
    "video_id": "BV17PTT6FEJJ",
    "avid": "",
    "bvid": "BV17PTT6FEJJ",
    "title": "视频标题内容",
    "desc": "视频的详细描述信息",
    "duration": 2136,
    "cover": "http://example.com/cover.jpg",
    "create_time": 1783075293,
    "update_time": 0,
    "status": 0,
    "category": "",
    "category_name": "",
    "author": {
      "user_id": "",
      "nickname": "作者昵称",
      "avatar": "http://example.com/avatar.jpg"
    },
    "stat": {
      "play_count": 36234,
      "like": 2089,
      "comment": 11,
      "share": 32,
      "favorite": 0
    },
    "content": {
      "play_url": "https://example.com/video_no_watermark.mp4",
      "cover_url": "http://example.com/cover.jpg",
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
- `log_id` (String): Request ID.
- `data.video_id` (String): BV ID extracted from the link; otherwise the request ID.
- `data.avid` (String): AV ID extracted from an av input link; otherwise empty.
- `data.bvid` (String): BV ID extracted from input and uppercased; otherwise empty.
- `data.title` (String): The title of the video or audio.
- `data.desc` (String): The description/introduction of the video or audio.
- `data.duration` (Number): Total media duration, unit: seconds.
- `data.cover` (String): Direct link to the default display cover image.
- `data.create_time` (Number): Timestamp when the work was published (in seconds).
- `data.update_time` (Number): Currently 0.
- `data.status` (Number): Media status code.
- `data.category` (String): Currently an empty string.
- `data.category_name` (String): Currently an empty string.
- `data.author.user_id` (String): Currently an empty string.
- `data.author.nickname` (String): The creator's nickname.
- `data.author.avatar` (String): URL of the creator's avatar image.
- `data.stat.play_count` (Number): Total plays.
- `data.stat.like` (Number): Total likes.
- `data.stat.comment` (Number): Total comments.
- `data.stat.share` (Number): Total shares/forwards.
- `data.stat.favorite` (Number): Currently 0.
- `data.content.play_url` (String): **Core data**: Direct link to the watermark-free media playback.
- `data.content.cover_url` (String): The same cover URL as `data.cover`.
- `data.content.hashtags` (Array): Currently an empty array.
- `data.content.mentions` (Array): Currently an empty array.
- `data.content.music_info` (Object): Currently an empty object.

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

::: tip Response Fields
In v1, `log_id` is the request ID. `video_id` uses an extracted BV ID, otherwise the request ID. `avid` / `bvid` are extracted from input only; original casing and AV / BV conversion are not guaranteed. `author.user_id` and category fields are empty, `favorite` is 0, and hashtags, mentions and music information are empty arrays / objects. Select JSON through `-json`, `json=1` or `Accept: application/json`.
:::

### Alternative Video Parsing Interface

**Interface**: `/v1/kfc?url={video link}`  
**Parameters**: Same as `/v1/vrc`

**Response**: Same as `/v1/vrc`

**JSON Version**: `/v1/kfc-json` - response format is the same as `/v1/vrc-json`

---

### Music Parsing

**Interface**: `/v1/music?url={music link}`\
**Parameters**: `url` (required); use individual song links. Fetch playlists through the list interfaces below first.

**Response**: 302 to playable media on success. Add `json=1` or send `Accept: application/json` for JSON in the `/v1/vrc-json` format.

::: warning JSON Address
`/v1/music-json` is not registered. Use `/v1/music?url=...&json=1`; `/v1/musickfc-json` remains available. `i` / `index` / `@N` song selection is not connected.
:::

---

### Alternative Music Parsing Interface

**Interface**: `/v1/musickfc?url={music link}`\
**Parameters**: Same as `/v1/music`

**Response**: Same as `/v1/music`

**JSON Version**: `/v1/musickfc-json` - response format is the same as `/v1/music?json=1`

---


## v3 Advanced Interface

v3 is intended for players that need danmaku or lyrics. **A UA containing `Unity` or `unity`, or `json=1`, returns JSON**; other clients receive a 302 redirect on success.

### Danmaku Interface

**Interface**: `/v3/vrc-danmaku?url={video link}`  
**Parameters**: `url` (required); `json=1` (optional, returns JSON for non-Unity clients too).

**JSON Response Format**:

```json
{
  "success": true,
  "data": {
    "platform": "bilibili",
    "comments": [
      {
        "t": 0.5,
        "c": "Comment text",
        "ty": 1,
        "co": 16777215,
        "fs": 25
      }
    ]
  }
}
```


Field descriptions:
- `success` (boolean): whether the request succeeded; the Unity branch also returns an empty response on parsing failure, as explained below.
- `data.platform` (string): platform key, such as `bilibili` or `douyin`, rather than a display name.
- `data.comments` (array): danmaku entries; `[]` when empty.
- `comments[].t` (number): timestamp in seconds.
- `comments[].c` (string): comment text.
- `comments[].ty` (number): type, such as `1` scrolling, `4` bottom or `5` top.
- `comments[].co` (number): decimal RGB color; `16777215` = white.
- `comments[].fs` (number): font size.

::: warning Note
The current interface does not return top-level `danmaku`, `subtitles`, `subtitle_langs` or `has_more`. The old `limit`, `start_time`, `duration`, `ai_subtitle`, `lang` / `subtitle_lang` parameters are not connected. Read `data.comments` in your client.
:::

### Lyrics Interface

**Interface**: `/v3/vrc-lyric?url={music link}`  
**Parameters**: `url` (required); `json=1` (optional).

**JSON Response Format** (default Base64 mode, with no cover available):

```json
{
  "success": true,
  "data": {
    "platform": "netease",
    "lyrics": [
      {
        "time": 18.466,
        "text": "Lyrics"
      }
    ],
    "tlyrics": [],
    "song_name": "Song title",
    "singer": "Artist",
    "audio_id": "",
    "album_id": "",
    "duration": 326,
    "singer_id": "",
    "cover_mode": "base64",
    "cover_encoding": "jpeg",
    "cover_origin": "top-left",
    "cover_width": 0,
    "cover_height": 0,
    "cover_palette": [],
    "cover_pixels": "",
    "cover_size": "",
    "cover_base64": ""
  }
}
```


Field descriptions:
- `data.platform` (string): platform key, such as `netease`, `kugou` or `qqmusic`.
- `data.lyrics` / `data.tlyrics` (array): original / translated lyrics. Entries use `{ "time": 18.466, "text": "Lyrics" }`; **timestamps are in seconds and may contain decimals**. Missing lyrics produce empty arrays.
- `data.song_name` / `data.singer` (string): song title / artist.
- `data.duration` (number): total duration in seconds.
- `data.audio_id` / `data.album_id` / `data.singer_id` (string): currently empty strings in this compatibility response.

::: tip Cover Image
Read cover art according to `cover_mode` / `cover_encoding` in the response:
- `base64` (default): `cover_encoding: "jpeg"`; read `cover_base64`. A successful conversion sets `cover_size: "128x128"`.
- `palette`: `cover_encoding: "palette64"`; read `cover_width`, `cover_height`, `cover_palette` and `cover_pixels`. A successful image is 128×128 with 64 colors and `cover_origin: "top-left"`. Pixels run left to right, top to bottom. Each character's position in `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_` is its palette index; palette colors are decimal RGB. **This pixel string is not a Base64 image**.
- `url`: `cover_encoding: "url"`; download the image from `cover_url`.

The base palette fields remain present and empty in other modes. Missing covers leave dimensions at 0 and arrays / strings empty without failing the lyrics request. The old `size` / `cover_size` request parameters have no effect, and `cover_w` / `cover_h` are not returned.
:::

```bash
curl -G -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku" --data-urlencode "url=https://www.bilibili.com/video/BV1aAhm6vEA6"
curl -G "https://api.kipfel.link/v3/vrc-lyric" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "json=1"
```

---

## v4 Merged Endpoint

v4 provides one entry point for video and music, selecting danmaku or lyrics automatically from the link by default.

**Interface**: `/v4/vrc?url={link}`; `/v4/url` is an alias handled by the same function.

| Parameter | Description |
|---|---|
| `url` (required) | Video / music link; use the playlist interfaces below for lists |
| `mode` | Default `auto`; `lyric` / `music` selects the lyrics response, other values select danmaku; auto mode returns lyrics for music |
| `json` | `1` returns the full branch JSON for non-Unity clients too |
| `media` | `1` adds a top-level `url` with the playable direct link to successful JSON responses |
| `world` | World ID; assigning video part / collection IDs requires an existing, enabled world |

::: warning Merged Response
The current implementation does not handle `merge=1`, and `mode=both` does not combine lyrics with danmaku. Responses use the corresponding v3 branch structure. Non-Unity clients with `json=1` also receive the full branch JSON, rather than only `success` / `url`. `Accept` / `format` do not control JSON selection in v3 / v4.
:::

### Call Examples

```bash
curl -G -A "Unity demo" "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "media=1"
curl -G "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://www.bilibili.com/video/BV1aAhm6vEA6?p=2" --data-urlencode "json=1" --data-urlencode "world=demo"
curl -I "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"
```


### Video Parts and Collections

Video JSON from v4 adds top-level `playback`. Basic fields are `source`, `title`, `author`, `duration`, `bvid`, `cid`, `page`, `hasParts` and `hasCollection`. Bilibili videos also trigger part and collection lookup.

- `currentId` (number, optional): the current video's / part's video pool ID; play it through `/sell/{currentId}?world={world ID}`.
- `list` (object, optional): the current video's parts, using the video pool structure below.
- `collection` (object, optional): the collection list; `collectionError` contains a collection lookup error code when available.
- `error` (string, optional): examples include `WORLD_REQUIRED`, `WORLD_UNAVAILABLE`, `INVALID_WORLD`, `PART_POOL_UNAVAILABLE` and `PART_METADATA_ERROR`. These describe incomplete metadata or ID assignment and do not necessarily mean the danmaku response failed.

Pass `world` when you need parts / collections. IDs assigned here **do not replace the list manually loaded through `/p`**.

---

## Playlist Parsing Interface

**Interface**: `/v1/playlist?url={playlist link}` or `/v4/playlist?url={playlist link}`; always returns JSON.

NetEase playlists use the compatibility structure below. Use `/p` for Bilibili parts / collections rather than reading video lists from this compatibility endpoint.

```json
{
  "success": true,
  "platform": "网易云音乐",
  "platform_key": "netease",
  "playlist": {
    "id": "https://music.163.com/playlist?id=3778678",
    "name": "Playlist name",
    "creator": "",
    "creator_id": "",
    "cover_url": "",
    "track_count": 1,
    "count": 1,
    "tracks": [
      {
        "index": 1,
        "id": "347230",
        "title": "Song title",
        "name": "Song title",
        "artists": "Artist",
        "album": "Album name",
        "duration": 326,
        "url": "https://api.kipfel.link/v4/vrc?url=https%3A%2F%2Fmusic.163.com%2Fsong%3Fid%3D347230"
      }
    ]
  }
}
```


- `platform_key` (string): platform key; `platform` is the compatibility display name.
- `playlist.id` (string): currently the source URL; `name` is the playlist name.
- `playlist.track_count` / `playlist.count` (number): total tracks / tracks in this response.
- `playlist.tracks[].index` (number): list position starting from 1, **not a world slot ID**.
- `tracks[].id` / `title` / `name` / `artists` / `album` / `duration`: song ID, title, title alias, artist, album and duration in seconds.
- `tracks[].url` (string): a `/v4/vrc?url=...` entry for this song, returning lyrics JSON or a 302 based on the UA.
- `creator`, `creator_id` and `cover_url` are currently empty strings.

The playlist endpoint does not support `nocache=1`. Select songs using their individual links. The old `i` / `index` / `@N` selection methods are not connected.

---

## Slot Relay Interface (VRChat world song requests)

### Background

VRChat Udon cannot construct `VRCUrl` at runtime. A world can bake fixed addresses in advance, with the server assigning the songs or videos behind those IDs.

::: warning World ID
Every interface below requires exactly one `world`: 1–64 English letters, digits or underscores. Duplicate parameters and percent-encoded IDs are rejected. Use an enabled world ID.
:::

### `GET /poll?world={world ID}`

`/slots` is an alias. The default pool is music; use `pool=video` for videos. `/pocl?world=...` always reads the video pool.

```json
{
  "type": "music_playlist",
  "pool": "music",
  "world": "demo",
  "max": 100000,
  "ok": true,
  "name": "Playlist name",
  "source": "https://music.163.com/playlist?id=3778678",
  "platform": "netease",
  "updatedAt": "2026-10-30T08:00:00Z",
  "mode": "idpool",
  "songs": [
    {
      "i": 0,
      "id": "347230",
      "title": "Song title",
      "artist": "Artist",
      "album": "Album name",
      "duration": 326,
      "songUrl": "https://music.163.com/song?id=347230"
    }
  ],
  "total": 1
}
```


- `mode` is always `idpool`; `world` identifies the world, and `max` is the pool capacity.
- `total` is the current list length; `updatedAt` is an RFC 3339 string, not a millisecond timestamp. There is no `count` field.
- Music uses `songs`. Each `i` is a server-assigned record ID and may be nonconsecutive; do not generate addresses from list positions.
- Video uses `items` (may be omitted when empty), including `bvid`, `cid` and `page`. Multi-part entries also include `parts`; `playableTotal` counts playable entries, and `collectionId` is the collection ID when present. The base `songs` field is still serialized; read `items` for video lists.
- Shared item fields are `id`, `title`, `artist`, `album`, `duration` and `songUrl`. Parts use the same structure; durations are in seconds.
- `type` can be `music_playlist`, `bilibili_parts` or `bilibili_collection`; `pool` is `music` or `video`.

### `GET /s/{n}?world={world ID}`

- **UA containing Unity (case-insensitive), or `json=1`**: returns the record's lyrics JSON.
- **Other clients**: 302 to the record's playable direct link.
- Videos use `/sell/{n}?world=...`, which always redirects for playback. For text metadata, use `/video-info/{n}?world=...`, returning `{ "success": true, "playback": { ... } }`.

### `GET /p?world={world ID}&u={playlist ID or link}`

Loads a list without a token and returns the same kind of structure as `/poll`. `url` is an alias for `u`; a bare number is treated as a NetEase playlist ID. Supports NetEase playlists and Bilibili parts / collections.

Optional `scope`: `auto` (default), `parts` or `collection`, selecting the Bilibili list scope.

```bash
curl -G "https://api.kipfel.link/p" --data-urlencode "world=demo" --data-urlencode "u=3778678"
curl "https://api.kipfel.link/poll?world=demo"
curl "https://api.kipfel.link/pocl?world=demo"
curl -G "https://api.kipfel.link/p" --data-urlencode "world=demo" --data-urlencode "u=https://www.bilibili.com/video/BV1aAhm6vEA6" --data-urlencode "scope=parts"
curl -I "https://api.kipfel.link/s/0?world=demo"
curl "https://api.kipfel.link/video-info/0?world=demo"
```


::: warning Side Effects
`/p` replaces the current list for **the same world and pool**. Rooms sharing a world share that list; different worlds and music / video pools are independent. IDs remain reserved during the protection period, but expired records can be recycled when the pool fills. Do not treat a record ID as a permanent song ID.
:::

---

## Parsing Preview Interface

**Interface**: `GET /preview?url={link}&mode=auto`. Individual media returns JSON without UA-based playback redirects; NetEase playlists receive a 302 to `/v4/playlist`. `mode` accepts `auto`, `video` and `music`; other values fall back to `auto`.

**JSON Response Example**:

```json
{
  "success": true,
  "requestId": "req_example",
  "platform": {
    "key": "netease",
    "label": "网易云音乐",
    "kind": "music",
    "active": true,
    "color": "#e60026"
  },
  "kind": "music",
  "mediaUrl": "https://example.com/audio.mp3",
  "mediaType": "audio",
  "degraded": false,
  "meta": {
    "title": "Song title",
    "author": "Artist",
    "durationSeconds": 326,
    "stats": {
      "views": 0,
      "likes": 0,
      "comments": 0,
      "shares": 0
    }
  },
  "lyric": {
    "count": 1,
    "lines": [
      {
        "time": 18.466,
        "text": "Lyrics"
      }
    ]
  },
  "timings": {
    "totalMs": 120,
    "mediaMs": 100
  },
  "cached": false
}
```

`requestId` is the request ID; `platform` is a platform info object. `mediaUrl` / `mediaType` describe playable media, and `meta.durationSeconds` is in seconds. `lyric.lines` and optional `lyric.translated` also use seconds. `danmaku.count` / `danmaku.preview` contain the count / preview; use v3 / v4 for full comments. Durations in `timings` are milliseconds; `cached` indicates a cached parsing result. Optional `subtitles` entries use `{ "from": 0, "to": 1.5, "text": "Subtitle" }` (seconds), and optional `collection` contains `title` and `items` (`title` / `url`). Empty optional content may be omitted. On failure, check `success: false` and `error.code` / `error.message`; optional `redirectUrl` is a redirect address. This structure differs from v1 / v3 / v4; do not mix their fields.

---

## General Response Format

### Error Response Format

Legacy v1 / v3 / v4 parameter validation and ordinary playback parsing errors use this structure:

```json
{
  "error": true,
  "status": 400,
  "code": "PARSE_ERROR",
  "message": "链接解析失败，请检查链接是否正确"
}
```


Business errors from `/p`, `/poll`, `/slots`, `/pocl`, `/s/{n}`, `/sell/{n}` and `/video-info/{n}` contain `error`, `code`, `message` and optional `details`, **without a `status` field**. Read the HTTP status from the response itself.

| code | HTTP | Description |
|---|---|---|
| `METHOD_NOT_ALLOWED` | 405 | Missing url parameter |
| `IM_A_TEAPOT` | 418 | Empty url |
| `INVALID_URL / UNSUPPORTED_PLATFORM` | 422 | Invalid URL / unsupported platform |
| `CONTENT_RESTRICTED` | 451 | Restricted content |
| `PARSE_ERROR` | 400 / 403 | Playback / non-Unity JSON parsing failure; rule blocks use 403 |
| `INVALID_WORLD / INVALID_POOL` | 400 | Invalid world or pool parameter |
| `INVALID_INPUT / INVALID_LIST_SCOPE` | 400 | Missing list source or invalid scope |
| `UNSUPPORTED_PLAYLIST` | 400 | Unsupported platform for lists |
| `WORLD_OR_SLOT_NOT_FOUND` | 404 | World or record not found |
| `WORLD_DISABLED` | 403 | World disabled |
| `SLOT_POOL_FULL` | 409 | Pool full and remaining records protected |
| `SLOT_MEDIA_ERROR` | 502 | Record media URL parsing failed |

::: tip Soft Failures for Lyrics / Danmaku
After parameter validation, parsing failures in the Unity branch of v3 / v4 still return HTTP 200 and an empty `success: true` response. Danmaku uses `data.platform: "generic"` and `data.comments: []`; lyrics use `generic`, empty lyrics and empty cover fields. These empty responses may omit `cover_mode`. Missing parameters or invalid URLs still return validation errors.

The v1 JSON branch instead returns `{ "code": -1, "message": "...", "log_id": "req_...", "data": {} }` on parsing failure, usually with HTTP 200, or 403 for a rule block. Do not use HTTP status alone to decide whether parsing succeeded.
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
