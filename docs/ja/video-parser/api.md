---
outline: deep
description: "VRChat ビデオ解析 API のリファレンス：v1 のビデオ・音楽解析（JSON 版含む）、v3 の弾幕・歌詞（Bilibili の AI 字幕とカバー画像を含む）、パラメータ、レスポンス項目、エラーコード。"
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
#### 弾幕インターフェース

**インターフェース**：`/v3/vrc-danmaku?url={ビデオリンク}`  
**パラメータ**：
- `url` (必須)：ビデオリンク
- `limit` (オプション)：弾幕数制限、デフォルト 10000；**制限されるのは弾幕のみで、字幕には影響しません**
- `start_time` (オプション)：開始時間（秒）。この時点以降の内容だけを返します。`duration` と組み合わせて時間ウィンドウを構成します
- `duration` (オプション)：時間ウィンドウの長さ（秒）。`start_time` と一緒に送信する必要があります
- `ai_subtitle` (オプション)：Bilibili の字幕（AI 字幕 + UP主がアップロードした CC 字幕）を返すかどうか。`1` / `true` / `yes` / `on` で有効、`0` / `false` / `no` / `off` で無効。指定しない場合はサーバー側のデフォルト値に従います（現在はデフォルトで有効）
- `lang` (オプション)：字幕の言語フィルタ。カンマ区切り（例：`ai-zh,zh-CN,ja`）。`*` または空の値ですべての利用可能な言語を返します。`subtitle_lang` と書くこともできます

::: tip 字幕（Bilibili）
- 字幕が有効なのは **Bilibili** のみで、他のプラットフォームでは `ai_subtitle` / `lang` は自動的に無視されます
- AI 字幕（`ai-zh`、`ai-ja` …）と UP主がアップロードした CC 字幕（`zh`、`zh-CN`、`zh-Hans` …）はまとめて返され、各項目の `l` で区別します
- 言語コードは大文字と小文字を区別せず、主要言語のプレフィックス一致にも対応しています（`zh` を渡すと `zh-CN` にも一致します）
- 特定の 1 言語だけが必要な場合は、全量を取得してから自分で絞り込むよりも `lang=` でサーバー側にフィルタさせる方が通信量を節約できます
- `start_time` + `duration` の時間ウィンドウフィルタは、弾幕と字幕にそれぞれ適用されます
:::

**応答**：

**Unity Player（User-Agent に Unity を含む）、Bilibili を例に：**

```json
{
  "success": true,
  "platform": "哔哩哔哩",
  "video_id": "BV1aAhm6vEA6",
  "title": "ビデオのタイトル",
  "has_more": false,
  "danmaku": [
    {
      "t": 0.5,
      "c": "弾幕内容",
      "ty": 1,
      "co": 16777215,
      "fs": 25
    }
  ],
  "subtitles": [
    {
      "t": 0.04,
      "to": 1.72,
      "c": "字幕テキスト",
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

フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか（字幕が取得できなくても `true` のままで、`subtitles` が空配列になるだけです）
- `platform` (string)：プラットフォームの中国語名（例：`哔哩哔哩`）
- `video_id` (string)：ビデオ ID。Bilibili では BV 番号
- `title` (string)：ビデオのタイトル
- `has_more` (boolean)：`start_time` + `duration` で分割した場合に、この後ろにまだ内容があるかどうか
- `danmaku` (array)：弾幕リスト
  - `danmaku[].t` (number)：弾幕の時間点（秒）
  - `danmaku[].c` (string)：弾幕内容
  - `danmaku[].ty` (number)：弾幕の種類（`1` スクロール、`4` 下部、`5` 上部など）
  - `danmaku[].co` (number)：弾幕の色、10 進数 RGB（`16777215` = 白）
  - `danmaku[].fs` (number)：フォントサイズ
- `subtitles` (array)：字幕の**フラット配列**。すべての言語が混ざっており、ネストした辞書はありません。字幕がない場合は `[]`
  - `subtitles[].t` (number)：字幕の開始時間（秒）
  - `subtitles[].to` (number)：字幕の終了時間（秒）
  - `subtitles[].c` (string)：字幕テキスト（改行と前後の空白は除去済み）
  - `subtitles[].l` (string)：言語コード（`ai-zh`、`zh-CN`、`ja` など）
- `subtitle_langs` (array、オプション)：今回**実際に返された**言語コード。`subtitles[].l` に現れた値と一致します。字幕がない場合はこのフィールドは返されません
- `subtitle_locked` (boolean、オプション)：`true` は、そのビデオに字幕トラックが確かに存在するものの、サーバーにログイン状態 Cookie が設定されていないため本文を取得できないことを示します。「字幕を取得しようとしたが取れなかった」場合にのみ現れます（`ai_subtitle=0` で明示的に無効にした場合は現れません）
- `subtitle_locked_langs` (array、オプション)：ログイン状態によって遮られた言語コード。`subtitle_locked` と一緒に現れます

::: tip 呼び出し例

```bash
# デフォルト：弾幕 + 利用可能なすべての言語の字幕
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6"

# 中国語の AI 字幕のみ
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=ai-zh"

# UP主がアップロードした中国語/英語の字幕のみ（ai- で始まる AI 字幕は除外）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=zh-CN,zh-Hans,en-US"

# 字幕なし
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&ai_subtitle=0"
```

:::

::: warning フィールドの順序
`title` などの小さなフィールドは**常に `danmaku` / `subtitles` という 2 つの大きな配列より前に並びます**。
Udon 側の一部の JSON パーサーはレスポンスの先頭から数文字の範囲でしか key を探さないため、配列がフィールドを後ろに押し出すと読み取れなくなります。クライアント側はこれらのフィールドが末尾に現れることを前提にしないでください。
:::

**その他のプラットフォーム（Douyin、Kuaishou など）** は同じ `danmaku` 配列を返しますが、`subtitles` / `subtitle_langs` などの字幕フィールドは含まれません。

**非 Unity Player：**
- **成功**：302 リダイレクト到直リンクアドレス
- **失敗**：JSON 形式のエラー情報を返す

---

#### 歌詞インターフェース

**インターフェース**：`/v3/vrc-lyric?url={音楽リンク}`  
**パラメータ**：
- `url` (必須)：音楽リンク
- `size` / `cover_size` (オプション)：返されるカバー画像の解像度。`64` または `128` のみ対応、省略時は `128`。2 つのパラメータ名は同等です（`size` が優先）。それ以外の**数値**は `128` として扱われます

::: tip カバー画像
- カバーは歌詞 JSON に **base64 で埋め込んで**返され、画像のアドレスは別途提供されません。Udon 側でそのままデコードしてテクスチャにできます
- `size` / `cover_size` はこのインターフェース自身のパラメータで、音楽リンクの一部としては扱われません（`url` に同名のパラメータが含まれていても解析結果には影響しません）
- サーバーがカバーを取得できなかった場合（プラットフォームにカバーがない、画像のダウンロードに失敗したなど）は、両方のフィールドが空文字列になり、エラーにはなりません
:::

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
    ],
    "song_name": "와",
    "singer": "李贞贤",
    "audio_id": "25645594",
    "album_id": "2264131",
    "duration": 212,
    "singer_id": "125616",
    "cover_base64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQ...",
    "cover_size": "128x128"
  }
}
```

フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか（歌詞が取得できなくても `true` のままで、`lyrics` が空になるだけです）
- `data.platform` (string)：プラットフォーム識別子
- `data.lyrics` (array)：元の歌詞リスト
  - `lyrics[].time` (number)：歌詞時間点（秒）
  - `lyrics[].text` (string)：歌詞内容
- `data.tlyrics` (array)：翻訳歌詞リスト
  - `tlyrics[].time` (number)：歌詞時間点（秒）
  - `tlyrics[].text` (string)：翻訳歌詞内容
- `data.song_name` (string、オプション)：楽曲名。プラットフォームが提供しない場合はこのフィールド自体が返されません
- `data.singer` (string、オプション)：歌手名
- `data.audio_id` (string、オプション)：プラットフォーム内部のオーディオ ID
- `data.album_id` (string、オプション)：アルバム ID
- `data.duration` (number、オプション)：楽曲の総再生時間（秒）
- `data.singer_id` (string、オプション)：歌手 ID
- `data.cover_base64` (string)：アルバムのカバー画像。正方形に圧縮したうえで base64 エンコードされています（**元の画像アドレスは返されません**）。カバーがない場合は空文字列 `""`
- `data.cover_size` (string)：カバーの実際のサイズ。値は `"64x64"` または `"128x128"`。カバーがない場合は空文字列 `""`

::: tip 呼び出し例
```bash
# デフォルトの 128×128 カバー
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230"

# 64×64 カバー（2 つのパラメータ名は同等）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&size=64"
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&cover_size=64"
```

:::

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
