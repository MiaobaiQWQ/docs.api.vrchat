---
outline: deep
description: "自建 Busuanzi 访问统计接口文档：POST、PUT、GET /api 与 /jsonp 的端点、请求头、返回字段、Redis 数据结构与前端接入方法。"
---

# Busuanzi 接口文档

## 项目概述

自建不蒜子（Busuanzi）是一个极简的网站访问量统计系统，可以统计站点级与页面级的 UV / PV。

特性：
- 统计站点的 UV、PV
- 统计子页面的 UV、PV
- 支持 Docker 一键部署
- 隐私保障：仅存储 HASH，不存储明文 IP / Referer
- 兼容 Pjax 技术的网页
- 支持多种数据格式样式（完整数字 / 短格式 / 千分位）
- 支持从原版不蒜子迁移数据

## 基础信息

### 自建 Demo（示例地址，无 SLA 保障）
```text
https://busuanzi.kipfel.link
```

### 前端统计脚本（基于自建 Demo 演示）
```html
<script defer src="https://busuanzi.kipfel.link/js"></script>
```

### 接口基础地址
```text
https://busuanzi.kipfel.link/api
https://busuanzi.kipfel.link/jsonp
```

::: tip 提示
如果您自行部署，需要把脚本中的域名和 `data-api` 改成您自己部署的地址，见下方「使用方法」。
:::

## 数据原理

Busuanzi 使用 Redis 存储与检索统计数据，采用如下键结构：

| 类型 | 数据类型 | 键 |
| --- | --- | --- |
| `sitePv` | String | `bsz:site_pv:md5(host)` |
| `siteUv` | HyperLogLog | `bsz:site_uv:md5(host)` |
| `pagePv` | ZSet | `bsz:page_pv:md5(host) / md5(path)` |
| `pageUv` | HyperLogLog | `bsz:site_uv:md5(host):md5(path)` |

## 使用方法（前端接入）

### 快捷使用

在页面中引入脚本，并在需要显示统计的位置放置带 ID 的标签：

```html
<script defer src="https://busuanzi.kipfel.link/js"></script>

本文总阅读量 <span id="busuanzi_page_pv"></span> 次
本文总访客量 <span id="busuanzi_page_uv"></span> 人
本站总访问量 <span id="busuanzi_site_pv"></span> 次
本站总访客数 <span id="busuanzi_site_uv"></span> 人
```

::: tip 与原版不蒜子的差异
新版去除了 HTML ID 中的 `value` 字符。如果您要兼容原版标签，可以通过 `data-prefix="busuanzi_value"` 实现，见下方示例。
:::

### 可选参数

| 属性 | 默认值 | 释义 |
| --- | --- | --- |
| `data-api` | `http://127.0.0.1:8080/api` | 不蒜子后端 API 地址 |
| `pjax` | `否` | 是否监听 Pjax 页面变化 |
| `data-prefix` | `busuanzi` | 显示标签的前缀（ID） |
| `data-style` | `default` | 数字显示样式：`short` / `comma` / `default` |

### 示例

#### 1. 启用 Pjax 页面自动刷新

```html
<script defer pjax src="https://busuanzi.kipfel.link/js"></script>
```

#### 2. 自定义后端 API 地址

```html
<script defer data-api="https://bsz.example.com/api" src="https://busuanzi.kipfel.link/js"></script>
```

#### 3. 自定义显示样式

```html
<script defer data-style="short" src="https://busuanzi.kipfel.link/js"></script>
```

- `short`：短形式，如 `1024` → `1k`
- `comma`：千分位逗号，如 `1024` → `1,024`
- `default`：默认，显示完整数字

#### 4. 兼容原版不蒜子标签 ID

```html
<script defer data-prefix="busuanzi_value" src="https://busuanzi.kipfel.link/js"></script>
```

## 接口列表

### 通用请求头

| 请求头 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | 否 | 当前页面地址（优先级高于 `Referer`），示例：`https://www.example.com/post/1` |
| `Referer` | string | 否 | 标准 Referer，作为兜底 |
| `User-Agent` | string | 否 | 浏览器 UA，用于 UV 去重 |
| `Origin` | string | 否 | 跨域预检时使用，白名单外会 403 |

---

### 1. POST /api 提交并获取数据

**接口**：`POST /api`

**行为**：递增并获取数据，使页面 PV + 1，新用户 UV + 1，同时以 JSON 返回当前统计值。

#### 请求头

| 请求头 | 类型 | 必填 | 示例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | 否 | `https://www.example.com` |
| `Referer` | string | 否 | `https://www.example.com` |
| `User-Agent` | string | 否 | `Safari` |

#### 请求示例

```bash
curl --location --request POST 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功响应

- 状态码：`200 OK`
- Content-Type：`application/json`

```json
{
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
}
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `site_pv` | number | 该域名下的总访问量（PV） |
| `site_uv` | number | 该域名下的独立访客数（UV） |
| `page_pv` | number | 当前页面的访问量（PV） |
| `page_uv` | number | 当前页面的独立访客数（UV） |

---

### 2. PUT /api 仅提交数据

**接口**：`PUT /api`

**行为**：仅递增，不返回统计数据体，PV + 1、新用户 UV + 1，适合只做数据上报 / 同步的场景，性能更好。

#### 请求头

| 请求头 | 类型 | 必填 | 示例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | 否 | `https://www.example.com` |
| `Referer` | string | 否 | `https://www.example.com` |
| `User-Agent` | string | 否 | `Safari` |

#### 请求示例

```bash
curl --location --request PUT 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功响应

- 状态码：`204 No Content`
- Content-Type：`text/plain`
- 响应体：空

---

### 3. GET /api 仅获取数据

**接口**：`GET /api`

**行为**：只读，不改变任何计数，以 JSON 返回当前统计值。适合后台展示 / 仪表盘拉取。

#### 请求头

| 请求头 | 类型 | 必填 | 示例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | 否 | `https://www.example.com` |
| `Referer` | string | 否 | `https://www.example.com` |
| `User-Agent` | string | 否 | `Safari` |

#### 请求示例

```bash
curl --location 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功响应

- 状态码：`200 OK`
- Content-Type：`application/json`

```json
{
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
}
```

字段含义与 `POST /api` 相同。

---

### 4. GET /jsonp 兼容原版 jsonp

**接口**：`GET /jsonp`

**行为**：递增并返回 JSONP 格式数据，用于兼容原版不蒜子的接入方式。

#### Query 参数

| 参数 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| `callback` | string | 否 | `BszCallback` | JSONP 回调函数名 |

#### 请求头

| 请求头 | 类型 | 必填 | 示例 |
| --- | --- | --- | --- |
| `Referer` | string | 否 | `https://www.example.com` |
| `User-Agent` | string | 否 | `Safari` |

#### 请求示例

```bash
curl --location 'https://busuanzi.kipfel.link/jsonp?callback=BszCallback' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功响应

- 状态码：`200 OK`
- Content-Type：`text/html`

```javascript
typeof BszCallback === 'function' && BszCallback({
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
})
```

---

### 5. OPTIONS /api 跨域预检

**接口**：`OPTIONS /api`

**行为**：浏览器跨域预检使用。正常返回 `204`，并携带允许的 CORS 响应头；若 `Origin` 不在白名单中则返回 `403`。

#### 请求头

| 请求头 | 类型 | 必填 | 示例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | 否 | `https://www.example.com` |
| `Referer` | string | 否 | `https://www.example.com` |
| `User-Agent` | string | 否 | `Safari` |
| `Origin` | string | 否 | `www.example.com` |

#### 请求示例

```bash
curl --location --request OPTIONS 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari' \
--header 'Origin: www.example.com'
```

#### 成功响应

- 状态码：`204 No Content`
- Content-Type：`text/plain`
- 响应体：空

---

## 统计方式说明

- **page_pv（页面访问量）**：每次访问 +1
- **page_uv / site_uv（访客量）**：通过浏览器 `User-Agent` + IP 联合哈希判定；首次访问后会在浏览器 `localStorage` 写入带签名的密钥，用于永久标注用户身份，避免重复计数

## 数据迁移与升级

- 原版不蒜子 → 自建不蒜子：可使用 [`busuanzi-sync`](https://github.com/soxft/busuanzi-sync) 工具
- 从 2.7.x 升级到 2.8.x：由于数据结构变更，请使用 [`bsz-transfer`](https://github.com/soxft/busuanzi/tree/main/bsz-transfer) 进行数据迁移
- 任何版本升级前都建议先备份 Redis 的 `dump.rdb`

## 隐私与安全

- 所有识别信息（Host、路径、IP、UA）在后端均以 **HASH** 形式存储，不保存明文
- 新版默认采用 `POST` 请求 + `x-bsz-referer` 头传递页面地址，而非原版 JSONP，兼容性更好，也更不容易被严格的同源策略拦截
- `BSZ_SECRET` 请务必在部署时改为随机字符串，它用于签发客户端身份标记，避免伪造 UV

## 开源地址

- GitHub：<https://github.com/soxft/busuanzi>
- Gitee：<https://gitee.com/soxft/busuanzi>
- 前端 Demo / Dashboard：<https://github.com/soxft/busuanzi-frontend>

## 相关页面

- [视频解析接口文档](/zh/video-parser/api) —— 同一站点提供的 VRChat 视频解析接口
- [域名分配](/zh/video-parser/domains) —— `busuanzi.kipfel.link` 等子域名的用途说明
