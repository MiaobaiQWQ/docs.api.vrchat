---
outline: deep
---

# VRC ビデオ解析 API 呼び出しと制限ドキュメント

## プロジェクト概要

VRC ビデオ解析は、VRChat プレイヤー向けに設計された、無料かつ迅速なビデオおよびオーディオ解析サービスを提供する多ソースビデオ/オーディオ解析プロキシゲートウェイです。

## 基本情報

### インターフェースアドレス

```text
メインサイト：https://api.kipfel.link/
```

#### v1 と v3 インターフェースのみ

```text
https://api.kipfel.vrchat.org.cn/
```

### v1 コア解析インターフェース

#### ビデオ解析

**インターフェース**：`/v1/vrc?url={ビデオリンク}`  
**パラメータ**：
- `url` (必須)：ビデオリンク

**応答**：
- **成功**：直リンクアドレスに 302 リダイレクト
- **失敗**：JSON 形式のエラー情報を返す

**JSON バージョン**：`/v1/vrc-json` - 常に JSON を返す

**JSON 応答形式**：

**成功応答**：
```json
{
  "success": true,
  "url": "https://example.com/parsed-video-url.mp4"
}
```

フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか
- `url` (string)：解析後の直リンクアドレス

**失敗応答**：
```json
{
  "error": true,
  "status": 400,
  "code": "PARSE_ERROR",
  "message": "解析に失敗しました。リンクが正しいか確認してください"
}
```

フィールド説明：
- `error` (boolean)：エラーが発生したかどうか
- `status` (number)：HTTP ステータスコード
- `code` (string)：エラーコード
- `message` (string)：エラーメッセージ

---

#### 代替ビデオ解析インターフェース

**インターフェース**：`/v1/kfc?url={ビデオリンク}`  
**パラメータ**：`/v1/vrc` と同じ

**応答**：`/v1/vrc` と同じ

**JSON バージョン**：`/v1/kfc-json` - 応答形式は `/v1/vrc-json` と同じ

---

#### 音楽解析

**インターフェース**：`/v1/music?url={音楽リンク}&i={インデックス}`  
**パラメータ**：
- `url` (必須)：音楽リンクまたはプレイリストリンク
- `i` (オプション)：プレイリストインデックス（1 から開始）

**応答**：
- **成功**：302 リダイレクト到直リンクアドレス
- **失敗**：JSON 形式のエラー情報を返す

**JSON バージョン**：`/v1/music-json`

**JSON 応答形式**：`/v1/vrc-json` と同じ

---

#### 代替音楽解析インターフェース

**インターフェース**：`/v1/musickfc?url={音楽リンク}&i={インデックス}`  
**パラメータ**：`/v1/music` と同じ

**応答**：`/v1/music` と同じ

**JSON バージョン**：`/v1/musickfc-json` - 応答形式は `/v1/music-json` と同じ

---

### v3 高度なインターフェース

### User-Agent 要件
::: warning 注意
- `Unity xxxxxxxx` を含むものと含まないものの 2 つの User-Agent を送信する必要があります。
- `Unity xxxxxxxx` を含む User-Agent を送信して、弾幕/歌詞を取得できます。
- `Unity xxxxxxxx` を含まない User-Agent を送信して、ビデオ直リンク/楽曲直リンクを取得できます。
:::
### 推奨事項
::: tip ヒント
- 各マップで異なる User-Agent を使用して、ブロックを防ぎ、リクエスト元を確認することをお勧めします。
- 例えば、私はあるマップの作者ですが、`Unity xiaokong` のように名前を付けることをお勧めします。または、弾幕/歌詞を返さない場合は、規則に従って名前の先頭が `Unity ` でなければなりません。もう一つは自由に名前を付けてください。
:::

#### 弾幕インターフェース

**インターフェース**：`/v3/vrc-danmaku?url={ビデオリンク}`  
**パラメータ**：
- `url` (必須)：ビデオリンク
- `limit` (オプション)：弾幕数制限、デフォルト 10000

**応答**：

**Unity Player（User-Agent に Unity を含む）：**

```json
{
  "success": true,
  "data": {
    "platform": "bilibili",
    "comments": [
      {
        "time": 10.5,
        "text": "弾幕内容",
        "user": "ユーザー名",
        "color": "FFFFFF"
      }
    ]
  }
}
```

フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか
- `data.platform` (string)：プラットフォーム識別子
- `data.comments` (array)：弾幕リスト
  - `comments[].time` (number)：弾幕時間点（秒）
  - `comments[].text` (string)：弾幕内容
  - `comments[].user` (string)：ユーザー識別子
  - `comments[].color` (string)：弾幕色（16 進数）

**非 Unity Player：**
- **成功**：302 リダイレクト到直リンクアドレス
- **失敗**：JSON 形式のエラー情報を返す

---

#### 歌詞インターフェース

**インターフェース**：`/v3/vrc-lyric?url={音楽リンク}`  
**パラメータ**：
- `url` (必須)：音楽リンク

**応答**：

**Unity Player（User-Agent に Unity を含む）：**

```json
{
  "success": true,
  "data": {
    "platform": "netease",
    "lyrics": [
      {
        "time": 0.0,
        "text": "歌詞内容"
      }
    ],
    "tlyrics": [
      {
        "time": 0.0,
        "text": "翻訳歌詞内容"
      }
    ]
  }
}
```

フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか
- `data.platform` (string)：プラットフォーム識別子
- `data.lyrics` (array)：元の歌詞リスト
  - `lyrics[].time` (number)：歌詞時間点（秒）
  - `lyrics[].text` (string)：歌詞内容
- `data.tlyrics` (array)：翻訳歌詞リスト
  - `tlyrics[].time` (number)：歌詞時間点（秒）
  - `tlyrics[].text` (string)：翻訳歌詞内容

**非 Unity Player：**
- **成功**：302 リダイレクト到直リンクアドレス
- **失敗**：JSON 形式のエラー情報を返す

---

## 一般的な応答形式

### エラー応答形式

すべてのインターフェースのエラー応答形式は以下のように統一されています：

```json
{
  "error": true,
  "status": 400,
  "code": "ERROR_CODE",
  "message": "エラー説明メッセージ"
}
```

一般的なエラーコード：
- `METHOD_NOT_ALLOWED` (405)：必要な url リクエストパラメータがありません
- `IM_A_TEAPOT` (418)：url パラメータが空です
- `INVALID_URL` (422)：提供されたパラメータに有効な URL リンクが含まれていません
- `FORBIDDEN_URL` (403)：このリンクには安全でないターゲットアドレスが含まれており、システムによってブロックされています
- `CONTENT_RESTRICTED` (451)：著作権またはコンプライアンス上の理由により、このコンテンツの解析は一時的にサポートされていません
- `PARSE_ERROR` (500)：解析失敗
- `NO_NODES_AVAILABLE` (503)：現在利用可能な解析ノードがありません

---

## アクセス頻度制限

### cloudflare と aliyun esa の制限頻度

| 制限タイプ | ウィンドウサイズ | 制限回数 | 凍結時間 |
|---------|---------|---------|---------|
| すべてのインターフェース | 10 秒 | 20 回 | 15 秒 |

#### Nginx 制限

| 制限タイプ | ウィンドウサイズ | 制限回数 | 凍結時間 |
|---------|---------|---------|---------|
| 一部のインターフェース | 10 秒 | 20 回 | 15 秒 |

### レート制限 (下位層)

| 制限タイプ | ウィンドウサイズ | 制限回数 |
|---------|---------|---------|
| v1 と v3 のすべてのインターフェース | 1 分 | 50 回 |

**制限を超えた場合の応答**：
```json
{
  "error": "API rate limit exceeded",
  "message": "解析頻度が高すぎます。少し待ってから再試行してください。",
  "code": "API_LIMIT_EXCEEDED"
}
```

### 404 凍結

| 制限タイプ | ウィンドウサイズ | 制限回数 | 凍結時間 |
|---------|---------|---------|---------|
| すべてのインターフェース | 1 分 | 3 回 | 5 分 |

::: warning 注意
- 通常のアクセスでは 404 エラーは発生しません。私のウェブサイトの API をクラックしようとしている場合を除きます。
- 制限は回数が増えるにつれて凍結時間が増加し、最大で 24 時間凍結されます。
:::

---

## 制限されたコンテンツ

以下のプラットフォームのコンテンツは現在解析をサポートしていません：

- 腾讯视频 (Tencent Video)
- 爱奇艺 (iQiyi)
- 优酷 (Youku)
- 芒果TV (Mango TV)
- 哔哩哔哩番剧 (Bilibili Anime)
- 西瓜视频 (Xigua Video)
- 搜狐视频 (Sohu Video)

---
