---
outline: deep
---

# API 文档

本文档描述 `api.kipfel.link` 对外提供的 HTTP API，适用于文档站直接收录。

- 基础路径：`/v1`、`/v2`
- 请求方式：除特别说明外均为 `GET`
- 返回格式：
  - 解析类接口默认返回 `302` 重定向到真实媒体地址
  - 当传入 `json=1`、`json=true` 或请求头 `Accept: application/json` 时，返回 JSON
- 内容类型：
  - JSON 接口：`application/json`
  - 图片代理：原样透传上游图片类型
  - 背景图接口：返回 `302` 到静态资源 URL

建议在服务端接入时统一使用 JSON 模式，以便更稳定地处理错误和结果。

## 基础信息

### Base URL

```text
主站：https://api.kipfel.link/
仅 v1：https://api.kipfel.vrchat.org.cn/
```

### 域名说明

| 域名 | 说明 |
| --- | --- |
| `https://api.kipfel.link/` | 主站，支持 `v1` 与文档中公开的其他可用接口 |
| `https://api.kipfel.vrchat.org.cn/` | 仅支持 `v1` API，不支持 `v2` 及其他附加接口 |

### 通用请求头

```http
Accept: application/json
```

### 通用查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 大多数解析接口必填 | 待解析的原始链接，支持分享文案混输，服务端会自动提取真实链接 |
| `json` | string | 否 | 传 `1` 或 `true` 时强制返回 JSON，而不是 302 跳转 |
| `real_ip` | string | 否 | 客户端真实公网 IP，用于更精准的区域节点选择 |
| `type` | string | 否 | 指定解析类型，常见值：`video`、`music`、`live`、`playlist`、`collection` |
| `i` | number | 否 | 音乐歌单或多资源场景下的索引，从 `1` 开始更稳妥 |

### 返回约定

#### 1. 解析成功且使用 JSON 模式

```json
{
  "success": true,
  "url": "https://cdn.example.com/media.mp4"
}
```

#### 2. 解析成功且使用默认模式

服务端返回：

```http
302 Found
Location: https://cdn.example.com/media.mp4
```

#### 3. 解析失败

```json
{
  "error": true,
  "status": 422,
  "code": "INVALID_URL",
  "message": "提供的参数不包含有效的 URL 链接"
}
```

## 安全与限制

### 限流策略

| 范围 | 限制 |
| --- | --- |
| 全站 | 单个 IP `15` 分钟最多 `150` 次请求 |
| `/v1`, `/v2` API | 单个 IP 每分钟最多 `50` 次请求 |

触发限制时通常返回 `429 Too Many Requests`。

### IP封禁机制

播放非法内容的IP将被封禁。如果您的IP被封禁或有疑问，请联系：
- **Admin**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **运维人员**: 海落QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)

### 302跳转限制

取消了非视频平台以及白名单地址的302跳转，仅支持已支持的视频平台链接进行解析和跳转。

### 版权与合规限制

以下来源会被直接拦截并返回 `451`：

- 腾讯视频
- 爱奇艺
- 优酷
- 芒果 TV
- 哔哩哔哩番剧
- 西瓜视频
- 搜狐视频

### 已支持平台

| 平台 | 类型 | 说明 |
| --- | --- | --- |
| 哔哩哔哩 | `video` / `live` | 支持普通视频、直播、短链与部分直链 |
| 抖音 | `video` / `live` | 支持短链展开 |
| 快手 | `video` / `live` | 支持视频与直播 |
| AcFun | `video` | 支持视频解析 |
| 网易云音乐 | `music` / `playlist` | 支持单曲与歌单详情 |
| 酷狗音乐 | `music` | 支持音频解析 |
| 咪咕音乐 | `music` | 支持音频解析 |
| YouTube | `video` / `music` | 支持 YouTube 与 YouTube Music |
| X / Twitter | `video` | 支持公开视频链接 |
| Instagram | `video` | 支持公开视频链接 |

## V1 解析接口

### `GET /v1/vrc`

视频解析主接口。适用于短视频、普通视频与部分直播链接。

#### 查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | 视频或直播分享链接 |
| `json` | string | 否 | `1` / `true` 时返回 JSON |
| `type` | string | 否 | 手动指定解析类型，默认自动识别，兜底为 `video` |
| `real_ip` | string | 否 | 客户端真实公网 IP |

#### 请求示例

```bash
curl "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1xx411c7mD&json=1"
```

#### 成功响应

```json
{
  "success": true,
  "url": "https://cdn.example.com/video.mp4"
}
```

#### 说明

- 自动展开 `b23.tv`、`v.douyin.com`、`youtu.be` 等短链接
- 自动识别直播链接并切换到直播解析逻辑
- 若目标本身已是受支持平台的媒体直链，会直接返回原链接

### `GET /v1/music`

音乐解析主接口。适用于单曲、部分歌单内曲目解析。

#### 查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | 音乐链接 |
| `i` | number | 否 | 歌单曲目索引 |
| `json` | string | 否 | `1` / `true` 时返回 JSON |
| `type` | string | 否 | 默认自动识别，兜底为 `music` |
| `real_ip` | string | 否 | 客户端真实公网 IP |

#### 请求示例

```bash
curl "https://api.kipfel.link/v1/music?url=https%3A%2F%2Fmusic.163.com%2Fsong%3Fid%3D19013859097&json=1"
```

#### 成功响应

```json
{
  "success": true,
  "url": "https://cdn.example.com/audio.mp3"
}
```

#### 说明

- 自动兼容网易云 `song`、`playlist` 链接格式
- 当歌单解析失败时，会尝试回退到单曲解析逻辑
- 传入 `i` 时会优先解析对应索引的曲目

### `GET /v1/kfc`

视频备用解析接口。不依赖 WebRTC 定位逻辑，适合作为兼容保底入口。

#### 查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | 目标链接 |
| `json` | string | 否 | `1` / `true` 时返回 JSON |
| `type` | string | 否 | 可手动指定类型 |
| `i` | number | 否 | 特定资源索引 |
| `real_ip` | string | 否 | 客户端真实公网 IP |

#### 返回说明

- 当 `type=playlist` 时，返回的是歌单详情 JSON，而不是直链跳转
- 其他场景与 `/v1/vrc` 基本一致

### `GET /v1/musickfc`

音乐备用解析接口，行为与 `/v1/music` 类似。

#### 查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | 音乐链接 |
| `i` | number | 否 | 曲目索引 |
| `json` | string | 否 | `1` / `true` 时返回 JSON |
| `type` | string | 否 | 默认自动识别，兜底为 `music` |
| `real_ip` | string | 否 | 客户端真实公网 IP |

### `GET /v1/collection`

解析视频合集，并返回合集中的子项目列表。

#### 查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | 合集页面链接 |
| `format` | string | 否 | 传 `js` 时返回 JavaScript 数组文本，否则返回 JSON |
| `real_ip` | string | 否 | 客户端真实公网 IP |

#### JSON 响应示例

```json
{
  "title": "合集标题",
  "items": [
    {
      "title": "第 1 集",
      "url": "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fexample.com%2Fitem-1"
    }
  ]
}
```

#### JavaScript 响应示例

```javascript
[
  {
    title: "第 1 集",
    url: "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fexample.com%2Fitem-1"
  }
]
```

#### 说明

- 当前仅支持可识别为 `video` 类型的平台合集
- 返回的 `items[].url` 已转换为本站可继续调用的 `/v1/vrc` 地址

### `GET /v1/playlist-detail`

获取网易云歌单详情。

#### 查询参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | string | 是 | 网易云歌单链接 |
| `real_ip` | string | 否 | 客户端真实公网 IP |

#### 响应说明

该接口直接透传解析节点返回的歌单详情。常见结构类似：

```json
{
  "title": "歌单标题",
  "tracks": [
    {
      "index": 1,
      "title": "歌曲名称",
      "artist": "歌手",
      "url": "https://cdn.example.com/audio.mp3"
    }
  ]
}
```

#### 限制

- 仅支持网易云歌单
- 非网易云链接会返回 `422`

## V2 辅助接口

说明：以下 `v2` 接口仅可通过 `https://api.kipfel.link/` 访问，`https://api.kipfel.vrchat.org.cn/` 不支持。

### `GET /v2/background/:type/:timestamp?`

随机背景图重定向接口。

#### 路径参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `type` | string | 是 | `mobile` 表示竖屏，其余值按横屏处理 |
| `timestamp` | string | 否 | 可用于前端强制刷新，服务端不参与业务计算 |

#### 返回说明

- 成功时返回 `302`，跳转到 `/assets/background/...` 或 `/assets/pin/...`
- 未找到可用图片时返回 `404`

## 常见错误码

| HTTP 状态码 | 业务码 | 说明 |
| --- | --- | --- |
| `403` | 无固定业务码 | 非受支持平台链接被拒绝重定向 |
| `405` | `METHOD_NOT_ALLOWED` | 缺少 `url` 参数键名 |
| `418` | `IM_A_TEAPOT` | `url` 参数为空字符串 |
| `422` | `INVALID_URL` | 未能从输入中提取出合法 URL |
| `422` | `MISSING_PARAMETER` | 缺失必要参数 |
| `422` | `UNSUPPORTED_PLATFORM` | 当前平台或当前链接类型不支持 |
| `451` | `CONTENT_RESTRICTED` | 因版权或合规原因不支持 |
| `500` | `PARSE_ERROR` | 通用解析失败 |
| `500` | `COLLECTION_PARSE_ERROR` | 合集解析失败 |
| `500` | `PLAYLIST_ERROR` | 歌单详情获取失败 |
| `503` | `NO_NODES_AVAILABLE` | 当前没有可用解析节点 |
| `504` | `PARSE_ERROR` | 上游解析节点超时或拒绝连接 |
| `429` | `API_LIMIT_EXCEEDED` | API 请求过于频繁 |
