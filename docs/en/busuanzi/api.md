---
outline: deep
description: "Self-hosted Busuanzi analytics API reference: the POST, PUT, GET /api and /jsonp endpoints, request headers, response fields and Redis key layout."
---

# Busuanzi API Documentation

## Project Overview

The self-hosted Busuanzi service is a minimal website traffic statistics system that can count site-level and page-level UV / PV metrics.

Features:
- Count site-wide UV and PV
- Count subpage UV and PV
- Support one-click Docker deployment
- Privacy protection: only HASH values are stored, not plain IP / Referer
- Compatible with websites using Pjax
- Support multiple number display styles (full / short / comma separated)
- Support migrating data from the original Busuanzi

## Basic Information

### Self-hosted Demo (example URL, no SLA guarantee)
```text
https://busuanzi.kipfel.link
```

### Frontend statistics script (based on the self-hosted demo)
```html
<script defer src="https://busuanzi.kipfel.link/js"></script>
```

### API Base URLs
```text
https://busuanzi.kipfel.link/api
https://busuanzi.kipfel.link/jsonp
```

::: tip Tip
If you deploy it yourself, replace the script domain and `data-api` with your own deployment address. See "Usage" below.
:::

## Data Model

Busuanzi uses Redis to store and retrieve statistics data with the following key structure:

| Type | Data Type | Key |
| --- | --- | --- |
| `sitePv` | String | `bsz:site_pv:md5(host)` |
| `siteUv` | HyperLogLog | `bsz:site_uv:md5(host)` |
| `pagePv` | ZSet | `bsz:page_pv:md5(host) / md5(path)` |
| `pageUv` | HyperLogLog | `bsz:site_uv:md5(host):md5(path)` |

## Usage (Frontend Integration)

### Quick Start

Include the script on your page and place elements with IDs where you want the counters to appear:

```html
<script defer src="https://busuanzi.kipfel.link/js"></script>

Total reads for this page: <span id="busuanzi_page_pv"></span>
Total visitors for this page: <span id="busuanzi_page_uv"></span>
Total site visits: <span id="busuanzi_site_pv"></span>
Total site visitors: <span id="busuanzi_site_uv"></span>
```

::: tip Difference from the original Busuanzi
The new implementation removes the `value` segment from the HTML IDs. If you need compatibility with the original tag IDs, use `data-prefix="busuanzi_value"` as shown below.
:::

### Optional Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `data-api` | `http://127.0.0.1:8080/api` | Busuanzi backend API address |
| `pjax` | `No` | Whether to listen for Pjax page changes |
| `data-prefix` | `busuanzi` | Prefix for display element IDs |
| `data-style` | `default` | Number display style: `short` / `comma` / `default` |

### Examples

#### 1. Refresh automatically on Pjax navigation

```html
<script defer pjax src="https://busuanzi.kipfel.link/js"></script>
```

#### 2. Use a custom backend API address

```html
<script defer data-api="https://bsz.example.com/api" src="https://busuanzi.kipfel.link/js"></script>
```

#### 3. Customize the number display style

```html
<script defer data-style="short" src="https://busuanzi.kipfel.link/js"></script>
```

- `short`: short format, for example `1024` -> `1k`
- `comma`: comma-separated format, for example `1024` -> `1,024`
- `default`: default format, showing the full number

#### 4. Keep compatibility with the original Busuanzi tag IDs

```html
<script defer data-prefix="busuanzi_value" src="https://busuanzi.kipfel.link/js"></script>
```

## API List

### Common Request Headers

| Header | Type | Required | Description |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | No | Current page URL, higher priority than `Referer`, for example `https://www.example.com/post/1` |
| `Referer` | string | No | Standard Referer used as fallback |
| `User-Agent` | string | No | Browser UA used for UV deduplication |
| `Origin` | string | No | Used in CORS preflight requests; returns 403 if not in the allowlist |

---

### 1. POST /api Submit and fetch data

**Endpoint**: `POST /api`

**Behavior**: Increments counters and returns data. Page PV increases by 1, UV increases by 1 for a new visitor, and the current statistics are returned as JSON.

#### Request Headers

| Header | Type | Required | Example |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | No | `https://www.example.com` |
| `Referer` | string | No | `https://www.example.com` |
| `User-Agent` | string | No | `Safari` |

#### Request Example

```bash
curl --location --request POST 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### Success Response

- Status: `200 OK`
- Content-Type: `application/json`

```json
{
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
}
```

| Field | Type | Description |
| --- | --- | --- |
| `site_pv` | number | Total page views for the current domain |
| `site_uv` | number | Total unique visitors for the current domain |
| `page_pv` | number | Page views for the current page |
| `page_uv` | number | Unique visitors for the current page |

---

### 2. PUT /api Submit data only

**Endpoint**: `PUT /api`

**Behavior**: Only increments counters and does not return a statistics body. PV increases by 1 and UV increases by 1 for a new visitor. This is suitable for pure reporting or sync scenarios and has lower overhead.

#### Request Headers

| Header | Type | Required | Example |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | No | `https://www.example.com` |
| `Referer` | string | No | `https://www.example.com` |
| `User-Agent` | string | No | `Safari` |

#### Request Example

```bash
curl --location --request PUT 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### Success Response

- Status: `204 No Content`
- Content-Type: `text/plain`
- Response body: empty

---

### 3. GET /api Fetch data only

**Endpoint**: `GET /api`

**Behavior**: Read-only and does not change any counter. Returns the current statistics as JSON. Suitable for dashboards or backend display use cases.

#### Request Headers

| Header | Type | Required | Example |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | No | `https://www.example.com` |
| `Referer` | string | No | `https://www.example.com` |
| `User-Agent` | string | No | `Safari` |

#### Request Example

```bash
curl --location 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### Success Response

- Status: `200 OK`
- Content-Type: `application/json`

```json
{
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
}
```

The field meanings are the same as `POST /api`.

---

### 4. GET /jsonp Compatibility with original JSONP

**Endpoint**: `GET /jsonp`

**Behavior**: Increments counters and returns data in JSONP format for compatibility with the original Busuanzi integration pattern.

#### Query Parameters

| Parameter | Type | Required | Example | Description |
| --- | --- | --- | --- | --- |
| `callback` | string | No | `BszCallback` | JSONP callback function name |

#### Request Headers

| Header | Type | Required | Example |
| --- | --- | --- | --- |
| `Referer` | string | No | `https://www.example.com` |
| `User-Agent` | string | No | `Safari` |

#### Request Example

```bash
curl --location 'https://busuanzi.kipfel.link/jsonp?callback=BszCallback' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### Success Response

- Status: `200 OK`
- Content-Type: `text/html`

```javascript
typeof BszCallback === 'function' && BszCallback({
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
})
```

---

### 5. OPTIONS /api CORS preflight

**Endpoint**: `OPTIONS /api`

**Behavior**: Used by browser CORS preflight requests. Normally returns `204` with allowed CORS response headers. Returns `403` if the `Origin` is not in the allowlist.

#### Request Headers

| Header | Type | Required | Example |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | No | `https://www.example.com` |
| `Referer` | string | No | `https://www.example.com` |
| `User-Agent` | string | No | `Safari` |
| `Origin` | string | No | `www.example.com` |

#### Request Example

```bash
curl --location --request OPTIONS 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari' \
--header 'Origin: www.example.com'
```

#### Success Response

- Status: `204 No Content`
- Content-Type: `text/plain`
- Response body: empty

---

## How Statistics Are Counted

- **page_pv (page views)**: increases by 1 on every visit
- **page_uv / site_uv (unique visitors)**: identified by a combined hash of browser `User-Agent` and IP. After the first visit, a signed key is stored in the browser `localStorage` to mark the visitor permanently and avoid duplicate counting

## Data Migration and Upgrades

- Original Busuanzi -> self-hosted Busuanzi: use [`busuanzi-sync`](https://github.com/soxft/busuanzi-sync)
- Upgrade from 2.7.x to 2.8.x: because the data structure changed, use [`bsz-transfer`](https://github.com/soxft/busuanzi/tree/main/bsz-transfer) for migration
- Before upgrading any version, it is recommended to back up Redis `dump.rdb`

## Privacy and Security

- All identifying information such as host, path, IP, and UA is stored as **HASH** values on the backend rather than plain text
- The new version uses `POST` plus the `x-bsz-referer` header by default instead of the original JSONP approach, which improves compatibility and reduces the chance of being blocked by stricter same-origin policies
- Make sure to change `BSZ_SECRET` to a random string during deployment. It is used to sign the client identity marker and prevent forged UV counts

## Open Source Links

- GitHub: <https://github.com/soxft/busuanzi>
- Gitee: <https://gitee.com/soxft/busuanzi>
- Frontend Demo / Dashboard: <https://github.com/soxft/busuanzi-frontend>

## Related Pages

- [Video Parser API Reference](/en/video-parser/api) — the VRChat video parsing API from the same project
- [Domain Allocation](/en/video-parser/domains) — what subdomains such as `busuanzi.kipfel.link` are used for
