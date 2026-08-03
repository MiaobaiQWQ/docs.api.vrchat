---
outline: deep
---

# Busuanzi API ドキュメント

## プロジェクト概要

セルフホスト版 Busuanzi は、Web サイトのアクセス数を集計するための極小構成の統計システムです。サイト単位およびページ単位の UV / PV を計測できます。

主な特長:
- サイト全体の UV / PV を集計
- サブページごとの UV / PV を集計
- Docker によるワンクリックデプロイをサポート
- プライバシー保護: 平文の IP / Referer を保存せず、HASH のみを保存
- Pjax を利用するページにも対応
- 複数の数値表示形式に対応（完全表示 / 短縮表示 / 桁区切り）
- 旧版 Busuanzi からのデータ移行をサポート

## 基本情報

### セルフホスト版 Demo（サンプル URL、SLA 保証なし）
```text
https://busuanzi.kipfel.link
```

### フロントエンド集計スクリプト（セルフホスト版 Demo を利用した例）
```html
<script defer src="https://busuanzi.kipfel.link/js"></script>
```

### API ベース URL
```text
https://busuanzi.kipfel.link/api
https://busuanzi.kipfel.link/jsonp
```

::: tip ヒント
ご自身でデプロイする場合は、スクリプト内のドメインと `data-api` を自分のデプロイ先に置き換えてください。詳細は下の「使い方」を参照してください。
:::

## データの仕組み

Busuanzi は Redis を使って統計データを保存・参照し、以下のキー構造を採用しています:

| 種類 | データ型 | キー |
| --- | --- | --- |
| `sitePv` | String | `bsz:site_pv:md5(host)` |
| `siteUv` | HyperLogLog | `bsz:site_uv:md5(host)` |
| `pagePv` | ZSet | `bsz:page_pv:md5(host) / md5(path)` |
| `pageUv` | HyperLogLog | `bsz:site_uv:md5(host):md5(path)` |

## 使い方（フロントエンド導入）

### クイックスタート

ページ内でスクリプトを読み込み、統計を表示したい場所に ID 付きの要素を配置します:

```html
<script defer src="https://busuanzi.kipfel.link/js"></script>

この記事の総閲覧数 <span id="busuanzi_page_pv"></span> 回
この記事の総訪問者数 <span id="busuanzi_page_uv"></span> 人
サイト全体の総アクセス数 <span id="busuanzi_site_pv"></span> 回
サイト全体の総訪問者数 <span id="busuanzi_site_uv"></span> 人
```

::: tip 旧版 Busuanzi との違い
新しい実装では、HTML ID に含まれていた `value` 文字列が削除されています。旧版のタグ ID を使いたい場合は `data-prefix="busuanzi_value"` を指定してください。下の例を参照できます。
:::

### オプション属性

| 属性 | 既定値 | 説明 |
| --- | --- | --- |
| `data-api` | `http://127.0.0.1:8080/api` | Busuanzi バックエンド API の URL |
| `pjax` | `いいえ` | Pjax によるページ遷移を監視するか |
| `data-prefix` | `busuanzi` | 表示要素のプレフィックス（ID） |
| `data-style` | `default` | 数値の表示形式: `short` / `comma` / `default` |

### 例

#### 1. Pjax ページ遷移時に自動更新する

```html
<script defer pjax src="https://busuanzi.kipfel.link/js"></script>
```

#### 2. バックエンド API の URL をカスタマイズする

```html
<script defer data-api="https://bsz.example.com/api" src="https://busuanzi.kipfel.link/js"></script>
```

#### 3. 数値表示形式をカスタマイズする

```html
<script defer data-style="short" src="https://busuanzi.kipfel.link/js"></script>
```

- `short`: 短縮表示。例: `1024` → `1k`
- `comma`: 桁区切り表示。例: `1024` → `1,024`
- `default`: 既定の表示。完全な数値をそのまま表示

#### 4. 旧版 Busuanzi のタグ ID に互換対応する

```html
<script defer data-prefix="busuanzi_value" src="https://busuanzi.kipfel.link/js"></script>
```

## API 一覧

### 共通リクエストヘッダー

| ヘッダー | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | いいえ | 現在のページ URL（`Referer` より優先）。例: `https://www.example.com/post/1` |
| `Referer` | string | いいえ | 標準の Referer。フォールバックとして使用 |
| `User-Agent` | string | いいえ | ブラウザ UA。UV 重複排除に利用 |
| `Origin` | string | いいえ | CORS プリフライト時に使用。ホワイトリスト外は 403 |

---

### 1. POST /api データを送信して取得する

**エンドポイント**: `POST /api`

**動作**: カウンタを加算しつつデータを返します。ページ PV が +1、新規ユーザー UV が +1 され、現在の統計値が JSON で返されます。

#### リクエストヘッダー

| ヘッダー | 型 | 必須 | 例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | いいえ | `https://www.example.com` |
| `Referer` | string | いいえ | `https://www.example.com` |
| `User-Agent` | string | いいえ | `Safari` |

#### リクエスト例

```bash
curl --location --request POST 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功レスポンス

- ステータスコード: `200 OK`
- Content-Type: `application/json`

```json
{
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
}
```

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `site_pv` | number | 対象ドメイン全体の総アクセス数（PV） |
| `site_uv` | number | 対象ドメイン全体のユニーク訪問者数（UV） |
| `page_pv` | number | 現在のページのアクセス数（PV） |
| `page_uv` | number | 現在のページのユニーク訪問者数（UV） |

---

### 2. PUT /api データのみ送信する

**エンドポイント**: `PUT /api`

**動作**: 加算のみを行い、統計値のボディは返しません。PV が +1、新規ユーザー UV が +1 されます。単純なデータ送信や同期用途に向いており、より軽量です。

#### リクエストヘッダー

| ヘッダー | 型 | 必須 | 例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | いいえ | `https://www.example.com` |
| `Referer` | string | いいえ | `https://www.example.com` |
| `User-Agent` | string | いいえ | `Safari` |

#### リクエスト例

```bash
curl --location --request PUT 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功レスポンス

- ステータスコード: `204 No Content`
- Content-Type: `text/plain`
- レスポンスボディ: 空

---

### 3. GET /api データのみ取得する

**エンドポイント**: `GET /api`

**動作**: 読み取り専用で、どのカウンタも変更しません。現在の統計値を JSON で返します。バックオフィスやダッシュボードでの表示取得に適しています。

#### リクエストヘッダー

| ヘッダー | 型 | 必須 | 例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | いいえ | `https://www.example.com` |
| `Referer` | string | いいえ | `https://www.example.com` |
| `User-Agent` | string | いいえ | `Safari` |

#### リクエスト例

```bash
curl --location 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功レスポンス

- ステータスコード: `200 OK`
- Content-Type: `application/json`

```json
{
  "site_pv": 10086,
  "site_uv": 2333,
  "page_pv": 452,
  "page_uv": 128
}
```

フィールドの意味は `POST /api` と同じです。

---

### 4. GET /jsonp 旧版 jsonp 互換

**エンドポイント**: `GET /jsonp`

**動作**: カウンタを加算しつつ JSONP 形式でデータを返します。旧版 Busuanzi の導入方法との互換性を保つためのエンドポイントです。

#### Query パラメータ

| パラメータ | 型 | 必須 | 例 | 説明 |
| --- | --- | --- | --- | --- |
| `callback` | string | いいえ | `BszCallback` | JSONP コールバック関数名 |

#### リクエストヘッダー

| ヘッダー | 型 | 必須 | 例 |
| --- | --- | --- | --- |
| `Referer` | string | いいえ | `https://www.example.com` |
| `User-Agent` | string | いいえ | `Safari` |

#### リクエスト例

```bash
curl --location 'https://busuanzi.kipfel.link/jsonp?callback=BszCallback' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari'
```

#### 成功レスポンス

- ステータスコード: `200 OK`
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

### 5. OPTIONS /api CORS プリフライト

**エンドポイント**: `OPTIONS /api`

**動作**: ブラウザの CORS プリフライトに使用されます。通常は `204` を返し、許可された CORS レスポンスヘッダーを含みます。`Origin` がホワイトリストに含まれない場合は `403` を返します。

#### リクエストヘッダー

| ヘッダー | 型 | 必須 | 例 |
| --- | --- | --- | --- |
| `x-bsz-referer` | string | いいえ | `https://www.example.com` |
| `Referer` | string | いいえ | `https://www.example.com` |
| `User-Agent` | string | いいえ | `Safari` |
| `Origin` | string | いいえ | `www.example.com` |

#### リクエスト例

```bash
curl --location --request OPTIONS 'https://busuanzi.kipfel.link/api' \
--header 'x-bsz-referer: https://www.example.com' \
--header 'Referer: https://www.example.com' \
--header 'User-Agent: Safari' \
--header 'Origin: www.example.com'
```

#### 成功レスポンス

- ステータスコード: `204 No Content`
- Content-Type: `text/plain`
- レスポンスボディ: 空

---

## 集計方法の説明

- **page_pv（ページ閲覧数）**: アクセスごとに +1
- **page_uv / site_uv（訪問者数）**: ブラウザの `User-Agent` と IP を組み合わせてハッシュ化し判定します。初回アクセス後は、重複カウントを防ぐために署名付きキーを `localStorage` に保存してユーザーを恒久的に識別します

## データ移行とアップグレード

- 旧版 Busuanzi → セルフホスト版 Busuanzi: [`busuanzi-sync`](https://github.com/soxft/busuanzi-sync) を利用可能
- 2.7.x から 2.8.x へのアップグレード: データ構造の変更があるため、[`bsz-transfer`](https://github.com/soxft/busuanzi/tree/main/bsz-transfer) で移行してください
- どのバージョンから更新する場合でも、事前に Redis の `dump.rdb` をバックアップすることを推奨します

## プライバシーとセキュリティ

- Host、パス、IP、UA などの識別情報はすべてバックエンド側で **HASH** 化して保存され、平文は保持しません
- 新版は JSONP ではなく `POST` と `x-bsz-referer` ヘッダーを既定で使用します。互換性が高く、厳しい同一オリジン制約でも遮断されにくくなっています
- `BSZ_SECRET` は必ずランダムな文字列に変更してください。これはクライアント側の識別マークに署名し、UV の偽装を防ぐために使われます

## オープンソースリンク

- GitHub: <https://github.com/soxft/busuanzi>
- Gitee: <https://gitee.com/soxft/busuanzi>
- フロントエンド Demo / Dashboard: <https://github.com/soxft/busuanzi-frontend>
