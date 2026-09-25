---
outline: deep
description: "VRChat ビデオ解析 API のリファレンス：v1 のビデオ・音楽解析（JSON 版含む）、v3 の弾幕・歌詞、パラメータ、レスポンス項目、エラーコード。"
---

# VRC ビデオ解析 API 呼び出しと制限ドキュメント

## プロジェクト概要

VRC ビデオ解析は、VRChat プレイヤー向けに設計された、無料かつ迅速なビデオおよびオーディオ解析サービスを提供する多ソースビデオ/オーディオ解析プロキシゲートウェイです。

## 基本情報

### インターフェースアドレス

```text
https://api.kipfel.link/
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
  "code": 0,
  "message": "success",
  "log_id": "",
  "data": {
    "video_id": "7636287742653074728",
    "avid": "116855574365910",
    "bvid": "BV17PTt6fEJJ",
    "title": "ビデオのタイトル内容",
    "desc": "ビデオの詳細な説明情報",
    "duration": 2136,
    "cover": "http://example.com/cover.jpg",
    "create_time": 1783075293,
    "update_time": 0,
    "status": 0,
    "category": "130",
    "category_name": "音楽",
    "author": {
      "user_id": "1035330202",
      "nickname": "作者のニックネーム",
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

フィールド説明：
- `code` (Number)：ビジネスステータスコード、`0` は成功を示します。
- `message` (String)：ビジネス応答メッセージ、通常は `"success"` です。
- `log_id` (String)：プラットフォームのログリクエストID（ある場合）。
- `data.video_id` (String)：プラットフォーム内部の固有プロジェクトID（Douyinの `aweme_id` / `item_id`、Kuaishouの `photo_id` など）。
- `data.avid` (String)：Bilibili特有、AV番号ID（他のプラットフォームは空の文字列になる場合があります）。
- `data.bvid` (String)：Bilibili特有、BV番号（他のプラットフォームは空の文字列になる場合があります）。
- `data.title` (String)：ビデオまたはオーディオのタイトル。
- `data.desc` (String)：ビデオまたはオーディオの説明/概要。
- `data.duration` (Number)：メディアの合計時間、単位：秒。
- `data.cover` (String)：デフォルトで表示されるカバー画像の直リンク。
- `data.create_time` (Number)：作品が公開されたタイムスタンプ（秒単位）。
- `data.update_time` (Number)：作品が更新されたタイムスタンプ（秒単位）。
- `data.status` (Number)：メディアステータスコード。
- `data.category` (String)：作品カテゴリID。
- `data.category_name` (String)：作品カテゴリ名。
- `data.author.user_id` (String)：プラットフォーム内のクリエイターの固有 UID / sec_uid。
- `data.author.nickname` (String)：クリエイターのニックネーム。
- `data.author.avatar` (String)：クリエイターのアバター画像の URL。
- `data.stat.play_count` (Number)：総再生回数。
- `data.stat.like` (Number)：総いいね数。
- `data.stat.comment` (Number)：総コメント数。
- `data.stat.share` (Number)：総シェア/転送数。
- `data.stat.favorite` (Number)：総お気に入り数。
- `data.content.play_url` (String)：**コアデータ**：ウォーターマークなしのメディア再生直リンク。
- `data.content.cover_url` (String)：元の品質のカバー直リンク。
- `data.content.hashtags` (Array)：抽出されたハッシュタグのリスト。
- `data.content.mentions` (Array)：抽出された @ユーザー のリスト。
- `data.content.music_info` (Object)：関連するバックグラウンドミュージック情報（オリジナルサウンドなど）。

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

v3 インターフェースは弾幕や歌詞などのリッチなコンテンツを必要とするプレイヤー向けで、直リンクに加えて構造化 JSON データも返します。

#### User-Agent 要件
::: warning 注意
- `Unity xxxxxxxx` を含むものと含まないものの 2 つの User-Agent を送信する必要があります。
- `Unity xxxxxxxx` を含む User-Agent を送信して、弾幕/歌詞を取得できます。
- `Unity xxxxxxxx` を含まない User-Agent を送信して、ビデオ直リンク/楽曲直リンクを取得できます。
:::
#### 推奨事項
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

::: warning 注意
- アクセス頻度は動的に調整され、絶対的なレート制限を示すものではありません。
:::

## アクセス頻度制限

### cloudflare と aliyun esa の制限頻度

| 制限タイプ | ウィンドウサイズ | 制限回数 | 凍結時間 |
|---------|---------|---------|---------|
| すべてのインターフェース | 10 秒 | 20 回 | 15 秒 |

### Nginx 制限

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
- 私はあなたのリクエストを監視します。
:::

---

## 制限されたコンテンツ

以下のプラットフォームのコンテンツは解析をサポートしていません：

- 腾讯视频 (Tencent Video)
- 爱奇艺 (iQiyi)
- 优酷 (Youku)
- 芒果TV (Mango TV)
- 哔哩哔哩番剧 (Bilibili Anime)
- 西瓜视频 (Xigua Video)
- 搜狐视频 (Sohu Video)

---

## 関連ページ

- [使用方法](/ja/video-parser/guide) —— 各エンドポイントの呼び出し方と対応するリンク形式
- [よくある質問](/ja/video-parser/faq) —— 再生・解析トラブルの切り分けとエラーコード
- [CDN ドメインリスト](/ja/video-parser/cdn) —— VRChat マップのホワイトリストに追加するドメイン
- [Busuanzi API リファレンス](/ja/busuanzi/api) —— 同じプロジェクトが提供するアクセス解析 API
