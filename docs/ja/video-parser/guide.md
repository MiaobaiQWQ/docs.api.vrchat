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
`url=` の後にビデオリンクを直接貼り付けるだけで、追加の処理は不要です。
:::

### サポートされているリンク形式

以下のいずれかの形式を使用できます。

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

## 音楽解析

音楽インターフェースを使用して音楽を解析します。プレイリストのインデックスをサポートしています。**YouTube Music のリンクは必ずこのインターフェースを使用してください。**

```
https://api.kipfel.link/v1/music?url=
```

::: warning 重要
YouTube Music のリンクは、`/v1/music` インターフェースを使用しないと正常に解析できません。
:::

## 代替インターフェース

メインインターフェースが利用できない場合（経路障害やレート制限など）は、同じ動作を別経路で提供する以下の代替エンドポイントをお試しください。

::: info 代替オプション
- ビデオ代替: `https://api.kipfel.link/v1/kfc?url=`
- 音楽代替: `https://api.kipfel.link/v1/musickfc?url=`
:::

## その他のヘルプ

その他の質問については、[よくある質問](/ja/video-parser/faq) ページをご覧ください。

## 関連ページ

- [ビデオ解析 API リファレンス](/ja/video-parser/api) —— エンドポイント、パラメータ、レスポンス項目、レート制限
- [よくある質問](/ja/video-parser/faq) —— 再生・解析トラブルの切り分け
- [CDN ドメインリスト](/ja/video-parser/cdn) —— VRChat マップのホワイトリストに追加するドメイン
