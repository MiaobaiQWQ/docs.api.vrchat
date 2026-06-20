---
outline: deep
---

# チュートリアル

このドキュメントでは、Kipfel 動画パースサービスの使用方法を詳しく説明します。

## 動画パース

### 基本的な使用方法

通常の動画パースにはメインインターフェースを使用します：

```
https://api.kipfel.link/v1/vrc?url=
```

::: tip ヒント
`url=` の後に動画リンクを貼り付けるだけで、追加の処理は必要ありません。
:::

### サポートされているリンク形式

以下のいずれかの形式を使用できます：

::: details 1. 完全なリンク
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BVxxxxx
```
:::

::: details 2. BV 番号
```
https://api.kipfel.link/v1/vrc?url=BVxxxxx
```
:::

::: details 3. パラメータ付きの完全なリンク
```
https://api.kipfel.link/v1/vrc?url=https://www.bilibili.com/video/BVxxxx/?spm_id_from=333.1007.tianma.1-1-1.click&vd_source=f7c54e4cff604fb7865caae2a39f8041
```
:::

::: details 4. 短縮リンク
```
https://api.kipfel.link/v1/vrc?url=https://b23.tv/xxxx
```
:::

## 音楽パース

音楽インターフェースを使用して音楽をパースし、プレイリストインデックスをサポートします。**YouTube Music リンクにはこのインターフェースを必ず使用してください。**

```
https://api.kipfel.link/v1/music?url=
```

::: warning 重要
YouTube Music リンクは `/v1/music` インターフェースを使用する必要があります。そうしないと正しくパースできません。
:::

### プレイリストの選択

プレイリストは 1 からカウントします。`&i=1` / `&i=2` を使用して N 曲目を選択します。末尾に `@1` / `@2` を追加することもサポートしています。

```
https://api.kipfel.link/v1/music?url=https://music.163.com/playlist?id=123456&i=1
```

## コレクションパース

`/v1/collection` は JS 形式のプレイリストを返し、Bilibili マルチパート、YouTube リストなどをサポートします。

```
https://api.kipfel.link/v1/collection?url=
```

## バックアップインターフェース

メインインターフェースが使用できない場合は、バックアップインターフェースを試すことができます：

::: info バックアップオプション
- 動画バックアップ：`https://api.kipfel.link/v1/kfc?url=`
- 音楽バックアップ：`https://api.kipfel.link/v1/musickfc?url=`
:::

## JSON モード

`json=1` パラメータを追加すると、302 リダイレクトの代わりにインターフェースが JSON 形式を返すようになります：

```
https://api.kipfel.link/v1/vrc?url=BVxxxxx&json=1
```

JSON レスポンス例：

```json
{
  "success": true,
  "url": "https://cdn.example.com/video.mp4"
}
```

## その他のヘルプ

その他の質問については、[FAQ](/ja/faq) ページを確認してください。
