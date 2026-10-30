---
outline: deep
description: "VRChat 视频解析 API 完整接口文档：v1 视频与音乐、v3 弹幕与歌词、v4 统一入口、封面编码、歌单与世界槽位的参数、JSON 返回及错误码。"
---

# VRC 视频解析 API 调用与限制文档

## 项目概述

VRC 视频解析专为 VRChat 玩家设计，提供免费、快捷的视频和音频解析服务。

## 基础信息

### 接口地址
```text
https://api.kipfel.link/
```

#### 备用接口地址

```text
https://api.kipfel.vrchat.org.cn/
```

### User-Agent 要求
::: warning 注意
- v3 / v4：歌词、弹幕组件使用包含 `Unity` 的 UA；播放器使用不含 `Unity` 的 UA。它们是**两次独立请求**，不是一次请求发送两个 UA。非 Unity 客户端需要 JSON 时传 `json=1`。
:::

---

## v1 核心解析接口

### 视频解析

**接口**：`/v1/vrc?url={视频链接}`  
**参数**：
- `url` (必填)：视频链接

**响应**：
- **成功**：302 重定向到直链地址
- **失败**：返回 JSON 格式错误信息

**JSON 版本**：`/v1/vrc-json` - 始终返回 JSON

**JSON 响应格式**：

**成功响应**：
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

字段说明：
- `code` (Number)：业务状态码，`0` 表示成功。
- `message` (String)：业务响应信息，通常为 `"success"`。
- `log_id` (String)：请求 ID。
- `data.video_id` (String)：从链接提取的 BV 号；提取不到时为请求 ID。
- `data.avid` (String)：从输入的 av 链接提取的 AV 号，否则为空字符串。
- `data.bvid` (String)：从输入链接提取并转为大写的 BV 号，否则为空字符串。
- `data.title` (String)：视频或音频的标题。
- `data.desc` (String)：视频或音频的描述/简介。
- `data.duration` (Number)：媒体总时长，单位：秒。
- `data.cover` (String)：默认展示封面图直链。
- `data.create_time` (Number)：作品发布的时间戳（秒级）。
- `data.update_time` (Number)：当前为 0。
- `data.status` (Number)：媒体状态码。
- `data.category` (String)：当前为空字符串。
- `data.category_name` (String)：当前为空字符串。
- `data.author.user_id` (String)：当前为空字符串。
- `data.author.nickname` (String)：创作者的昵称。
- `data.author.avatar` (String)：创作者头像图片的 URL。
- `data.stat.play_count` (Number)：播放总量。
- `data.stat.like` (Number)：点赞总数。
- `data.stat.comment` (Number)：评论总数。
- `data.stat.share` (Number)：分享转发总数。
- `data.stat.favorite` (Number)：当前为 0。
- `data.content.play_url` (String)：**核心数据**：去水印媒体播放直链。
- `data.content.cover_url` (String)：与 `data.cover` 相同的封面直链。
- `data.content.hashtags` (Array)：当前为空数组。
- `data.content.mentions` (Array)：当前为空数组。
- `data.content.music_info` (Object)：当前为空对象。

**失败响应**：
```json
{
  "error": true,
  "status": 400,
  "code": "PARSE_ERROR",
  "message": "解析失败，请检查链接是否正确"
}
```

字段说明：
- `error` (boolean)：是否发生错误
- `status` (number)：HTTP 状态码
- `code` (string)：错误代码
- `message` (string)：错误信息

---

::: tip 返回字段
v1 的 `log_id` 是请求 ID。`video_id` 在能提取 BV 号时使用 BV 号，否则为请求 ID；`avid` / `bvid` 仅从输入提取，不保证平台原始大小写或 AV / BV 互转。`author.user_id` 和分类当前为空，`favorite` 为 0；话题、提及、背景音乐为空数组 / 对象。v1 可用 `-json`、`json=1` 或 `Accept: application/json` 选择 JSON。
:::

### 备用视频解析接口

**接口**：`/v1/kfc?url={视频链接}`  
**参数**：同 `/v1/vrc`

**响应**：同 `/v1/vrc`

**JSON 版本**：`/v1/kfc-json` - 返回格式同 `/v1/vrc-json`

---

### 音乐解析

**接口**：`/v1/music?url={音乐链接}`\
**参数**：`url` (必填)，使用单首歌曲链接，歌单先调用下方的歌单接口。

**响应**：成功时 302 到播放直链。需要 JSON 时加 `json=1`，或发送 `Accept: application/json`，格式同 `/v1/vrc-json`。

::: warning JSON 地址
当前没有注册 `/v1/music-json`。请使用 `/v1/music?url=...&json=1`；`/v1/musickfc-json` 仍可用。`i` / `index` / `@N` 选曲方式当前不生效。
:::

---

### 备用音乐解析接口

**接口**：`/v1/musickfc?url={音乐链接}`\
**参数**：同 `/v1/music`

**响应**：同 `/v1/music`

**JSON 版本**：`/v1/musickfc-json` - 返回格式同 `/v1/music?json=1`

---


## v3 高级接口

v3 接口面向需要弹幕、歌词的播放器。**UA 含 `Unity` 或 `unity`，或传 `json=1` 时返回 JSON**；其它客户端成功时 302 跳转到直链。

### 弹幕接口

**接口**：`/v3/vrc-danmaku?url={视频链接}`  
**参数**：`url` (必填)；`json=1` (可选，让非 Unity 客户端也拿到 JSON)。

**JSON 响应格式**：

```json
{
  "success": true,
  "data": {
    "platform": "bilibili",
    "comments": [
      {
        "t": 0.5,
        "c": "弹幕内容",
        "ty": 1,
        "co": 16777215,
        "fs": 25
      }
    ]
  }
}
```


字段说明：
- `success` (boolean)：请求是否成功；Unity 分支解析失败也会返回空壳，见下方说明。
- `data.platform` (string)：平台标识，如 `bilibili`、`douyin`，不是平台中文名。
- `data.comments` (array)：弹幕列表，无弹幕时为 `[]`。
- `comments[].t` (number)：时间点，单位：秒。
- `comments[].c` (string)：弹幕内容。
- `comments[].ty` (number)：类型，如 `1` 滚动、`4` 底部、`5` 顶部。
- `comments[].co` (number)：十进制 RGB 颜色，`16777215` = 白色。
- `comments[].fs` (number)：字号。

::: warning 注意
当前接口不返回顶层 `danmaku`、`subtitles`、`subtitle_langs`、`has_more`，也没有接入旧版的 `limit`、`start_time`、`duration`、`ai_subtitle`、`lang` / `subtitle_lang` 参数。客户端请读取 `data.comments`，不要照旧字段去找。
:::

### 歌词接口

**接口**：`/v3/vrc-lyric?url={音乐链接}`  
**参数**：`url` (必填)；`json=1` (可选)。

**JSON 响应格式**（默认 Base64 模式，未取到封面时）：

```json
{
  "success": true,
  "data": {
    "platform": "netease",
    "lyrics": [
      {
        "time": 18.466,
        "text": "歌词内容"
      }
    ],
    "tlyrics": [],
    "song_name": "海阔天空",
    "singer": "Beyond",
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


字段说明：
- `data.platform` (string)：平台标识，如 `netease`、`kugou`、`qqmusic`。
- `data.lyrics` / `data.tlyrics` (array)：原歌词 / 翻译歌词；条目为 `{ "time": 18.466, "text": "歌词内容" }`。**时间单位是秒，可以带小数**，没有内容时为空数组。
- `data.song_name` / `data.singer` (string)：歌曲名称 / 歌手。
- `data.duration` (number)：总时长，单位：秒。
- `data.audio_id` / `data.album_id` / `data.singer_id` (string)：当前兼容结构中为空字符串。

::: tip 封面图
根据响应中的 `cover_mode` / `cover_encoding` 读取封面：
- `base64`（默认）：`cover_encoding: "jpeg"`，读取 `cover_base64`；成功时 `cover_size: "128x128"`。
- `palette`：`cover_encoding: "palette64"`，读取 `cover_width`、`cover_height`、`cover_palette`、`cover_pixels`。成功时为 128×128、64 色，`cover_origin: "top-left"`。像素从左到右、从上到下排列，每个字符在 `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_` 中的位置就是调色板下标；调色板为十进制 RGB。**像素字符串不是图片 Base64**。
- `url`：`cover_encoding: "url"`，读取 `cover_url`，客户端自行下载图片。

基础结构的调色板字段在其它模式下仍保留为空值。没有封面时尺寸为 0、数组 / 字符串为空，不影响歌词返回。旧版 `size` / `cover_size` 请求参数不生效，也不返回 `cover_w` / `cover_h`。
:::

```bash
curl -G -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku" --data-urlencode "url=https://www.bilibili.com/video/BV1aAhm6vEA6"
curl -G "https://api.kipfel.link/v3/vrc-lyric" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "json=1"
```

---

## v4 合并接口

v4 把视频与音乐放到一个入口，默认按链接自动选择弹幕或歌词分支。

**接口**：`/v4/vrc?url={链接}`；`/v4/url` 是同一处理入口的别名。

| 参数 | 说明 |
|---|---|
| `url` (必填) | 视频 / 音乐链接；歌单使用下方的歌单接口 |
| `mode` | 默认 `auto`；`lyric` / `music` 选择歌词结构，其它值走弹幕结构；自动模式下音乐返回歌词 |
| `json` | `1` 让非 Unity 客户端也返回完整分支 JSON |
| `media` | `1` 在成功的 JSON 中追加顶层 `url` 播放直链 |
| `world` | 世界编号；视频分 P / 合集编号分配需要已创建并启用的世界 |

::: warning 合并结构
当前实现不处理 `merge=1`，`mode=both` 也不会合并歌词和弹幕。返回体沿用 v3 对应分支结构；非 Unity + `json=1` 也返回完整分支 JSON，不是只有 `success` / `url` 的对象。`Accept` / `format` 不参与 v3 / v4 的 JSON 判定。
:::

### 调用示例

```bash
curl -G -A "Unity demo" "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "media=1"
curl -G "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://www.bilibili.com/video/BV1aAhm6vEA6?p=2" --data-urlencode "json=1" --data-urlencode "world=demo"
curl -I "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"
```


### 视频分 P 与合集

v4 的视频 JSON 额外返回顶层 `playback`。基本字段有 `source`、`title`、`author`、`duration`、`bvid`、`cid`、`page`、`hasParts`、`hasCollection`；哔哩哔哩会尝试读取分 P 和合集。

- `currentId` (number，可选)：当前视频 / 分 P 的视频池编号，用 `/sell/{currentId}?world={世界编号}` 播放。
- `list` (object，可选)：当前视频的分 P 清单，结构同下面的视频池。
- `collection` (object，可选)：合集清单；`collectionError` 为合集读取失败代码（如有）。
- `error` (string，可选)：如 `WORLD_REQUIRED`、`WORLD_UNAVAILABLE`、`INVALID_WORLD`、`PART_POOL_UNAVAILABLE`、`PART_METADATA_ERROR`，表示附加信息或编号分配未完成，不代表弹幕 JSON 一定失败。

需要分 P / 合集时请传 `world`。这里分配编号**不会替换 `/p` 手动加载的清单**。

---

## 歌单解析接口

**接口**：`/v1/playlist?url={歌单链接}` 或 `/v4/playlist?url={歌单链接}`，始终返回 JSON。

网易云歌单返回下面的兼容结构。哔哩哔哩分 P / 合集请使用 `/p`，不要从这个兼容接口读取视频列表。

```json
{
  "success": true,
  "platform": "网易云音乐",
  "platform_key": "netease",
  "playlist": {
    "id": "https://music.163.com/playlist?id=3778678",
    "name": "歌单名称",
    "creator": "",
    "creator_id": "",
    "cover_url": "",
    "track_count": 1,
    "count": 1,
    "tracks": [
      {
        "index": 1,
        "id": "347230",
        "title": "海阔天空",
        "name": "海阔天空",
        "artists": "Beyond",
        "album": "专辑名称",
        "duration": 326,
        "url": "https://api.kipfel.link/v4/vrc?url=https%3A%2F%2Fmusic.163.com%2Fsong%3Fid%3D347230"
      }
    ]
  }
}
```


- `platform_key` (string)：平台标识；`platform` 是兼容展示名称。
- `playlist.id` (string)：当前为源链接；`name` 为歌单名称。
- `playlist.track_count` / `playlist.count` (number)：总曲目数 / 本次返回曲目数。
- `playlist.tracks[].index` (number)：从 1 开始的列表序号，**不是世界槽位编号**。
- `tracks[].id` / `title` / `name` / `artists` / `album` / `duration`：歌曲 ID、标题、标题别名、歌手、专辑、时长（秒）。
- `tracks[].url` (string)：该曲的 `/v4/vrc?url=...`，按 UA 返回歌词 JSON 或 302。
- `creator`、`creator_id`、`cover_url` 当前为空字符串。

当前歌单接口不支持 `nocache=1`。选歌时使用每首歌的链接；旧版 `i` / `index` / `@N` 选曲方式当前没有接入。

---

## 槽位中继接口（VRChat 世界点歌）

### 背景

VRChat 的 Udon 在运行时无法构造 `VRCUrl`，世界可以预先烤入一批固定地址，由服务器分配编号对应的歌曲或视频。

::: warning 世界编号
以下接口都必须传一次 `world`，内容为 1–64 位英文字母、数字、下划线，不接受重复参数或百分号编码。请使用已开通的世界编号。
:::

### `GET /poll?world={世界编号}`

`/slots` 是别名。默认读音乐池，`pool=video` 读视频池；`/pocl?world=...` 固定读视频池。

```json
{
  "type": "music_playlist",
  "pool": "music",
  "world": "demo",
  "max": 100000,
  "ok": true,
  "name": "歌单名称",
  "source": "https://music.163.com/playlist?id=3778678",
  "platform": "netease",
  "updatedAt": "2026-10-30T08:00:00Z",
  "mode": "idpool",
  "songs": [
    {
      "i": 0,
      "id": "347230",
      "title": "海阔天空",
      "artist": "Beyond",
      "album": "专辑名称",
      "duration": 326,
      "songUrl": "https://music.163.com/song?id=347230"
    }
  ],
  "total": 1
}
```


- `mode` 固定为 `idpool`；`world` 是世界编号，`max` 是池容量。
- `total` 为当前列表条数；`updatedAt` 是 RFC 3339 时间字符串，不是毫秒时间戳；不返回 `count`。
- 音乐使用 `songs`；`i` 是服务器分配的记录编号，可能不连续，不要按列表序号拼地址。
- 视频使用 `items`（空时可能省略），包含 `bvid`、`cid`、`page`，多分 P 条目还有 `parts`；`playableTotal` 为可播放项数量，`collectionId` 为合集 ID（如有）。基础 `songs` 仍会序列化，视频列表请读 `items`。
- 条目共用 `id`、`title`、`artist`、`album`、`duration`、`songUrl`；分 P 也使用同样结构，时长单位秒。
- `type` 可为 `music_playlist`、`bilibili_parts`、`bilibili_collection`；`pool` 为 `music` 或 `video`。

### `GET /s/{n}?world={世界编号}`

- **UA 含 Unity（不区分大小写）或 `json=1`**：返回该记录的歌词 JSON。
- **其它客户端**：302 到该记录的播放直链。
- 视频使用 `/sell/{n}?world=...`，始终返回播放重定向；文字信息使用 `/video-info/{n}?world=...`，返回 `{ "success": true, "playback": { ... } }`。

### `GET /p?world={世界编号}&u={歌单ID或链接}`

玩家侧加载列表，免令牌，返回与 `/poll` 同类的清单。`url` 可代替 `u`；裸数字按网易云歌单 ID 处理。支持网易云歌单、哔哩哔哩分 P / 合集。

`scope` 可选：`auto`（默认）、`parts`、`collection`，指定哔哩哔哩列表范围。

```bash
curl -G "https://api.kipfel.link/p" --data-urlencode "world=demo" --data-urlencode "u=3778678"
curl "https://api.kipfel.link/poll?world=demo"
curl "https://api.kipfel.link/pocl?world=demo"
curl -G "https://api.kipfel.link/p" --data-urlencode "world=demo" --data-urlencode "u=https://www.bilibili.com/video/BV1aAhm6vEA6" --data-urlencode "scope=parts"
curl -I "https://api.kipfel.link/s/0?world=demo"
curl "https://api.kipfel.link/video-info/0?world=demo"
```


::: warning 有副作用
`/p` 会替换**同一个 world、同一个池**的当前列表。同一世界的房间看到同一份列表，不同世界与音乐 / 视频池互相独立。编号在保护期内保留，池满后可回收过期记录，所以不要把记录编号当作歌曲永久 ID。
:::

---

## 解析预览接口

**接口**：`GET /preview?url={链接}&mode=auto`。单条媒体返回 JSON，不按 UA 切换成播放重定向；网易云歌单会 302 到 `/v4/playlist`。`mode` 可为 `auto`、`video`、`music`，其它值按 `auto` 处理。

**JSON 响应示例**：

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
    "title": "海阔天空",
    "author": "Beyond",
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
        "text": "歌词内容"
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

`requestId` 是请求 ID；`platform` 是平台信息对象；`mediaUrl` / `mediaType` 为播放地址 / 类型；`meta` 为媒体信息，`durationSeconds` 单位秒。`lyric.lines` 与可选的 `lyric.translated` 使用秒；`danmaku.count` / `danmaku.preview` 为弹幕总数 / 预览列表，完整弹幕使用 v3 / v4。`timings` 内时长单位毫秒，`cached` 表示解析结果是否来自缓存。可选 `subtitles` 条目为 `{ "from": 0, "to": 1.5, "text": "字幕" }`（秒），可选 `collection` 包含 `title`、`items`（`title` / `url`）。这些字段没有内容时可能省略。失败时查看 `success: false` 与 `error.code` / `error.message`；可选 `redirectUrl` 是跳转地址。此结构与 v1 / v3 / v4 不同，不要混用字段。

---

## 通用响应格式

### 错误响应格式

旧版 v1 / v3 / v4 的参数校验和普通播放解析错误使用以下结构：

```json
{
  "error": true,
  "status": 400,
  "code": "PARSE_ERROR",
  "message": "链接解析失败，请检查链接是否正确"
}
```


`/p`、`/poll`、`/slots`、`/pocl`、`/s/{n}`、`/sell/{n}`、`/video-info/{n}` 的业务错误返回 `error`、`code`、`message`，可带 `details`，**没有 `status` 字段**；HTTP 状态从响应本身读取。

| code | HTTP | 说明 |
|---|---|---|
| `METHOD_NOT_ALLOWED` | 405 | 缺少 url 参数 |
| `IM_A_TEAPOT` | 418 | url 为空 |
| `INVALID_URL / UNSUPPORTED_PLATFORM` | 422 | 无效链接 / 不支持的平台 |
| `CONTENT_RESTRICTED` | 451 | 受限制内容 |
| `PARSE_ERROR` | 400 / 403 | 普通播放 / 非 Unity JSON 解析失败；规则拦截为 403 |
| `INVALID_WORLD / INVALID_POOL` | 400 | 世界编号或池参数无效 |
| `INVALID_INPUT / INVALID_LIST_SCOPE` | 400 | 缺少列表来源或 scope 无效 |
| `UNSUPPORTED_PLAYLIST` | 400 | 不支持该平台的列表 |
| `WORLD_OR_SLOT_NOT_FOUND` | 404 | 世界或记录不存在 |
| `WORLD_DISABLED` | 403 | 世界已停用 |
| `SLOT_POOL_FULL` | 409 | 池满且剩余记录仍受保护 |
| `SLOT_MEDIA_ERROR` | 502 | 记录的播放直链解析失败 |

::: tip 歌词/弹幕接口的“软失败”
通过参数校验后，v3 / v4 的 Unity 分支解析失败也返回 HTTP 200、`success: true` 的空壳：弹幕为 `data.platform: "generic"`、`data.comments: []`；歌词为 `generic`、空歌词与空封面字段，空壳不保证带 `cover_mode`。参数缺失、无效链接等校验错误仍正常报错。

v1 的 JSON 分支解析失败则返回 `{ "code": -1, "message": "...", "log_id": "req_...", "data": {} }`，通常 HTTP 200，规则拦截为 403；不要只看 HTTP 状态判断成功。
:::

---

## 受限制内容

以下平台内容不支持解析：

- 腾讯视频
- 爱奇艺
- 优酷
- 芒果TV
- 哔哩哔哩番剧
- 西瓜视频
- 搜狐视频

---

## 相关页面

- [视频解析使用教程](/zh/video-parser/guide) —— 各接口的调用方式与支持的链接格式
- [视频解析常见问题](/zh/video-parser/faq) —— 播放失败、解析异常的排查方法与错误码
- [CDN 域名列表](/zh/video-parser/cdn) —— 添加到 VRChat 地图白名单所需的域名
