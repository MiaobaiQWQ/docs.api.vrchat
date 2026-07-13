---
outline: deep
---

# VRC 视频解析 API 调用与限制文档

## 项目概述

VRC 视频解析是一个多源视频/音频解析代理网关，专为 VRChat 玩家设计，提供免费、快捷的视频和音频解析服务。

## 基础信息

### 接口地址
```text
https://api.kipfel.link/
```

#### 仅 v1和 v3 接口

```text
https://api.kipfel.vrchat.org.cn/
```

### v1 核心解析接口

#### 视频解析

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

#### 备用视频解析接口

**接口**：`/v1/kfc?url={视频链接}`  
**参数**：同 `/v1/vrc`

**响应**：同 `/v1/vrc`

**JSON 版本**：`/v1/kfc-json` - 返回格式同 `/v1/vrc-json`

---

#### 音乐解析

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

#### 备用音乐解析接口

**接口**：`/v1/musickfc?url={音乐链接}&i={索引}`  
**参数**：同 `/v1/music`

**响应**：同 `/v1/music`

**JSON 版本**：`/v1/musickfc-json` - 返回格式同 `/v1/music-json`

---

### v3 高级接口

### User-Agent 要求
::: warning 注意
- 你需要发送两个ua，一个包含 `Unity xxxxxxxx`，另一个不包含 `Unity xxxx`
- 你需要发送 `Unity xxxxxxxx` 的ua，才能获取弹幕/歌词
- 你需要发送不包含 `Unity xxxxxxxx` 的ua，才能获取视频直链/歌曲直链
:::
### 建议
::: tip 提示
- 建议你地图每个都使用不同的ua，以避免被封禁和用于核查请求来源
- 比如我是某个地图作者，建议取名 `Unity xiaokong`或者就按照规范取名前面必须是 `Unity `开头不然无法返回弹幕/歌词，另一个随便取名
:::

#### 弹幕接口

**接口**：`/v3/vrc-danmaku?url={视频链接}`  
**参数**：
- `url` (必填)：视频链接
- `limit` (可选)：弹幕数量限制，默认 10000

**响应**：

**Unity Player（User-Agent 包含 Unity）：**

```json
{
  "success": true,
  "data": {
    "platform": "bilibili",
    "comments": [
      {
        "time": 10.5,
        "text": "弹幕内容",
        "user": "用户名",
        "color": "FFFFFF"
      }
    ]
  }
}
```

字段说明：
- `success` (boolean)：请求是否成功
- `data.platform` (string)：平台标识
- `data.comments` (array)：弹幕列表
  - `comments[].time` (number)：弹幕时间点（秒）
  - `comments[].text` (string)：弹幕内容
  - `comments[].user` (string)：用户标识
  - `comments[].color` (string)：弹幕颜色（十六进制）

**非 Unity Player：**
- **成功**：302 重定向到直链地址
- **失败**：返回 JSON 格式错误信息

---

#### 歌词接口

**接口**：`/v3/vrc-lyric?url={音乐链接}`  
**参数**：
- `url` (必填)：音乐链接

**响应**：

**Unity Player（User-Agent 包含 Unity）：**

```json
{
  "success": true,
  "data": {
    "platform": "netease",
    "lyrics": [
      {
        "time": 0.0,
        "text": "歌词内容"
      }
    ],
    "tlyrics": [
      {
        "time": 0.0,
        "text": "翻译歌词内容"
      }
    ]
  }
}
```

字段说明：
- `success` (boolean)：请求是否成功
- `data.platform` (string)：平台标识
- `data.lyrics` (array)：原歌词列表
  - `lyrics[].time` (number)：歌词时间点（秒）
  - `lyrics[].text` (string)：歌词内容
- `data.tlyrics` (array)：翻译歌词列表
  - `tlyrics[].time` (number)：歌词时间点（秒）
  - `tlyrics[].text` (string)：翻译歌词内容

**非 Unity Player：**
- **成功**：302 重定向到直链地址
- **失败**：返回 JSON 格式错误信息

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
- `METHOD_NOT_ALLOWED` (405)：缺少必要的 url 请求参数
- `IM_A_TEAPOT` (418)：url 参数为空
- `INVALID_URL` (422)：提供的参数不包含有效的 URL 链接
- `FORBIDDEN_URL` (403)：该链接包含不安全的目标地址，已被系统拦截
- `CONTENT_RESTRICTED` (451)：由于版权或合规性原因，暂不支持解析该内容
- `PARSE_ERROR` (500)：解析失败
- `NO_NODES_AVAILABLE` (503)：当前无可用解析节点

---

::: warning 注意
- 访问频率会动态调整，不代表绝对的速率限制。
:::

## 访问频率限制

### cloudflare和阿里云esa限制频率

| 限制类型 | 窗口大小 | 限制次数 | 封禁时间 |
|---------|---------|---------|---------|
| 所有接口 | 10 秒 | 20 次 | 15 秒 |

#### Nginx限制

| 限制类型 | 窗口大小 | 限制次数 | 封禁时间 |
|---------|---------|---------|---------|
| 部分接口 | 10 秒 | 20 次 | 15 秒 |

### 速率限制(底层)

| 限制类型 | 窗口大小 | 限制次数 |
|---------|---------|---------|
| v1和v3所有接口 | 1 分钟 | 50 次 |

**超过限制响应**：
```json
{
  "error": "API rate limit exceeded",
  "message": "解析频率过高，请稍慢一点",
  "code": "API_LIMIT_EXCEEDED"
}
```

### 404 封禁

| 限制类型 | 窗口大小 | 限制次数 | 封禁时间 |
|---------|---------|---------|---------|
| 所有接口 | 1 分钟 | 3 次 | 5 分钟 |

::: warning 注意
- 正常访问不会触发404错误，除非你在破解我网站的API。
- 限制会随次数增加而增加封禁时间，最多封禁24小时。
- 我会视奸你的请求。
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