---
outline: deep
description: "VRChat ビデオ解析 API のリファレンス：v1 のビデオ・音楽解析、v3 の弾幕・字幕・歌詞、v4 のマージインターフェース、プレイリスト解析とスロット中継のリクエスト先、パラメータ、エラーコード。"
---

# VRC ビデオ解析 API 呼び出しと制限ドキュメント

## プロジェクト概要

VRC ビデオ解析は、VRChat プレイヤー向けに設計された、無料かつ迅速なビデオおよびオーディオ解析サービスを提供する多ソースビデオ/オーディオ解析プロキシゲートウェイです。

## 基本情報

### インターフェースアドレス
```text
https://api.kipfel.link/
```

#### 別のドメイン（デプロイ内容が異なる）

```text
https://api.kipfel.vrchat.org.cn/
```

2 つのドメインは**同じデプロイではありません**。利用できるインターフェースが異なります（2026-10-09 実測）：

| インターフェース | `api.kipfel.link` | `api.kipfel.vrchat.org.cn` |
|---|---|---|
| `/v1/*`（ビデオ / 音楽解析） | ✅ | ✅ |
| `/v3/*`（弾幕 / 歌詞） | ✅ | ✅ |
| `/v4/vrc`（マージインターフェース） | ✅ | ✅ |
| `/v1/playlist`、`/v4/playlist`（プレイリスト） | ✅ | ❌（トップページの HTML を返す） |
| `/poll`、`/s/<n>`、`/p`（スロット中継） | ✅ | ✅ |

### User-Agent 要件
::: warning 注意
- 2 つの UA を送信する必要があります。1 つは `Unity xxxxxxxx` を含み、もう 1 つは `Unity xxxx` を含みません
:::

---

## v1 コア解析インターフェース

### ビデオ解析

**インターフェース**：`/v1/vrc?url={ビデオリンク}`  
**パラメータ**：
- `url` (必須)：ビデオリンク

**応答**：
- **成功**：直リンクアドレスへ 302 リダイレクト
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

フィールド説明：
- `code` (Number)：ビジネスステータスコード。`0` は成功を表します。
- `message` (String)：ビジネス応答メッセージ。通常は `"success"` です。
- `log_id` (String)：プラットフォームのログリクエスト ID（存在する場合）。
- `data.video_id` (String)：プラットフォーム内部の一意な項目 ID（Douyin の `aweme_id` / `item_id`、Kuaishou の `photo_id` など）。
- `data.avid` (String)：Bilibili 固有。AV 番号 ID（他のプラットフォームでは空文字列になる場合があります）。
- `data.bvid` (String)：Bilibili 固有。BV 番号（他のプラットフォームでは空文字列になる場合があります）。
- `data.title` (String)：ビデオまたはオーディオのタイトル。
- `data.desc` (String)：ビデオまたはオーディオの説明 / 概要。
- `data.duration` (Number)：メディアの合計時間。単位は秒。
- `data.cover` (String)：既定で表示されるカバー画像の直リンク。
- `data.create_time` (Number)：作品が公開されたタイムスタンプ（秒単位）。
- `data.update_time` (Number)：作品が更新されたタイムスタンプ（秒単位）。
- `data.status` (Number)：メディアのステータスコード。
- `data.category` (String)：作品のカテゴリ ID。
- `data.category_name` (String)：作品のカテゴリ名。
- `data.author.user_id` (String)：プラットフォーム内でのクリエイターの一意な UID / sec_uid。
- `data.author.nickname` (String)：クリエイターのニックネーム。
- `data.author.avatar` (String)：クリエイターのアバター画像の URL。
- `data.stat.play_count` (Number)：総再生回数。
- `data.stat.like` (Number)：総いいね数。
- `data.stat.comment` (Number)：総コメント数。
- `data.stat.share` (Number)：総シェア / 転載数。
- `data.stat.favorite` (Number)：総お気に入り数。
- `data.content.play_url` (String)：**コアデータ**：ウォーターマークなしのメディア再生直リンク。
- `data.content.cover_url` (String)：原画質のカバー画像直リンク。
- `data.content.hashtags` (Array)：抽出されたトピックタグの一覧。
- `data.content.mentions` (Array)：抽出された @ユーザー の一覧。
- `data.content.music_info` (Object)：関連する BGM 情報（原曲など）。

**失敗応答**：
```json
{
  "error": true,
  "status": 400,
  "code": "PARSE_ERROR",
  "message": "解析失败，请检查链接是否正确"
}
```

フィールド説明：
- `error` (boolean)：エラーが発生したかどうか
- `status` (number)：HTTP ステータスコード
- `code` (string)：エラーコード
- `message` (string)：エラーメッセージ

---

### 代替ビデオ解析インターフェース

**インターフェース**：`/v1/kfc?url={ビデオリンク}`  
**パラメータ**：`/v1/vrc` と同じ

**応答**：`/v1/vrc` と同じ

**JSON バージョン**：`/v1/kfc-json` - 応答形式は `/v1/vrc-json` と同じ

---

### 音楽解析

**インターフェース**：`/v1/music?url={音楽リンク}&i={インデックス}`  
**パラメータ**：
- `url` (必須)：音楽リンクまたはプレイリストリンク
- `i` (オプション)：プレイリストのインデックス（1 から開始）

**応答**：
- **成功**：直リンクアドレスへ 302 リダイレクト
- **失敗**：JSON 形式のエラー情報を返す

**JSON バージョン**：`/v1/music-json`

**JSON 応答形式**：`/v1/vrc-json` と同じ

---

### 代替音楽解析インターフェース

**インターフェース**：`/v1/musickfc?url={音楽リンク}&i={インデックス}`  
**パラメータ**：`/v1/music` と同じ

**応答**：`/v1/music` と同じ

**JSON バージョン**：`/v1/musickfc-json` - 応答形式は `/v1/music-json` と同じ

---

## v3 高度なインターフェース

v3 インターフェースは、弾幕や歌詞などのリッチなコンテンツを必要とするプレイヤー向けです。直リンクに加えて構造化 JSON データも返します。

### 弾幕インターフェース

**インターフェース**：`/v3/vrc-danmaku?url={ビデオリンク}`  
**パラメータ**：
- `url` (必須)：ビデオリンク
- `limit` (オプション)：弾幕数の上限。既定は 10000。**制限されるのは弾幕のみで、字幕には影響しません**
- `start_time` (オプション)：開始時間（秒）。この時点より後の内容だけを返します。`duration` と組み合わせて時間ウィンドウを構成します
- `duration` (オプション)：時間ウィンドウの長さ（秒）。`start_time` と一緒に渡す必要があります
- `ai_subtitle` (オプション)：Bilibili の字幕（AI 字幕 + UP主がアップロードした CC 字幕）を返すかどうか。`1` / `true` / `yes` / `on` で有効、`0` / `false` / `no` / `off` で無効。指定しない場合はサーバー側の既定値に従います（現在は既定で有効）
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

フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか（字幕が取得できなくても `true` のままで、`subtitles` が空配列になるだけです）
- `platform` (string)：プラットフォームの中国語名（例：`哔哩哔哩`）
- `video_id` (string)：ビデオ ID。Bilibili では BV 番号
- `title` (string)：ビデオのタイトル
- `has_more` (boolean)：`start_time` + `duration` でスライスした場合に、この後ろにまだ内容があるかどうか
- `danmaku` (array)：弾幕一覧
  - `danmaku[].t` (number)：弾幕の時間位置（秒）
  - `danmaku[].c` (string)：弾幕の内容
  - `danmaku[].ty` (number)：弾幕の種類（`1` スクロール、`4` 下部、`5` 上部など）
  - `danmaku[].co` (number)：弾幕の色。10 進 RGB（`16777215` = 白）
  - `danmaku[].fs` (number)：フォントサイズ
- `subtitles` (array)：字幕の**フラット配列**。すべての言語が混ざっており、ネストした辞書はありません。字幕がない場合は `[]`
  - `subtitles[].t` (number)：字幕の開始時間（秒）
  - `subtitles[].to` (number)：字幕の終了時間（秒）
  - `subtitles[].c` (string)：字幕テキスト（改行と前後の空白は除去済み）
  - `subtitles[].l` (string)：言語コード（`ai-zh`、`zh-CN`、`ja` など）
- `subtitle_langs` (array、オプション)：今回**実際に返された**言語コード。`subtitles[].l` に現れた値と一致します。字幕がない場合はこのフィールドは返されません
- `subtitle_locked` (boolean、オプション)：`true` は、そのビデオに字幕トラックが確かに存在するものの、サーバーにログイン状態の Cookie が設定されていないため本文を取得できないことを示します。「字幕を取得しようとしたが取得できなかった」場合にのみ現れます（明示的に `ai_subtitle=0` で無効にした場合は現れません）
- `subtitle_locked_langs` (array、オプション)：ログイン状態によって遮られた言語コード。`subtitle_locked` と一緒に現れます

::: tip 呼び出し例

```bash
# 既定：弾幕 + 利用可能なすべての言語の字幕
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6"

# 中国語の AI 字幕のみ
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=ai-zh"

# UP主がアップロードした中国語 / 英語の字幕のみ（ai- で始まる AI 字幕は除外）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&lang=zh-CN,zh-Hans,en-US"

# 字幕なし
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku?url=https://www.bilibili.com/video/BV1aAhm6vEA6&ai_subtitle=0"
```

:::

::: warning フィールドの順序
`title` などの小さなフィールドは**常に `danmaku` / `subtitles` という 2 つの大きな配列より前に並びます**。
Udon 側の一部の JSON パーサーは、レスポンスの先頭から数文字の範囲でしか key を探さないため、配列がフィールドを後ろに押し出すと読み取れなくなります。クライアントはこれらのフィールドが末尾に現れることを前提にしないでください。
:::

**その他のプラットフォーム（Douyin、Kuaishou など）** は同じ `danmaku` 配列を返しますが、`subtitles` / `subtitle_langs` などの字幕フィールドは含まれません。

**非 Unity Player：**
- **成功**：直リンクアドレスへ 302 リダイレクト
- **失敗**：JSON 形式のエラー情報を返す

---

### 歌詞インターフェース

**インターフェース**：`/v3/vrc-lyric?url={音楽リンク}`  
**パラメータ**：
- `url` (必須)：音楽リンク
- `size` / `cover_size` (オプション)：カバー画像のサイズ。**最長辺の上限**として扱われ、アスペクト比を保ち、元画像を拡大しません。2 つのパラメータ名は等価です（`size` が優先）。値は `64` / `128` / `256` / `512` / `1024` で、`max`（最大段階の 1024 と等価）も指定できます。それ以外の値は既定の段階として扱われます。指定しない場合、**NetEase Cloud Music は既定で 1024（最大画像）**、他のプラットフォームは既定で `64` です

::: tip カバー画像
- カバーは**base64 で埋め込んで**歌詞 JSON に含めて返され、画像のアドレスは別途提供されません。Udon 側でそのままデコードしてテクスチャにできます
- `size` / `cover_size` はこのインターフェース自身のパラメータで、音楽リンクの一部としては扱われません（`url` に同名のパラメータが含まれていても解析結果には影響しません）
- サーバーがカバーを取得できなかった場合（プラットフォームにカバーがない、画像のダウンロードに失敗したなど）は、`cover_base64` / `cover_size` はどちらも空文字列になり、エラーにはなりません
:::

**応答**：

**Unity Player（User-Agent に Unity を含む）：**

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

フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか（歌詞が取得できなくても `true` のままで、`lyrics` が空になるだけです）
- `data.platform` (string)：プラットフォームの中国語名（例：`网易云音乐`）
- `data.lyrics` (array)：原歌詞の一覧
  - `lyrics[].time` (number)：歌詞の時間位置。**単位はミリ秒（整数）**（NetEase Cloud Music / Kugou / QQ Music はいずれもミリ秒）
  - `lyrics[].text` (string)：歌詞の内容
- `data.tlyrics` (array)：翻訳歌詞の一覧（構造は `lyrics` と同じ）
- `data.song_name` (string、オプション)：楽曲名。プラットフォームが提供しない場合はこのフィールドは返されません
- `data.singer` (string、オプション)：歌手名
- `data.audio_id` (string、オプション)：プラットフォーム内部のオーディオ ID
- `data.album_id` (string、オプション)：アルバム ID
- `data.duration` (number、オプション)：楽曲の総再生時間。単位は秒
- `data.singer_id` (string、オプション)：歌手 ID
- `data.cover_base64` (string)：カバー画像の base64（**元の画像アドレスは返しません**）。カバーがない場合は空文字列 `""`
- `data.cover_size` (string)：**カバー自体**のサイズ（例：`"1024x1024"`）。カバーがない場合は空文字列
- `data.cover_w` / `data.cover_h` (number)：カバー（拡縮後）の幅と高さ。`cover_size` の 2 つの数値と等しい値です

::: tip 呼び出し例
```bash
# 既定の段階（NetEase Cloud Music = 1024 の最大画像）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230"

# サイズ指定 / 最大段階（2 つのパラメータ名は等価）
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&cover_size=512"
curl -A "Unity demo" "https://api.kipfel.link/v3/vrc-lyric?url=https://music.163.com/song?id=347230&size=max"
```

:::

**非 Unity Player：**
- **成功**：直リンクアドレスへ 302 リダイレクト
- **失敗**：JSON 形式のエラー情報を返す

---

## v4 マージインターフェース

v4 は v3 の 2 つのインターフェースを 1 つの入口にまとめ、リンクのプラットフォームに応じて**自動的に振り分け**ます：

| リンクの種類 | どの分岐に入るか |
|---|---|
| 音楽プラットフォーム（NetEase Cloud Music / Kugou / Migu / QQ Music / YouTube Music） | 歌詞分岐 |
| ビデオ / ライブ配信プラットフォーム（Bilibili / Douyin / Kuaishou / AcFun / YouTube / Twitter / Instagram） | 弾幕分岐 |
| プラットフォームを判別できない | 弾幕分岐として処理（`mode=lyric` で歌詞分岐に強制切替できます） |

**インターフェース**：`/v4/vrc?url={リンク}`

**パラメータ**：

| パラメータ | 説明 |
|---|---|
| `url` (必須) | ビデオ / 音楽 / プレイリストのリンク |
| `mode` | `auto`（既定、自動振り分け）/ `danmaku` は弾幕のみ / `lyric` は歌詞のみ / `both` は両方を取得（`merge=1` と同等） |
| `merge` | `1` でマージ構造を返します（下記参照）。既定は `0`、つまり「直接置換モード」 |
| `media` | `1` でレスポンスボディに最上位の `url` フィールド（再生可能な直リンク）を追加します。既定は `0` |
| `json` | `1` で非 Unity クライアントにも JSON を返します（既定では非 Unity は 302 で直リンクへ） |
| `limit` / `start_time` / `duration` / `ai_subtitle` / `subtitle_lang` / `lang` | 弾幕分岐のパラメータで、`/v3/vrc-danmaku` と完全に同一です |
| `size` / `cover_size` | 歌詞分岐のパラメータで、`/v3/vrc-lyric` と完全に同一です |
| `i` / `index` | 音楽プレイリストの何曲目を取得するか（1 から開始） |

### 直接置換モード（既定、`merge=0`）

動作は v3 と**フィールド単位で完全に一致**します。クライアントはアドレスを `/v3/vrc-lyric` または `/v3/vrc-danmaku` から `/v4/vrc` に置き換えるだけで、解析コードを 1 行も変更する必要がありません。

| クライアント | `/v4/vrc` の動作 |
|---|---|
| UA に `Unity` を含む | 対応する分岐の完全な JSON を返します（音楽 → `/v3/vrc-lyric` と同じ、ビデオ → `/v3/vrc-danmaku` と同じ） |
| その他の UA | 直リンクへ 302 リダイレクト |
| その他の UA + `json=1` | `{ "success": true, "url": "<直リンク>" }` を返します |

```bash
# 音楽（Unity は歌詞 JSON を取得。フィールドは /v3/vrc-lyric と一字一句同じ）
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"

# ビデオ（Unity は弾幕 JSON を取得）
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6&limit=2000"

# プレイヤー（非 Unity：302 で直リンクへ）
curl -I "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"

# 非 Unity でも JSON が欲しい場合
curl "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230&json=1"
```

### マージモード（`merge=1` または `mode=both`）

「直リンク + 弾幕 + 歌詞」を一度に取得します：

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

フィールド説明：
- `data.platform` (string)：プラットフォームの**識別子**（`netease` / `bilibili` / `douyin` …）。ここは中国語名ではない点に注意してください。歌詞 / 弾幕の子オブジェクト内の `platform` が中国語名です
- `data.kind` (string)：プラットフォームの種類。`music` / `video` / `live` / `unknown`
- `data.mode` (string)：今回実際に通った分岐。`lyric` / `danmaku` / `both`
- `data.url` (string)：再生可能な直リンク（解析に失敗した場合は空文字列）
- `data.is_direct_link` (boolean)：元のリンク自体が直リンクかどうか
- `data.danmaku` (object|null)：`/v3/vrc-danmaku` と**完全に同一**のレスポンスボディ。`mode` に弾幕が含まれない場合は `null`
- `data.lyric` (object|null)：`/v3/vrc-lyric` と**完全に同一**のレスポンスボディ。`mode` に歌詞が含まれない場合は `null`
- `data.errors` (object、オプション)：いずれかの子リクエストが失敗したときに現れます（例：`{"media":"...","danmaku":"..."}`）

::: tip マージモードの呼び出し例
```bash
# 直リンク + 歌詞 + カバー
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230&merge=1&size=512"

# 直リンク + 弾幕 + 字幕
curl -A "Unity demo" "https://api.kipfel.link/v4/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6&mode=both&limit=5000"
```

:::

---

## プレイリスト解析インターフェース

共有されたプレイリスト（NetEase Cloud Music の `/m/playlist?id=xxx&creatorId=...` のようなリンク）を JSON に解析し、各曲にタイトルと**そのまま再生できるゲートウェイリンク**を付けます。

**インターフェース**：`/v1/playlist?url={プレイリストリンク}` と `/v4/playlist?url={プレイリストリンク}`（同じルートで、2 つのアドレスは等価です）

**パラメータ**：

| パラメータ | 説明 |
|---|---|
| `url` (必須) | プレイリストリンク。`music.163.com/playlist?id=`、`/m/playlist?id=`、`#/playlist?id=`、ランキング `toplist?id=` に対応 |
| `base` | 内側の再生リンクを生成する際に使うゲートウェイのベースアドレス。指定しない場合はサーバー側の `PUBLIC_BASE_URL` を使い、それもなければ現在のリクエストのドメインにフォールバックします |
| `encode` | `1` で内側の楽曲リンクを URL エンコードします（既定ではエンコードしません） |
| `limit` / `offset` | プレイリストの一部だけを取得します（大きなプレイリストを分割して取得する場合に使用） |
| `raw` | `1` で解析ノードが返した生のプレイリストデータを追加で付与します |
| `nocache` | `1` でサーバー側のキャッシュをスキップし（既定のキャッシュは 5 日）、強制的に再解析します |

**応答**：

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

フィールド説明：
- `platform` (string)：プラットフォームの中国語名。`platform_key` (string)：プラットフォームの識別子（`netease`）
- `playlist.id` (string)：プレイリスト ID。`name` / `creator` / `creator_id`：プレイリストの情報
- `playlist.cover_url` (string)：プレイリストのカバー画像直リンク（サーバー側で最大画像パラメータ `?param=1024y1024` が付きます）
- `playlist.track_count` (number)：プレイリストの**総曲数**。`count`：今回返された曲数
- `playlist.returned` / `playlist.offset` (number、`limit` を使った場合のみ)：この区間の開始位置と長さ
- `playlist.cached` (boolean)：今回サーバー側のキャッシュにヒットしたかどうか
- `playlist.tracks[].index` (number)：**1 から始まる**連番（そのまま `/v1/music?i=` に渡せます）
- `playlist.tracks[].id` (string)：楽曲 ID。`title` と `name` は同じタイトルです（どちらの読み方にも対応）
- `playlist.tracks[].duration` (number)：長さ（秒）
- `playlist.tracks[].url` (string)：**そのまま再生できるゲートウェイリンク**。既定では `/v4/vrc` を指します（Unity クライアントは歌詞 JSON、プレイヤーは 302 の直リンクを取得）

::: tip キャッシュ
プレイリスト全体（すべての曲と生成済みのリンクを含む）はサーバー側で **5 日間**キャッシュされます（`PLAYLIST_CACHE_TTL`）。プレイリストの内容を変更してすぐ反映させたい場合は `nocache=1` を付けてください。
:::

**エラー**：
- `UNSUPPORTED_PLATFORM` (400)：このプラットフォームのプレイリストは現在サポートしていません（現時点では NetEase Cloud Music のみ対応）
- `PLAYLIST_NOT_FOUND` (404)：プレイリストが存在しない、またはアクセス権がありません（非公開プレイリストは解析ノードにログイン Cookie を設定する必要があります）
- `NO_NODES_AVAILABLE` (503)：現在利用可能な解析ノードがありません
- `PLAYLIST_ERROR` (502)：その他の解析失敗

---

## スロット中継インターフェース（VRChat ワールドでの楽曲リクエスト）

### 背景

VRChat の Udon は**実行時に `VRCUrl` を構築できません**。ワールド内のプレイヤーのアドレスは「ビルド時にワールドへ焼き込む」か「プレイヤーが手入力する」しかありません。そこでワールドには**楽曲データを一切含まない**空のアドレスを一批だけ焼き込み（ドメインを 1 つ焼き込んだのと等価です）、「n 番目のアドレスが今どの曲に対応するか」は**サーバー**が決めます：

```text
GET /poll          現在のプレイリストの曲一覧（クライアントはこれをもとにリストを描画）
GET /s/<n>         n 番目の項目が現在対応する実際の直リンク（302）。UA に Unity を含む場合は歌詞 JSON を返す
GET /p?u=<プレイリスト>    プレイヤー側でプレイリストを変更（トークン不要、冪等）
```

プレイリストの変更 = サーバー状態の変更です。クライアントは 1 行も変更する必要がなく、焼き直しもワールドの再アップロードも不要です。

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

- `mode` (string)：`slot`（スロット中継：`i` は 0 から始まる連番）または `idpool`（レコード id プール：`i` はレコード id）
- `count` (number)：今回のリストの長さ。`max` (number)：現在のモードでの上限（`slot` = 区画ごとの容量、`idpool` = プール容量）
- `songs[].i` (number)：**クライアントが使うインデックス** —— これを使って `/s/<i>` を組み立てて再生します
- `songs[].id` (string)：元プラットフォームでの楽曲 ID。`title` / `artist` / `album` / `duration`（秒）

### `GET /s/<n>`

- **UA に `Unity` を含む**：そのスロットの楽曲の**歌詞 JSON** を返します。構造は `/v3/vrc-lyric` と完全に一致します（ワールド内の歌詞コンポーネント用）
- **その他の UA**：そのスロットの楽曲の**実際の直リンク**へ 302 リダイレクトします（プレイヤー用。サーバー自身が解析するため、UA によって切り替わるプールアドレスへ 302 することはありません）

エラー：

| 状況 | HTTP | code |
|---|---|---|
| `n` が正しい整数でない / 上限を超えている | 400 | `BAD_SLOT` |
| そのスロットに現在曲がない | 404 | `SLOT_EMPTY` |
| 直リンクの解析に失敗 | 502 | `DIRECT_LINK_FAILED` |

### `GET /p?u={<プレイリストID>または<プレイリストリンク>}`

プレイヤー側でプレイリストを変更します。**トークン不要**です（ワールド内の入力欄にそのまま組み込めます）。レスポンスボディは `/poll` と**完全に同構造**で、クライアントは受け取った時点でそのままリストを更新できます。

- 生のプレイリスト ID にも対応します（`/p?u=3778678`）。サーバーが自動的に完全なリンクを組み立てます（VR ではコントローラーでの文字入力は短いほど良いため）
- **冪等**：リクエストしたプレイリストが現在と同じ場合、既存のリストをそのまま返し、再解析しません
- レート制限：IP ごとに 30 回 / 分
- サーバー側で `SLOT_PLAYER_LOAD=0` によりこの入口を無効にできます（無効化後は 404 `PLAYER_LOAD_DISABLED` を返します）

::: warning 副作用があります
`/p` は**そのインスタンスの現在のプレイリストを実際に置き換えます**（他のルーム / ワールドの `/poll` と `/s/<n>` もそれに伴って変わります）。デバッグ時は誤って触らないよう注意してください。
:::

::: tip 2 つのモードの違い
- **スロット中継**（`mode: "slot"`）：`/s/<n>` の `n` は**連番**で、サーバー側にグローバルなテーブルが 1 つあります → 複数のルーム / ワールドが**互いのプレイリストを上書きし合います**
- **レコード id プール**（`mode: "idpool"`）：`n` は**レコード id**（同じ曲は常に同じ id）で、サーバー側にセッション状態がありません → 複数のルームが互いに干渉せず、URL をそのまま共有できます。代わりに、クライアントが焼き込むアドレスプールのサイズをプール容量（`max`）に合わせる必要があります
:::

---

## 共通レスポンス形式

### エラー応答形式

すべてのインターフェースのエラー応答形式は以下のとおり統一されています：

```json
{
  "error": true,
  "status": 400,
  "code": "ERROR_CODE",
  "message": "错误描述信息"
}
```

よくあるエラーコード：

| code | HTTP | 説明 |
|---|---|---|
| `METHOD_NOT_ALLOWED` | 405 | 必要な url リクエストパラメータがありません |
| `IM_A_TEAPOT` | 418 | url パラメータが空です |
| `INVALID_URL` | 422 | 指定されたパラメータに有効な URL リンクが含まれていません |
| `FORBIDDEN_URL` | 403 | このリンクには安全でないターゲットアドレスが含まれており、システムによってブロックされています |
| `CONTENT_RESTRICTED` | 451 | 著作権またはコンプライアンス上の理由により、このコンテンツの解析は現在サポートされていません |
| `PARSE_ERROR` | 400 / 500 | 解析に失敗しました |
| `NO_NODES_AVAILABLE` | 503 | 現在利用可能な解析ノードがありません |
| `UNSUPPORTED_PLATFORM` | 400 | このプラットフォームのプレイリストの解析は現在サポートされていません |
| `PLAYLIST_NOT_FOUND` | 404 | プレイリストが存在しない、またはアクセス権がありません |
| `PLAYLIST_EMPTY` | 404 | プレイリストに再生可能な曲がありません |
| `PLAYLIST_ERROR` | 502 | プレイリストの解析に失敗しました |
| `MISSING_SOURCE` | 400 | プレイリスト変更時にプレイリストのアドレスがありません |
| `BAD_SLOT` | 400 | スロット番号が不正、または上限を超えています |
| `SLOT_EMPTY` | 404 | そのスロットに現在割り当てられた楽曲がありません |
| `DIRECT_LINK_FAILED` | 502 | スロットの直リンク解析に失敗しました |
| `SLOT_ERROR` | 502 | スロットのその他のエラー |
| `PLAYER_LOAD_DISABLED` | 404 | プレイヤー側のプレイリスト変更入口が無効になっています |
| `LOAD_FAILED` | 502 | プレイリストの読み込みに失敗しました |
| `RATE_LIMIT_EXCEEDED` | 429 | リクエストが多すぎます（例：`/p` は IP ごとに 30 回 / 分） |

::: tip 歌詞 / 弾幕インターフェースの「ソフト失敗」
`/v3/vrc-lyric`、`/v3/vrc-danmaku`、`/v4/vrc`（Unity 分岐）は、**解析で内容を取得できなくてもエラーになりません**。`success: true` を返したままで、配列が空になり、カバー画像のフィールドが空文字列になるだけです。クライアントはこのケースのために個別のエラーフォールバックを用意する必要はありません。
:::

---

## 制限されたコンテンツ

以下のプラットフォームのコンテンツは解析に対応していません：

- 腾讯视频 (Tencent Video)
- 爱奇艺 (iQiyi)
- 优酷 (Youku)
- 芒果TV (Mango TV)
- 哔哩哔哩番剧 (Bilibili Anime)
- 西瓜视频 (Xigua Video)
- 搜狐视频 (Sohu Video)

---

## 関連ページ

- [ビデオ解析の使い方](/ja/video-parser/guide) —— 各インターフェースの呼び出し方と対応するリンク形式
- [ビデオ解析のよくある質問](/ja/video-parser/faq) —— 再生失敗・解析異常の切り分け方法とエラーコード
- [CDN ドメインリスト](/ja/video-parser/cdn) —— VRChat マップのホワイトリストに追加する必要があるドメイン
