---
outline: deep
---

# API ドキュメント

このドキュメントは `api.kipfel.link` が提供する HTTP API について説明します。

- ベースパス: `/v1`, `/v2`
- リクエストメソッド: 特に記載がない限り `GET`
- レスポンス形式:
  - パース系インターフェースはデフォルトで実際のメディアURLへの `302` リダイレクトを返します
  - `json=1`、`json=true` を指定するか `Accept: application/json` ヘッダーを使用すると JSON を返します
- コンテンツタイプ:
  - JSON インターフェース: `application/json`
  - 画像プロキシ: 上流の画像タイプをそのまま渡します
  - 背景画像: 静的リソースURLへの `302` を返します

サーバー側で統合する場合は、エラー処理と結果をより安定的に扱える JSON モードを使用することをおすすめします。

## 基本情報

### Base URL

```text
メイン: https://api.kipfel.link/
V1 のみ: https://api.kipfel.vrchat.org.cn/
```

### ドメインの説明

| ドメイン | 説明 |
| --- | --- |
| `https://api.kipfel.link/` | メインサイト、`v1` とその他の公開インターフェースをサポート |
| `https://api.kipfel.vrchat.org.cn/` | `v1` API のみサポート、`v2` およびその他の追加インターフェースはサポートされていません |

### 共通リクエストヘッダー

```http
Accept: application/json
```

### 共通クエリパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | string | ほとんどのパースインターフェースで必須 | パースする元のURL、共有テキストと混在可能、サーバーが自動的に実URLを抽出します |
| `json` | string | いいえ | `1` または `true` を指定すると 302 リダイレクトの代わりに JSON を強制的に返します |
| `real_ip` | string | いいえ | クライアントの実パブリックIP、より正確な地域ノード選択に使用します |
| `type` | string | いいえ | パースタイプを指定、一般的な値: `video`、`music`、`live`、`playlist`、`collection` |
| `i` | number | いいえ | 音楽プレイリストまたはマルチリソースシナリオのインデックス、1から始める方が安全です |

### レスポンス規約

#### 1. JSONモードで成功した場合

```json
{
  "success": true,
  "url": "https://cdn.example.com/media.mp4"
}
```

#### 2. デフォルトモードで成功した場合

サーバーは以下を返します:

```http
302 Found
Location: https://cdn.example.com/media.mp4
```

#### 3. エラー

```json
{
  "error": true,
  "status": 422,
  "code": "INVALID_URL",
  "message": "提供されたパラメータに有効なURLが含まれていません"
}
```

## セキュリティと制限

### レート制限

| 範囲 | 制限 |
| --- | --- |
| サイト全体 | 1IPあたり15分で最大150リクエスト |
| `/v1`, `/v2` API | 1IPあたり1分で最大50リクエスト |

制限がトリガーされた場合は通常 `429 Too Many Requests` を返します。

### IPブロック機構

不正なコンテンツを再生したIPはブロックされます。IPがブロックされた場合やご質問がある場合は、以下にお問い合わせください：
- **Admin**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **運用**: 海落QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)

### 302リダイレクト制限

非動画プラットフォームおよびホワイトリスト外のアドレスへの302リダイレクトを削除しました。サポートされている動画プラットフォームのリンクのみがパースおよびリダイレクトされます。

### 著作権とコンプライアンスの制限

以下のソースは直接ブロックされ `451` を返します:

- 腾讯视频
- 爱奇艺
- 优酷
- 芒果TV
- 哔哩哔哩番剧
- 西瓜视频
- 搜狐视频

### サポートされているプラットフォーム

| プラットフォーム | タイプ | 説明 |
| --- | --- | --- |
| 哔哩哔哩 | `video` / `live` | 通常の動画、ライブ配信、短縮リンク、一部直リンクをサポート |
| 抖音 | `video` / `live` | 短縮リンクの展開をサポート |
| 快手 | `video` / `live` | 動画とライブ配信をサポート |
| AcFun | `video` | 動画パースをサポート |
| 网易云音乐 | `music` / `playlist` | シングルとプレイリストの詳細をサポート |
| 酷狗音乐 | `music` | 音声パースをサポート |
| 咪咕音乐 | `music` | 音声パースをサポート |
| YouTube | `video` / `music` | YouTube と YouTube Music をサポート |
| X / Twitter | `video` | 公開動画リンクをサポート |
| Instagram | `video` | 公開動画リンクをサポート |

## V1 パースインターフェース

### `GET /v1/vrc`

メインの動画パースインターフェース。ショートビデオ、通常の動画、一部のライブ配信リンクに適しています。

#### クエリパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | string | はい | 動画またはライブ配信の共有リンク |
| `json` | string | いいえ | `1` または `true` の場合 JSON を返します |
| `type` | string | いいえ | パースタイプを手動で指定、デフォルトは自動検出、フォールバックは `video` |
| `real_ip` | string | いいえ | クライアントの実パブリックIP |

#### リクエスト例

```bash
curl "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1xx411c7mD&json=1"
```

#### 成功レスポンス

```json
{
  "success": true,
  "url": "https://cdn.example.com/video.mp4"
}
```

#### メモ

- `b23.tv`、`v.douyin.com`、`youtu.be` などの短縮リンクを自動的に展開
- ライブ配信リンクを自動的に検出してライブパースロジックに切り替え
- 対象が既にサポートされているプラットフォームのメディア直リンクの場合は元のURLを直接返します

### `GET /v1/music`

メインの音楽パースインターフェース。シングル、一部プレイリスト内の曲に適しています。

#### クエリパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | string | はい | 音楽リンク |
| `i` | number | いいえ | プレイリストのトラックインデックス |
| `json` | string | いいえ | `1` または `true` の場合 JSON を返します |
| `type` | string | いいえ | デフォルトは自動検出、フォールバックは `music` |
| `real_ip` | string | いいえ | クライアントの実パブリックIP |

#### リクエスト例

```bash
curl "https://api.kipfel.link/v1/music?url=https%3A%2F%2Fmusic.163.com%2Fsong%3Fid%3D19013859097&json=1"
```

#### 成功レスポンス

```json
{
  "success": true,
  "url": "https://cdn.example.com/audio.mp3"
}
```

#### メモ

- 网易云の `song`、`playlist` リンク形式と自動的に互換性あり
- プレイリストのパースに失敗した場合はシングルパースロジックにフォールバックします
- `i` が指定された場合は対応するインデックスのトラックを優先的にパースします

### `GET /v1/kfc`

バックアップの動画パースインターフェース。WebRTC 位置特定ロジックに依存せず、互換性のフォールバックエントリとして適しています。

#### クエリパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | string | はい | 対象リンク |
| `json` | string | いいえ | `1` または `true` の場合 JSON を返します |
| `type` | string | いいえ | タイプを手動で指定可能 |
| `i` | number | いいえ | 特定のリソースインデックス |
| `real_ip` | string | いいえ | クライアントの実パブリックIP |

#### レスポンスメモ

- `type=playlist` の場合、直リンクリダイレクトの代わりにプレイリスト詳細 JSON を返します
- その他のシナリオは `/v1/vrc` と基本的に同じです

### `GET /v1/musickfc`

バックアップの音楽パースインターフェース、動作は `/v1/music` と似ています。

#### クエリパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | string | はい | 音楽リンク |
| `i` | number | いいえ | トラックインデックス |
| `json` | string | いいえ | `1` または `true` の場合 JSON を返します |
| `type` | string | いいえ | デフォルトは自動検出、フォールバックは `music` |
| `real_ip` | string | いいえ | クライアントの実パブリックIP |

### `GET /v1/collection`

動画コレクションをパースして、サブアイテムのリストを返します。

#### クエリパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | string | はい | コレクションページリンク |
| `format` | string | いいえ | `js` の場合 JavaScript 配列テキストを返し、それ以外は JSON を返します |
| `real_ip` | string | いいえ | クライアントの実パブリックIP |

#### JSONレスポンス例

```json
{
  "title": "コレクションタイトル",
  "items": [
    {
      "title": "第1話",
      "url": "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fexample.com%2Fitem-1"
    }
  ]
}
```

#### JavaScriptレスポンス例

```javascript
[
  {
    title: "第1話",
    url: "https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fexample.com%2Fitem-1"
  }
]
```

#### メモ

- 現在 `video` タイプとして識別可能なプラットフォームコレクションのみサポート
- 返される `items[].url` は既に当サイトの `/v1/vrc` 呼び出し可能なアドレスに変換されています

### `GET /v1/playlist-detail`

网易云プレイリストの詳細を取得します。

#### クエリパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | string | はい | 网易云プレイリストリンク |
| `real_ip` | string | いいえ | クライアントの実パブリックIP |

#### レスポンスメモ

このインターフェースはパースノードから返されるプレイリスト詳細を直接透過します。一般的な構造は次のようになります:

```json
{
  "title": "プレイリストタイトル",
  "tracks": [
    {
      "index": 1,
      "title": "曲名",
      "artist": "アーティスト",
      "url": "https://cdn.example.com/audio.mp3"
    }
  ]
}
```

#### 制限

- 网易云プレイリストのみサポート
- 非网易云リンクは `422` を返します

## V2 補助インターフェース

メモ: 以下の `v2` インターフェースは `https://api.kipfel.link/` 経由でのみアクセス可能で、`https://api.kipfel.vrchat.org.cn/` はサポートされていません。

### `GET /v2/background/:type/:timestamp?`

ランダム背景画像リダイレクトインターフェース。

#### パスパラメータ

| パラメータ | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `type` | string | はい | `mobile` は縦画面、それ以外は横画面として扱います |
| `timestamp` | string | いいえ | フロントエンドの強制リフレッシュに使用可能、ビジネスロジックには関与しません |

#### レスポンスメモ

- 成功時は `302` を返し、`/assets/background/...` または `/assets/pin/...` にリダイレクト
- 使用可能な画像が見つからない場合は `404` を返します

## 一般的なエラーコード

| HTTP ステータス | ビジネスコード | 説明 |
| --- | --- | --- |
| `403` | 固定コードなし | 非サポートプラットフォームリンクがリダイレクトで拒否されました |
| `405` | `METHOD_NOT_ALLOWED` | `url` パラメータキーがありません |
| `418` | `IM_A_TEAPOT` | `url` パラメータが空文字列です |
| `422` | `INVALID_URL` | 入力から有効なURLを抽出できませんでした |
| `422` | `MISSING_PARAMETER` | 必須パラメータがありません |
| `422` | `UNSUPPORTED_PLATFORM` | 現在のプラットフォームまたはリンクタイプはサポートされていません |
| `451` | `CONTENT_RESTRICTED` | 著作権またはコンプライアンスの理由でサポートされていません |
| `500` | `PARSE_ERROR` | 一般的なパース失敗 |
| `500` | `COLLECTION_PARSE_ERROR` | コレクションのパースに失敗しました |
| `500` | `PLAYLIST_ERROR` | プレイリスト詳細の取得に失敗しました |
| `503` | `NO_NODES_AVAILABLE` | 使用可能なパースノードがありません |
| `504` | `PARSE_ERROR` | 上流のパースノードがタイムアウトまたは接続を拒否しました |
| `429` | `API_LIMIT_EXCEEDED` | APIリクエストが多すぎます |
