---
outline: deep
description: "api.kipfel.link のビデオ解析サービスの使い方：/v1/vrc、/v1/music、代替エンドポイントの呼び出しと、完全な URL・BV 番号・パラメータ付き URL・短縮 URL の利用方法。"
---

# 使用方法

このドキュメントでは、Kipfel ビデオ解析サービスの使用方法を詳しく説明します。

## ビデオ解析

ビデオ解析にはメインエンドポイント `/v1/vrc` を使用します。解析したいビデオリンクを `url=` の直後に付けるだけで、ブラウザで開くと透かしなしの直リンクへ 302 リダイレクトされます。

### 基本的な使用方法

メインインターフェースを使用して通常のビデオ解析を行います。

```
https://api.kipfel.link/v1/vrc?url=
```

::: tip ヒント
通常のリンクは `url=` の後に追加できます。`&`、`#`、パート指定を含むリンクは先に URL エンコードしてください。プログラムからは `--data-urlencode` を使用するとパラメータの欠落を防げます。
:::

### サポートされているリンク形式

以下のいずれかの形式を使用できます。

::: details 1. 完全なリンク
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BV1aAhm6vEA6
```
:::

::: details 2. BV 番号
```
https://api.kipfel.link/v1/vrc?url=BV1aAhm6vEA6
```
:::

::: details 3. パラメータ付きの完全なリンク
```
https://api.kipfel.link/v1/vrc?url=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1aAhm6vEA6%3Fp%3D2
```
:::

::: details 4. 短縮リンク
```
https://api.kipfel.link/v1/vrc?url=https://b23.tv/xxxx
```
:::

## 音楽解析

`/v1/music?url={音楽リンク}` で各曲を解析し、成功時は再生直リンクへ 302 リダイレクトします。現在のネイティブ解析器は NetEase、Kugou、QQ Music、Kuwo、Qishui に対応しています。

::: tip プレイリストの選曲
`/v4/playlist?url={NetEaseプレイリストリンク}` の `tracks[].url` を使用するか、`/p?world={ワールド番号}&u={プレイリストID}` でロードし、返された `songs[].i` を使って `/s/{i}?world={ワールド番号}` で再生してください。`i` / `index` / `@N` による選曲は接続されていません。
:::

::: warning 注意
現在のワークスペースには YouTube、YouTube Music、Migu のネイティブ解析器が接続されていません。音楽インターフェースへの切り替えでは復旧しません。
:::

## 代替インターフェース

以下の代替アドレスは現在メインと同じ処理を使用します。既存アドレスの互換性は保ちますが、独立した経路は保証しません。

::: info 代替オプション
- ビデオ代替: `https://api.kipfel.link/v1/kfc?url=`
- 音楽代替: `https://api.kipfel.link/v1/musickfc?url=`
:::

## JSON・歌詞・弾幕

再生直リンクには通常のプレイヤー UA を使用し、歌詞 / 弾幕には `Unity` を含む UA、または `json=1` を使用します。別々のリクエストであり、1 回に 2 つの UA を送る意味ではありません。

```bash
curl -G "https://api.kipfel.link/v1/music" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "json=1"
curl -G -A "Unity demo" "https://api.kipfel.link/v4/vrc" --data-urlencode "url=https://music.163.com/song?id=347230" --data-urlencode "media=1"
```

v1 JSON は `code` / `data.content.play_url` を使用します。v3 / v4 の弾幕は `data.comments`、歌詞は `data.lyrics`（時刻は秒）、カバーは `cover_mode` / `cover_encoding` に従って取得してください。詳細は [API ドキュメント](/ja/video-parser/api) を参照してください。

## ワールドのスロットとビデオのパート

有効なワールド番号を使用して、`/s/{n}?world={ワールド番号}`（音楽）と `/sell/{n}?world={ワールド番号}`（ビデオ）をワールドに事前登録します。音楽は `/poll?world=...`、ビデオは `/pocl?world=...`、一覧のロードは `/p?world=...&u={リンク}`。Bilibili は `scope=parts` / `scope=collection` に対応し、返された `i` を使います。

## その他のヘルプ

その他の質問については、[よくある質問](/ja/video-parser/faq) ページをご覧ください。

## 関連ページ

- [ビデオ解析 API リファレンス](/ja/video-parser/api) —— エンドポイント、パラメータ、レスポンス項目
- [よくある質問](/ja/video-parser/faq) —— 再生・解析トラブルの切り分け
- [CDN ドメインリスト](/ja/video-parser/cdn) —— VRChat マップのホワイトリストに追加するドメイン
