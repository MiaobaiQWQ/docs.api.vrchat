---
outline: deep
description: "VRChat 视频解析 API 完整接口文档：v1 视频与音乐解析、v3 弹幕/字幕与歌词、v4 合并接口、歌单解析与槽位中继的请求地址、参数、返回字段与错误码。"
---

# VRC 视频解析 API 调用与限制文档

## 项目概述

VRC 视频解析是一个多源视频/音频解析代理网关，专为 VRChat 玩家设计，提供免费、快捷的视频和音频解析服务。

## 基础信息

### 接口地址
```text
https://api.kipfel.link/
```

#### 另一个域名（部署内容不同）

```text
https://api.kipfel.vrchat.org.cn/
```

两个域名**不是同一套部署**，可用接口不一样（实测 2026-10-09）：

| 接口 | `api.kipfel.link` | `api.kipfel.vrchat.org.cn` |
|---|---|---|
| `/v1/*`（视频 / 音乐解析） | ✅ | ✅ |
| `/v3/*`（弹幕 / 歌词） | ✅ | ✅ |
| `/v4/vrc`（合并接口） | ✅ | ✅ |
| `/v1/playlist`、`/v4/playlist`（歌单） | ✅ | ❌（返回首页 HTML） |
| `/poll`、`/s/<n>`、`/p`（槽位中继） | ✅ | ✅ |

### User-Agent 要求
::: warning 注意
- 你需要发送两个 ua，一个包含 `Unity xxxxxxxx`，另一个不包含 `Unity xxxx`
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

字段说明：
- `code` (Number)：业务状态码，`0` 表示成功。
- `message` (String)：业务响应信息，通常为 `"success"`。
- `log_id` (String)：平台的日志请求ID（如有）。
- `data.video_id` (String)：平台内部的唯一项目ID（如抖音的 `aweme_id` / `item_id`，快手的 `photo_id`）。
- `data.avid` (String)：哔哩哔哩特有，AV号ID（其他平台可能为空字符串）。
- `data.bvid` (String)：哔哩哔哩特有，BV号（其他平台可能为空字符串）。
- `data.title` (String)：视频或音频的标题。
- `data.desc` (String)：视频或音频的描述/简介。
- `data.duration` (Number)：媒体总时长，单位：秒。
- `data.cover` (String)：默认展示封面图直链。
- `data.create_time` (Number)：作品发布的时间戳（秒级）。
- `data.update_time` (Number)：作品更新的时间戳（秒级）。
- `data.status` (Number)：媒体状态码。
- `data.category` (String)：作品分类ID。
- `data.category_name` (String)：作品分类名称。
- `data.author.user_id` (String)：创作者在平台内的唯一 UID / sec_uid。
- `data.author.nickname` (String)：创作者的昵称。
- `data.author.avatar` (String)：创作者头像图片的 URL。
- `data.stat.play_count` (Number)：播放总量。
- `data.stat.like` (Number)：点赞总数。
- `data.stat.comment` (Number)：评论总数。
- `data.stat.share` (Number)：分享转发总数。
- `data.stat.favorite` (Number)：收藏总数。
- `data.content.play_url` (String)：**核心数据**：去水印媒体播放直链。
- `data.content.cover_url` (String)：原画质封面直链。
- `data.content.hashtags` (Array)：提取出的话题标签列表。
- `data.content.mentions` (Array)：提取出的 @用户 列表。
- `data.content.music_info` (Object)：关联的背景音乐信息（原声等）。

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

### 备用视频解析接口

**接口**：`/v1/kfc?url={视频链接}`  
**参数**：同 `/v1/vrc`

**响应**：同 `/v1/vrc`

**JSON 版本**：`/v1/kfc-json` - 返回格式同 `/v1/vrc-json`

---

### 音乐解析

**接口**：`/v1/music?url={音乐链接}&i={索引}`  
**参数**：
- `url` (必填)：音乐链接或歌单链接
- `i` (可选)：歌单索引（从 1 开始）

**响应**：
- **成功**：302 重定向到直链地址
- **失败**：返回 JSON 格式错误信息

**JSON 版本**：`/v1/music-json`

**JSON 响应格式**：同 `/v1/vrc-json`

---

### 备用音乐解析接口

**接口**：`/v1/musickfc?url={音乐链接}&i={索引}`  
**参数**：同 `/v1/music`

**响应**：同 `/v1/music`

**JSON 版本**：`/v1/musickfc-json` - 返回格式同 `/v1/music-json`

---

## v3 高级接口

v3 接口面向需要弹幕、歌词等富内容的播放器：除直链外还会返回结构化 JSON 数据。

### 弹幕接口

**接口**：`/v3/vrc-danmaku?url={视频链接}`  
**参数**：
- `url` (必填)：视频链接
- `limit` (可选)：弹幕数量限制，默认 10000；**只限制弹幕，不影响字幕**
- `start_time` (可选)：起始时间（秒），只返回该时间点之后的内容；与 `duration` 搭配组成时间窗
- `duration` (可选)：时间窗长度（秒），需与 `start_time` 一起传
- `ai_subtitle` (可选)：是否返回哔哩哔哩字幕（AI 字幕 + UP主上传的 CC 字幕）。`1` / `true` / `yes` / `on` 为开启，`0` / `false` / `no` / `off` 为关闭；不传时跟随服务端默认值（当前默认开启）
- `lang` (可选)：字幕语言过滤，逗号分隔（如 `ai-zh,zh-CN,ja`）；传 `*` 或留空表示返回全部可用语言。也可以写成 `subtitle_lang`

::: tip 字幕（哔哩哔哩）
- 字幕只对**哔哩哔哩**生效，其它平台会自动忽略 `ai_subtitle` / `lang`
- AI 字幕（`ai-zh`、`ai-ja` …）与 UP主上传的 CC 字幕（`zh`、`zh-CN`、`zh-Hans` …）一并返回，用条目里的 `l` 区分
- 语言码大小写不敏感，并支持主语言前缀匹配（传 `zh` 会命中 `zh-CN`）
- 只要某一种语言时，建议直接用 `lang=` 让服务端过滤，比拉全量再自己筛更省流量
- `start_time` + `duration` 的时间窗过滤对弹幕和字幕分别生效
:::

**响应**：

**Unity Player（User-Agent 包含 Unity），以哔哩哔哩为例：**

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

字段说明：
- `success` (boolean)：请求是否成功（字幕取不到也照样为 `true`，只是 `subtitles` 为空数组）
- `platform` (string)：平台中文名，如 `哔哩哔哩`
- `video_id` (string)：视频 ID，哔哩哔哩为 BV 号
- `title` (string)：视频标题
- `has_more` (boolean)：使用 `start_time` + `duration` 切片时，后面是否还有内容
- `danmaku` (array)：弹幕列表
  - `danmaku[].t` (number)：弹幕时间点（秒）
  - `danmaku[].c` (string)：弹幕内容
  - `danmaku[].ty` (number)：弹幕类型（`1` 滚动、`4` 底部、`5` 顶部等）
  - `danmaku[].co` (number)：弹幕颜色，十进制 RGB（`16777215` = 白色）
  - `danmaku[].fs` (number)：字号
- `subtitles` (array)：字幕**扁平数组**，所有语言混在一起、没有嵌套字典；无字幕时为 `[]`
  - `subtitles[].t` (number)：字幕开始时间（秒）
  - `subtitles[].to` (number)：字幕结束时间（秒）
  - `subtitles[].c` (string)：字幕文本（已去掉换行与首尾空白）
  - `subtitles[].l` (string)：语言码（如 `ai-zh`、`zh-CN`、`ja`）
- `subtitle_langs` (array，可选)：本次**实际返回**的语言码，与 `subtitles[].l` 出现过的值一致；没有字幕时不返回该字段
- `subtitle_locked` (boolean，可选)：`true` 表示该视频确实有字幕轨，但服务端没配置登录态 Cookie，拿不到正文；只有"尝试取字幕却没取到"时才会出现（主动 `ai_subtitle=0` 关闭不会出现）
- `subtitle_locked_langs` (array，可选)：被登录态挡住的语言码，与 `subtitle_locked` 一起出现

::: tip 调用示例

```bash
# 默认：弹幕 + 全部可用语言的字幕
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6"

# 只要中文 AI 字幕
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=ai-zh"

# 只要 UP主上传的中/英文字幕（排除 ai- 开头的 AI 字幕）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=zh-CN,zh-Hans,en-US"

# 不要字幕
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&ai_subtitle=0"
```

:::

::: warning 字段顺序
`title` 等小字段**始终排在 `danmaku` / `subtitles` 两个大数组前面**。
Udon 侧有些 JSON 解析只在响应开头若干字符内找 key，数组一旦把字段挤到后面就会读不到，客户端不要依赖这些字段出现在末尾。
:::

**其它平台（抖音、快手等）** 返回同样的 `danmaku` 数组，但不含 `subtitles` / `subtitle_langs` 等字幕字段。

**非 Unity Player：**
- **成功**：302 重定向到直链地址
- **失败**：返回 JSON 格式错误信息

---

### 歌词接口

**接口**：`/v3/vrc-lyric?url={音乐链接}`  
**参数**：
- `url` (必填)：音乐链接
- `size` / `cover_size` (可选)：封面图尺寸，取**最长边上限**，保持宽高比、不放大原图。两个参数名等价（`size` 优先），取值 `64` / `128` / `256` / `512` / `1024`，也可以写 `max`（等价最大档 1024）；传其它值按默认档处理。不传时：**网易云默认 1024（最大图）**，其它平台默认 `64`

::: tip 封面图
- 封面以 **base64 内嵌**在歌词 JSON 里返回，不额外给图片地址，Udon 侧直接解码成贴图即可
- `size` / `cover_size` 是本接口自己的参数，不会被当成音乐链接的一部分（`url` 里带同名参数也不会影响解析结果）
- 服务端没取到封面（平台无封面、图片下载失败等）时，`cover_base64` / `cover_size` 都为空字符串，不会报错
:::

**响应**：

**Unity Player（User-Agent 包含 Unity）：**

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

字段说明：
- `success` (boolean)：请求是否成功（取不到歌词时也为 `true`，只是 `lyrics` 为空）
- `data.platform` (string)：平台中文名（如 `网易云音乐`）
- `data.lyrics` (array)：原歌词列表
  - `lyrics[].time` (number)：歌词时间点，**单位毫秒（整数）**（网易云 / 酷狗 / QQ音乐都是毫秒）
  - `lyrics[].text` (string)：歌词内容
- `data.tlyrics` (array)：翻译歌词列表（结构与 `lyrics` 相同）
- `data.song_name` (string，可选)：歌曲名称；平台未提供时不返回该字段
- `data.singer` (string，可选)：歌手名称
- `data.audio_id` (string，可选)：平台内部的音频 ID
- `data.album_id` (string，可选)：专辑 ID
- `data.duration` (number，可选)：歌曲总时长，单位：秒
- `data.singer_id` (string，可选)：歌手 ID
- `data.cover_base64` (string)：封面图 base64（**不回传原始图片地址**）；没有封面时为空字符串 `""`
- `data.cover_size` (string)：**封面本身**的尺寸，如 `"1024x1024"`；没有封面时为空字符串
- `data.cover_w` / `data.cover_h` (number)：封面（缩放后）宽高，等于 `cover_size` 的两个数

::: tip 调用示例
```bash
# 默认档（网易云 = 1024 最大图）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230"

# 指定尺寸 / 最大档（两个参数名等价）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&cover_size=512"
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&size=max"
```

:::

**非 Unity Player：**
- **成功**：302 重定向到直链地址
- **失败**：返回 JSON 格式错误信息

---

## v4 合并接口

v4 把 v3 的两个接口合成一个入口，并按链接所属平台**自动分流**：

| 链接类型 | 走哪个分支 |
|---|---|
| 音乐平台（网易云 / 酷狗 / 咪咕 / QQ音乐 / YouTube Music） | 歌词分支 |
| 视频 / 直播平台（B站 / 抖音 / 快手 / AcFun / YouTube / Twitter / Instagram） | 弹幕分支 |
| 识别不出平台 | 按弹幕分支处理（可用 `mode=lyric` 强制切到歌词分支） |

**接口**：`/v4/vrc?url={链接}`

**参数**：

| 参数 | 说明 |
|---|---|
| `url` (必填) | 视频 / 音乐 / 歌单链接 |
| `mode` | `auto`（默认，自动分流）/ `danmaku` 只走弹幕 / `lyric` 只走歌词 / `both` 两个都取（等同 `merge=1`） |
| `merge` | `1` 返回合并结构（见下）；默认 `0`，即"直接替换模式" |
| `media` | `1` 在响应体里追加顶层 `url` 字段（可播放直链）；默认 `0` |
| `json` | `1` 让非 Unity 客户端也返回 JSON（默认非 Unity 走 302 跳直链） |
| `limit` / `start_time` / `duration` / `ai_subtitle` / `subtitle_lang` / `lang` | 弹幕分支参数，与 `/v3/vrc-danmaku` 完全一致 |
| `size` / `cover_size` | 歌词分支参数，与 `/v3/vrc-lyric` 完全一致 |
| `i` / `index` | 音乐歌单取第几首（从 1 开始） |

### 直接替换模式（默认，`merge=0`）

行为与 v3 **逐字段完全一致**：客户端只要把地址从 `/v3/vrc-lyric` 或 `/v3/vrc-danmaku` 换成 `/v4/vrc`，解析代码一行都不用改。

| 客户端 | `/v4/vrc` 的行为 |
|---|---|
| UA 含 `Unity` | 返回对应分支的完整 JSON（音乐 → 与 `/v3/vrc-lyric` 相同；视频 → 与 `/v3/vrc-danmaku` 相同） |
| 其它 UA | 302 重定向到直链 |
| 其它 UA + `json=1` | 返回 `{ "success": true, "url": "<直链>" }` |

```bash
# 音乐（Unity 拿到歌词 JSON，字段与 /v3/vrc-lyric 一字不差）
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"

# 视频（Unity 拿到弹幕 JSON）
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6&limit=2000"

# 播放器（非 Unity：302 到直链）
curl -I "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"

# 非 Unity 也想要 JSON
curl "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230&json=1"
```

### 合并模式（`merge=1` 或 `mode=both`）

一次拿到"直链 + 弹幕 + 歌词"：

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

字段说明：
- `data.platform` (string)：平台**标识**（`netease` / `bilibili` / `douyin` …），注意这里不是中文名；歌词/弹幕子对象里的 `platform` 才是中文名
- `data.kind` (string)：平台类型，`music` / `video` / `live` / `unknown`
- `data.mode` (string)：本次实际走的分支，`lyric` / `danmaku` / `both`
- `data.url` (string)：可播放直链（解析失败时为空字符串）
- `data.is_direct_link` (boolean)：原链接本身是不是直链
- `data.danmaku` (object|null)：与 `/v3/vrc-danmaku` **完全相同**的响应体；`mode` 不含弹幕时为 `null`
- `data.lyric` (object|null)：与 `/v3/vrc-lyric` **完全相同**的响应体；`mode` 不含歌词时为 `null`
- `data.errors` (object，可选)：某个子请求失败时出现，例如 `{"media":"...","danmaku":"..."}`

::: tip 合并模式的调用示例
```bash
# 直链 + 歌词 + 封面
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230&merge=1&size=512"

# 直链 + 弹幕 + 字幕
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6&mode=both&limit=5000"
```

:::

---

## 歌单解析接口

把分享出来的歌单（网易云 `/m/playlist?id=xxx&creatorId=...` 这类链接）解析成 JSON，每首歌都带上标题和**可直接播放的网关链接**。

**接口**：`/v1/playlist?url={歌单链接}` 与 `/v4/playlist?url={歌单链接}`（同一个路由，两个地址等价）

**参数**：

| 参数 | 说明 |
|---|---|
| `url` (必填) | 歌单链接，支持 `music.163.com/playlist?id=`、`/m/playlist?id=`、`#/playlist?id=`、榜单 `toplist?id=` |
| `base` | 生成内层播放链接用的网关基址；不传时用服务端 `PUBLIC_BASE_URL`，再退回当前请求域名 |
| `encode` | `1` 把内层歌曲链接做 URL 编码（默认不编码） |
| `limit` / `offset` | 只要歌单里的一段（大歌单分批取用） |
| `raw` | `1` 额外附带解析节点返回的原始歌单数据 |
| `nocache` | `1` 跳过服务端缓存（默认缓存 5 天），强制重新解析 |

**响应**：

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

字段说明：
- `platform` (string)：平台中文名；`platform_key` (string)：平台标识（`netease`）
- `playlist.id` (string)：歌单 ID；`name` / `creator` / `creator_id`：歌单信息
- `playlist.cover_url` (string)：歌单封面直链（服务端会带上最大图参数 `?param=1024y1024`）
- `playlist.track_count` (number)：歌单**总曲目数**；`count`：本次返回的曲目数
- `playlist.returned` / `playlist.offset` (number，用了 `limit` 时才有)：本段起点与长度
- `playlist.cached` (boolean)：本次是否命中服务端缓存
- `playlist.tracks[].index` (number)：**从 1 开始**的序号（可直接喂给 `/v1/music?i=`）
- `playlist.tracks[].id` (string)：歌曲 ID；`title` 与 `name` 是同一份标题（两种读法都兼容）
- `playlist.tracks[].duration` (number)：时长（秒）
- `playlist.tracks[].url` (string)：**可直接播放的网关链接**，默认指向 `/v4/vrc`（Unity 客户端拿到歌词 JSON，播放器拿到 302 直链）

::: tip 缓存
整个歌单（含全部曲目与生成好的链接）会在服务端缓存 **5 天**（`PLAYLIST_CACHE_TTL`）。歌单内容改了想立刻生效就加 `nocache=1`。
:::

**错误**：
- `UNSUPPORTED_PLATFORM` (400)：暂不支持该平台的歌单（目前只支持网易云音乐）
- `PLAYLIST_NOT_FOUND` (404)：歌单不存在或无权访问（私密歌单需要在解析节点配登录 Cookie）
- `NO_NODES_AVAILABLE` (503)：当前无可用解析节点
- `PLAYLIST_ERROR` (502)：其它解析失败

---

## 槽位中继接口（VRChat 世界点歌）

### 背景

VRChat 的 Udon **在运行时无法构造 `VRCUrl`**，世界里的播放器地址只能来自"构建期烤进世界"或"玩家手输"。于是世界只烤一批**不含任何歌曲数据**的空地址（等价于只烤了一个域名），"第 n 个地址现在放哪首歌"由**服务器**决定：

```text
GET /poll          当前歌单的曲目清单（客户端据此渲染列表）
GET /s/<n>         第 n 项当前对应的真实直链（302）；UA 含 Unity 时改为返回歌词 JSON
GET /p?u=<歌单>    玩家侧换歌单（免令牌、幂等）
```

换歌单 = 改服务器状态，客户端一行都不用动、不用重烤、不用重传世界。

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

- `mode` (string)：`slot`（槽位中继：`i` 是 0 起的序号）或 `idpool`（记录 id 池：`i` 是记录 id）
- `count` (number)：本次清单长度；`max` (number)：当前模式下的上界（`slot` = 每区容量，`idpool` = 池容量）
- `songs[].i` (number)：**客户端要用的下标** —— 拿它拼 `/s/<i>` 播放
- `songs[].id` (string)：歌曲在源平台的 ID；`title` / `artist` / `album` / `duration`(秒)

### `GET /s/<n>`

- **UA 含 `Unity`**：返回该槽位歌曲的**歌词 JSON**，结构与 `/v3/vrc-lyric` 完全一致（世界里的歌词组件用）
- **其它 UA**：302 重定向到该槽位歌曲的**真实直链**（播放器用；服务端自己解析，不会 302 到会按 UA 协商的池地址）

错误：

| 情况 | HTTP | code |
|---|---|---|
| `n` 不是合法整数 / 超出上界 | 400 | `BAD_SLOT` |
| 该槽位当前没有歌 | 404 | `SLOT_EMPTY` |
| 直链解析失败 | 502 | `DIRECT_LINK_FAILED` |

### `GET /p?u={<歌单ID>或<歌单链接>}`

玩家侧换歌单，**免令牌**（世界内输入框直接拼）。返回体与 `/poll` **完全同构**，客户端拿到就能直接刷新列表。

- 支持裸歌单 ID（`/p?u=3778678`），服务器自己拼成完整链接（VR 里用手柄打字越短越好）
- **幂等**：请求的还是当前歌单时，直接返回现有清单，不重新解析
- 限流：每 IP 30 次/分钟
- 服务端可用 `SLOT_PLAYER_LOAD=0` 关闭该入口（关闭后返回 404 `PLAYER_LOAD_DISABLED`）

::: warning 有副作用
`/p` 会**真的换掉该实例当前的歌单**（其它房间/世界的 `/poll` 与 `/s/<n>` 随之改变）。调试时注意别误触。
:::

::: tip 两种模式的区别
- **槽位中继**（`mode: "slot"`）：`/s/<n>` 的 `n` 是**序号**，服务端有一张全局表 → 多房间/多世界会**互相顶掉**歌单
- **记录 id 池**（`mode: "idpool"`）：`n` 是**记录 id**（同一首歌永远同一个 id），服务端零会话状态 → 多房间互不干扰、URL 可以直接分享；代价是客户端烤的地址池大小要与池容量（`max`）匹配
:::

---

## 通用响应格式

### 错误响应格式

所有接口的错误响应格式统一如下：

```json
{
  "error": true,
  "status": 400,
  "code": "ERROR_CODE",
  "message": "错误描述信息"
}
```

常见错误代码：

| code | HTTP | 说明 |
|---|---|---|
| `METHOD_NOT_ALLOWED` | 405 | 缺少必要的 url 请求参数 |
| `IM_A_TEAPOT` | 418 | url 参数为空 |
| `INVALID_URL` | 422 | 提供的参数不包含有效的 URL 链接 |
| `FORBIDDEN_URL` | 403 | 该链接包含不安全的目标地址，已被系统拦截 |
| `CONTENT_RESTRICTED` | 451 | 由于版权或合规性原因，暂不支持解析该内容 |
| `PARSE_ERROR` | 400 / 500 | 解析失败 |
| `NO_NODES_AVAILABLE` | 503 | 当前无可用解析节点 |
| `UNSUPPORTED_PLATFORM` | 400 | 该平台的歌单暂不支持解析 |
| `PLAYLIST_NOT_FOUND` | 404 | 歌单不存在或无权访问 |
| `PLAYLIST_EMPTY` | 404 | 歌单里没有可播放的曲目 |
| `PLAYLIST_ERROR` | 502 | 歌单解析失败 |
| `MISSING_SOURCE` | 400 | 换歌单时缺少歌单地址 |
| `BAD_SLOT` | 400 | 槽位号非法或超出上界 |
| `SLOT_EMPTY` | 404 | 该槽位当前没有分配歌曲 |
| `DIRECT_LINK_FAILED` | 502 | 槽位直链解析失败 |
| `SLOT_ERROR` | 502 | 槽位其它错误 |
| `PLAYER_LOAD_DISABLED` | 404 | 玩家侧换歌单入口已关闭 |
| `LOAD_FAILED` | 502 | 装载歌单失败 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求过于频繁（如 `/p` 每 IP 30 次/分钟） |

::: tip 歌词/弹幕接口的"软失败"
`/v3/vrc-lyric`、`/v3/vrc-danmaku`、`/v4/vrc`（Unity 分支）在**解析不到内容时不会报错**：仍然返回 `success: true`，只是数组为空、封面字段为空字符串。客户端不必为这种情况单独兜底报错。
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
