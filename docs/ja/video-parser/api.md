---
outline: deep
description: "VRChat ビデオ解析 API：v1 ビデオ・音楽、v3 弾幕・歌詞、v4 統合入口、カバー形式、プレイリスト、ワールドのスロットと JSON 応答。"
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

::: tip 対象バージョン
以下の呼び出しと JSON 構造は現在の Go ゲートウェイのワークスペース実装に基づきます。2 つのドメインは独立したデプロイで、両方への反映を示すものではありません。利用先のバージョンを確認してください。
:::

### User-Agent 要件
::: warning 注意
- v3 / v4 では歌詞・弾幕コンポーネントは `Unity` を含む UA、再生プレイヤーは含まない UA を使用します。**別々の 2 回のリクエスト**であり、1 回に 2 つの UA を送る意味ではありません。Unity 以外でも `json=1` で JSON を取得できます。
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
  "log_id": "req_example",
  "data": {
    "video_id": "BV17PTT6FEJJ",
    "avid": "",
    "bvid": "BV17PTT6FEJJ",
    "title": "视频标题内容",
    "desc": "视频的详细描述信息",
    "duration": 2136,
    "cover": "http://example.com/cover.jpg",
    "create_time": 1783075293,
    "update_time": 0,
    "status": 0,
    "category": "",
    "category_name": "",
    "author": {
      "user_id": "",
      "nickname": "作者昵称",
      "avatar": "http://example.com/avatar.jpg"
    },
    "stat": {
      "play_count": 36234,
      "like": 2089,
      "comment": 11,
      "share": 32,
      "favorite": 0
    },
    "content": {
      "play_url": "https://example.com/video_no_watermark.mp4",
      "cover_url": "http://example.com/cover.jpg",
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
- `log_id` (String)：ゲートウェイのリクエスト ID。
- `data.video_id` (String)：リンクから抽出した BV 番号。取得できなければリクエスト ID。
- `data.avid` (String)：入力の av リンクから抽出した AV 番号。それ以外は空文字列。
- `data.bvid` (String)：入力から抽出し大文字に変換した BV 番号。それ以外は空文字列。
- `data.title` (String)：ビデオまたはオーディオのタイトル。
- `data.desc` (String)：ビデオまたはオーディオの説明 / 概要。
- `data.duration` (Number)：メディアの合計時間。単位は秒。
- `data.cover` (String)：既定で表示されるカバー画像の直リンク。
- `data.create_time` (Number)：作品が公開されたタイムスタンプ（秒単位）。
- `data.update_time` (Number)：現在は 0。
- `data.status` (Number)：メディアのステータスコード。
- `data.category` (String)：現在は空文字列。
- `data.category_name` (String)：現在は空文字列。
- `data.author.user_id` (String)：現在は空文字列。
- `data.author.nickname` (String)：クリエイターのニックネーム。
- `data.author.avatar` (String)：クリエイターのアバター画像の URL。
- `data.stat.play_count` (Number)：総再生回数。
- `data.stat.like` (Number)：総いいね数。
- `data.stat.comment` (Number)：総コメント数。
- `data.stat.share` (Number)：総シェア / 転載数。
- `data.stat.favorite` (Number)：現在は 0。
- `data.content.play_url` (String)：**コアデータ**：ウォーターマークなしのメディア再生直リンク。
- `data.content.cover_url` (String)：`data.cover` と同じカバー URL。
- `data.content.hashtags` (Array)：現在は空配列。
- `data.content.mentions` (Array)：現在は空配列。
- `data.content.music_info` (Object)：現在は空オブジェクト。

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

::: tip 応答フィールド
v1 の `log_id` はゲートウェイのリクエスト ID。`video_id` は抽出した BV 番号、取得できなければリクエスト ID です。`avid` / `bvid` は入力からのみ抽出し、元の大文字小文字や AV / BV 変換は保証しません。`author.user_id` と分類は空、`favorite` は 0、ハッシュタグ・メンション・音楽情報は空の配列 / オブジェクトです。`-json`、`json=1`、`Accept: application/json` で JSON を選択できます。
:::

### 代替ビデオ解析インターフェース

**インターフェース**：`/v1/kfc?url={ビデオリンク}`  
**パラメータ**：`/v1/vrc` と同じ

**応答**：`/v1/vrc` と同じ

**JSON バージョン**：`/v1/kfc-json` - 応答形式は `/v1/vrc-json` と同じ

---

### 音楽解析

**インターフェース**：`/v1/music?url={音楽リンク}`\
**パラメータ**：`url` (必須)。各曲のリンクを使用し、プレイリストは先に下記の一覧インターフェースで取得してください。

**応答**：成功時は再生直リンクへ 302。`json=1` または `Accept: application/json` で `/v1/vrc-json` と同じ JSON を取得できます。

::: warning JSON アドレス
`/v1/music-json` は登録されていません。`/v1/music?url=...&json=1` を使用してください。`/v1/musickfc-json` は利用できます。`i` / `index` / `@N` による選曲は接続されていません。
:::

---

### 代替音楽解析インターフェース

**インターフェース**：`/v1/musickfc?url={音楽リンク}`\
**パラメータ**：`/v1/music` と同じ

**応答**：`/v1/music` と同じ

**JSON バージョン**：`/v1/musickfc-json` - 応答形式は `/v1/music?json=1` と同じ

---


## v3 高度なインターフェース

v3 は弾幕や歌詞を必要とするプレイヤー向けです。**UA に `Unity` または `unity` を含む場合、または `json=1` を指定した場合は JSON** を返し、それ以外のクライアントは成功時に直リンクへ 302 リダイレクトされます。

### 弾幕インターフェース

**インターフェース**：`/v3/vrc-danmaku?url={ビデオリンク}`  
**パラメータ**：`url` (必須)、`json=1` (任意、Unity 以外でも JSON を返す)。

**JSON 応答形式**：

```json
{
  "success": true,
  "data": {
    "platform": "bilibili",
    "comments": [
      {
        "t": 0.5,
        "c": "弾幕の内容",
        "ty": 1,
        "co": 16777215,
        "fs": 25
      }
    ]
  }
}
```


フィールド説明：
- `success` (boolean)：リクエストが成功したかどうか。Unity 分岐では解析失敗時も空の応答を返します。詳細は下記を参照してください。
- `data.platform` (string)：`bilibili`、`douyin` などのプラットフォーム識別子。表示名ではありません。
- `data.comments` (array)：弾幕一覧。弾幕がない場合は `[]`。
- `comments[].t` (number)：時刻、単位は秒。
- `comments[].c` (string)：弾幕の内容。
- `comments[].ty` (number)：種類。`1` はスクロール、`4` は下部、`5` は上部など。
- `comments[].co` (number)：10 進数の RGB 色。`16777215` = 白。
- `comments[].fs` (number)：フォントサイズ。

::: warning 注意
現在のインターフェースはトップレベルの `danmaku`、`subtitles`、`subtitle_langs`、`has_more` を返しません。旧版の `limit`、`start_time`、`duration`、`ai_subtitle`、`lang` / `subtitle_lang` パラメータも接続されていません。クライアントでは `data.comments` を読み取ってください。
:::

### 歌詞インターフェース

**インターフェース**：`/v3/vrc-lyric?url={音楽リンク}`  
**パラメータ**：`url` (必須)、`json=1` (任意)。

**JSON 応答形式**（既定の Base64 モード、カバーを取得できなかった場合）：

```json
{
  "success": true,
  "data": {
    "platform": "netease",
    "lyrics": [
      {
        "time": 18.466,
        "text": "歌詞"
      }
    ],
    "tlyrics": [],
    "song_name": "曲名",
    "singer": "歌手名",
    "audio_id": "",
    "album_id": "",
    "duration": 326,
    "singer_id": "",
    "cover_mode": "base64",
    "cover_encoding": "jpeg",
    "cover_origin": "top-left",
    "cover_width": 0,
    "cover_height": 0,
    "cover_palette": [],
    "cover_pixels": "",
    "cover_size": "",
    "cover_base64": ""
  }
}
```


フィールド説明：
- `data.platform` (string)：`netease`、`kugou`、`qqmusic` などの識別子。
- `data.lyrics` / `data.tlyrics` (array)：原文 / 翻訳歌詞。各項目は `{ "time": 18.466, "text": "歌詞" }`。**時刻の単位は秒で、小数を含むことがあります**。歌詞がない場合は空配列です。
- `data.song_name` / `data.singer` (string)：曲名 / 歌手。
- `data.duration` (number)：全体の長さ、単位は秒。
- `data.audio_id` / `data.album_id` / `data.singer_id` (string)：現在の互換応答では空文字列です。

::: tip カバー画像
カバーモードはサーバー側の管理画面で設定します。`cover_mode` / `cover_encoding` を確認して読み取ってください：
- `base64`（既定）：`cover_encoding: "jpeg"`。`cover_base64` を使用します。変換成功時は `cover_size: "128x128"`。
- `palette`：`cover_encoding: "palette64"`。`cover_width`、`cover_height`、`cover_palette`、`cover_pixels` を使用します。成功時は 128×128、64 色、`cover_origin: "top-left"`。ピクセルは左から右、上から下の順で、各文字の `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_` 内の位置がパレット番号です。色は 10 進数の RGB。**ピクセル文字列は画像の Base64 ではありません**。
- `url`：`cover_encoding: "url"`。`cover_url` から画像をダウンロードします。

基本構造のパレット項目は他のモードでも空のまま残ります。カバーがない場合はサイズが 0、配列 / 文字列が空になりますが、歌詞の取得は失敗しません。旧版の `size` / `cover_size` リクエストパラメータは無効で、`cover_w` / `cover_h` も返しません。
:::

```bash
curl -G -A "Unity demo" "https://api.kipfel.link/v3/vrc-danmaku" --data-urlencode "url=https://www.bilibili.com/video/BV1aAhm6vEA6"
curl -G "https://api.kipfel.link/v3/vrc-lyric" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "json=1"
```

---

## v4 マージインターフェース

v4 はビデオと音楽を 1 つの入口にまとめ、既定ではリンクから弾幕または歌詞を自動選択します。

**インターフェース**：`/v4/vrc?url={リンク}`。`/v4/url` も同じ処理の別名です。

| パラメータ | 説明 |
|---|---|
| `url` (必須) | ビデオ / 音楽リンク。リストは下記のプレイリストインターフェースを使用 |
| `mode` | 既定は `auto`。`lyric` / `music` で歌詞構造、それ以外は弾幕構造。自動モードでは音楽に歌詞を返す |
| `json` | `1` で Unity 以外にも分岐の完全な JSON を返す |
| `media` | `1` で成功した JSON のトップレベルに再生直リンク `url` を追加 |
| `world` | ワールド番号。ビデオのパート / コレクション番号の割り当てには作成済みで有効なワールドが必要 |

::: warning マージ構造
現在の実装は `merge=1` を処理せず、`mode=both` でも歌詞と弾幕を合成しません。応答は対応する v3 分岐の構造です。Unity 以外で `json=1` を付けた場合も、`success` / `url` だけではなく完全な分岐 JSON を返します。v3 / v4 では `Accept` / `format` は JSON の判定に使いません。
:::

### 呼び出し例

```bash
curl -G -A "Unity demo" "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "media=1"
curl -G "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://www.bilibili.com/video/BV1aAhm6vEA6?p=2" --data-urlencode "json=1" --data-urlencode "world=demo"
curl -I "https://api.kipfel.link/v4/vrc?url=https://music.163.com/song?id=347230"
```


### ビデオのパートとコレクション

v4 のビデオ JSON にはトップレベルの `playback` が追加されます。基本項目は `source`、`title`、`author`、`duration`、`bvid`、`cid`、`page`、`hasParts`、`hasCollection`。Bilibili ではパートとコレクション情報も取得します。

- `currentId` (number、任意)：現在のビデオ / パートのビデオプール番号。`/sell/{currentId}?world={ワールド番号}` で再生します。
- `list` (object、任意)：現在のビデオのパート一覧。下記のビデオプールと同じ構造です。
- `collection` (object、任意)：コレクション一覧。`collectionError` は取得失敗時のコードです。
- `error` (string、任意)：`WORLD_REQUIRED`、`WORLD_UNAVAILABLE`、`INVALID_WORLD`、`PART_POOL_UNAVAILABLE`、`PART_METADATA_ERROR` など。追加情報や番号割り当ての未完了を示し、弾幕 JSON 自体の失敗とは限りません。

パート / コレクションを使う場合は `world` を指定してください。ここでの番号割り当ては **`/p` で手動ロードした一覧を置き換えません**。

---

## プレイリスト解析インターフェース

**インターフェース**：`/v1/playlist?url={プレイリストリンク}` または `/v4/playlist?url={プレイリストリンク}`。常に JSON を返します。

NetEase のプレイリストは次の互換構造を返します。Bilibili のパート / コレクションには `/p` を使用し、この互換インターフェースからビデオ一覧を読み取らないでください。

```json
{
  "success": true,
  "platform": "网易云音乐",
  "platform_key": "netease",
  "playlist": {
    "id": "https://music.163.com/playlist?id=3778678",
    "name": "プレイリスト名",
    "creator": "",
    "creator_id": "",
    "cover_url": "",
    "track_count": 1,
    "count": 1,
    "tracks": [
      {
        "index": 1,
        "id": "347230",
        "title": "曲名",
        "name": "曲名",
        "artists": "歌手名",
        "album": "アルバム名",
        "duration": 326,
        "url": "https://api.kipfel.link/v4/vrc?url=https%3A%2F%2Fmusic.163.com%2Fsong%3Fid%3D347230"
      }
    ]
  }
}
```


- `platform_key` (string)：プラットフォーム識別子。`platform` は互換表示名。
- `playlist.id` (string)：現在は元の URL。`name` はプレイリスト名。
- `playlist.track_count` / `playlist.count` (number)：総曲数 / 今回返された曲数。
- `playlist.tracks[].index` (number)：1 から始まる一覧順。**ワールドのスロット番号ではありません**。
- `tracks[].id` / `title` / `name` / `artists` / `album` / `duration`：曲 ID、タイトル、タイトル別名、歌手、アルバム、長さ（秒）。
- `tracks[].url` (string)：各曲の `/v4/vrc?url=...`。UA に応じて歌詞 JSON または 302 を返します。
- `creator`、`creator_id`、`cover_url` は現在空文字列です。

キャッシュ期間はサーバーの解析設定で管理し、この入口に `nocache=1` は接続されていません。選曲には各曲のリンクを使用してください。旧版の `i` / `index` / `@N` による選曲も接続されていません。

---

## スロット中継インターフェース（VRChat ワールドでの楽曲リクエスト）

### 背景

VRChat の Udon は実行時に `VRCUrl` を生成できません。ワールドに固定アドレスを事前登録し、サーバーが番号に対応する曲やビデオを割り当てます。

::: warning ワールド番号
以下のインターフェースには `world` を必ず 1 回指定してください。1–64 文字の英数字とアンダースコアのみで、重複パラメータやパーセントエンコードは受け付けません。管理者によるワールドの作成と有効化が必要です。自動作成はしません。
:::

### `GET /poll?world={ワールド番号}`

`/slots` は別名です。既定は音楽プールで、`pool=video` でビデオプールを読み取ります。`/pocl?world=...` はビデオプール専用です。

```json
{
  "type": "music_playlist",
  "pool": "music",
  "world": "demo",
  "max": 100000,
  "ok": true,
  "name": "プレイリスト名",
  "source": "https://music.163.com/playlist?id=3778678",
  "platform": "netease",
  "updatedAt": "2026-10-30T08:00:00Z",
  "mode": "idpool",
  "songs": [
    {
      "i": 0,
      "id": "347230",
      "title": "曲名",
      "artist": "歌手名",
      "album": "アルバム名",
      "duration": 326,
      "songUrl": "https://music.163.com/song?id=347230"
    }
  ],
  "total": 1
}
```


- `mode` は常に `idpool`。`world` はワールド番号、`max` はプール容量。
- `total` は現在の一覧件数。`updatedAt` は RFC 3339 の文字列で、ミリ秒タイムスタンプではありません。`count` は返しません。
- 音楽は `songs` を使用します。`i` はサーバーが割り当てた記録番号で、連番とは限りません。一覧順からアドレスを組み立てないでください。
- ビデオは `items`（空の場合は省略されることがあります）を使用し、`bvid`、`cid`、`page` を含みます。複数パートには `parts` が付き、`playableTotal` は再生可能件数、`collectionId` はコレクション ID（存在する場合）です。基本構造の `songs` も出力されますが、ビデオ一覧は `items` を読み取ってください。
- 共通項目は `id`、`title`、`artist`、`album`、`duration`、`songUrl`。パートも同じ構造で、長さの単位は秒です。
- `type` は `music_playlist`、`bilibili_parts`、`bilibili_collection`。`pool` は `music` または `video`。

### `GET /s/{n}?world={ワールド番号}`

- **UA に Unity を含む（大文字小文字を区別しない）、または `json=1`**：該当記録の歌詞 JSON を返します。
- **それ以外**：再生直リンクへ 302 リダイレクトします。
- ビデオは `/sell/{n}?world=...` を使用し、常に再生リダイレクトを返します。テキスト情報は `/video-info/{n}?world=...` で取得でき、`{ "success": true, "playback": { ... } }` を返します。

### `GET /p?world={ワールド番号}&u={プレイリストIDまたはリンク}`

トークン不要で一覧をロードし、`/poll` と同種の構造を返します。`url` は `u` の代わりに使用でき、数字のみの場合は NetEase のプレイリスト ID として扱います。NetEase のプレイリスト、Bilibili のパート / コレクションに対応しています。

任意の `scope`：`auto`（既定）、`parts`、`collection`。Bilibili の一覧範囲を指定します。

```bash
curl -G "https://api.kipfel.link/p" --data-urlencode "world=demo" --data-urlencode "u=3778678"
curl "https://api.kipfel.link/poll?world=demo"
curl "https://api.kipfel.link/pocl?world=demo"
curl -G "https://api.kipfel.link/p" --data-urlencode "world=demo" --data-urlencode "u=https://www.bilibili.com/video/BV1aAhm6vEA6" --data-urlencode "scope=parts"
curl -I "https://api.kipfel.link/s/0?world=demo"
curl "https://api.kipfel.link/video-info/0?world=demo"
```


::: warning 副作用があります
`/p` は**同じ world、同じプール**の現在の一覧を置き換えます。同一ワールドの部屋は一覧を共有し、別ワールドと音楽 / ビデオプールは独立しています。番号は保護期間中保持されますが、満杯になると期限切れ記録が再利用されます。記録番号を永久の曲 ID として扱わないでください。
:::

---

## 解析プレビューインターフェース

**インターフェース**：`GET /preview?url={リンク}&mode=auto`。単一メディアは UA による再生リダイレクトをせず JSON を返します。NetEase のプレイリストは `/v4/playlist` へ 302。`mode` は `auto`、`video`、`music`、それ以外は `auto` として処理します。

**JSON 応答例**：

```json
{
  "success": true,
  "requestId": "req_example",
  "platform": {
    "key": "netease",
    "label": "网易云音乐",
    "kind": "music",
    "active": true,
    "color": "#e60026"
  },
  "kind": "music",
  "mediaUrl": "https://example.com/audio.mp3",
  "mediaType": "audio",
  "degraded": false,
  "meta": {
    "title": "曲名",
    "author": "歌手名",
    "durationSeconds": 326,
    "stats": {
      "views": 0,
      "likes": 0,
      "comments": 0,
      "shares": 0
    }
  },
  "lyric": {
    "count": 1,
    "lines": [
      {
        "time": 18.466,
        "text": "歌詞"
      }
    ]
  },
  "timings": {
    "totalMs": 120,
    "mediaMs": 100
  },
  "cached": false
}
```

`requestId` はゲートウェイのリクエスト ID、`platform` はプラットフォーム情報オブジェクトです。`mediaUrl` / `mediaType` は再生 URL / 種類、`meta.durationSeconds` は秒です。`lyric.lines` と任意の `lyric.translated` も秒を使用します。`danmaku.count` / `danmaku.preview` は件数 / プレビューで、全弾幕は v3 / v4 を使用してください。`timings` はミリ秒、`cached` は解析キャッシュの利用を示します。任意の `subtitles` は `{ "from": 0, "to": 1.5, "text": "字幕" }`（秒）、任意の `collection` は `title` と `items`（`title` / `url`）を含みます。空の場合は省略されることがあります。失敗時は `success: false` と `error.code` / `error.message` を確認し、任意の `redirectUrl` は運用ルールの転送先です。この構造は v1 / v3 / v4 と異なるため、項目を混用しないでください。

---

## 共通レスポンス形式

### エラー応答形式

旧版 v1 / v3 / v4 のパラメータ検証と通常の再生解析エラーは次の構造です：

```json
{
  "error": true,
  "status": 400,
  "code": "PARSE_ERROR",
  "message": "链接解析失败，请检查链接是否正确"
}
```


`/p`、`/poll`、`/slots`、`/pocl`、`/s/{n}`、`/sell/{n}`、`/video-info/{n}` の業務エラーは `error`、`code`、`message` と任意の `details` を返し、**`status` フィールドはありません**。HTTP ステータスは応答自体から取得してください。

| code | HTTP | 説明 |
|---|---|---|
| `METHOD_NOT_ALLOWED` | 405 | url パラメータなし |
| `IM_A_TEAPOT` | 418 | url が空 |
| `INVALID_URL / UNSUPPORTED_PLATFORM` | 422 | 無効な URL / 未対応プラットフォーム |
| `CONTENT_RESTRICTED` | 451 | 制限対象コンテンツ |
| `PARSE_ERROR` | 400 / 403 | 再生 / Unity 以外の JSON 解析失敗。ルール拒否は 403 |
| `INVALID_WORLD / INVALID_POOL` | 400 | ワールド番号またはプール指定が無効 |
| `INVALID_INPUT / INVALID_LIST_SCOPE` | 400 | 一覧の入力なし、または scope が無効 |
| `UNSUPPORTED_PLAYLIST` | 400 | 未対応プラットフォームの一覧 |
| `WORLD_OR_SLOT_NOT_FOUND` | 404 | ワールドまたは記録が存在しない |
| `WORLD_DISABLED` | 403 | ワールド無効 |
| `SLOT_POOL_FULL` | 409 | プール満杯、残りの記録は保護期間内 |
| `SLOT_MEDIA_ERROR` | 502 | 記録の再生直リンク解析失敗 |

::: tip 歌詞 / 弾幕インターフェースの「ソフト失敗」
パラメータ検証後、v3 / v4 の Unity 分岐は解析に失敗しても HTTP 200、`success: true` の空応答を返します。弾幕は `data.platform: "generic"`、`data.comments: []`、歌詞は `generic` と空の歌詞 / カバー項目です。空応答には `cover_mode` がない場合があります。パラメータ不足や無効な URL などの検証エラーは通常どおり返します。

v1 の JSON 分岐では解析失敗時に `{ "code": -1, "message": "...", "log_id": "req_...", "data": {} }` を返します。通常は HTTP 200、ルールによる拒否は 403 です。HTTP ステータスだけで成功を判定しないでください。
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
