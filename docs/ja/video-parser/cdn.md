---
outline: deep
description: "VRChat マップのホワイトリストに必要な CDN ドメインの完全なリスト：Bilibili・Kuaishou・Douyin のビデオ配信ノードとライブ配信ノード、音楽サービスのノード。"
---

# CDN ドメインリスト

このページには、VRChat の公開ルームでホワイトリストに追加する必要がある CDN ドメインがリストされています。

::: tip 注意
VRChat マップの URL リストは最大 100 個しかありません。必要に応じて追加してください。
:::

::: tip 提案
VRChat プレイヤーでは、インターフェースとして `api.kipfel.link` ドメインを使用することをお勧めします。
:::

## 解析 API

- `api.kipfel.link`

## Bilibili CDN

- `upos-sz-mirroraliov.bilivideo.com`
- `upos-sz-mirrorhw.bilivideo.com`
- `upos-sz-mirrorcos.bilivideo.com`
- `upos-hz-mirroraliov.bilivideo.com`
- `upos-hz-mirrorakam.akamaized.net`

## Bilibili ライブ CDN

- `d1--ov-gotcha207.bilivideo.com`
- `d1--ov-gotcha105.bilivideo.com`
- `d1--cn-gotcha104.bilivideo.com`

## Kuaishou CDN

- `txmov2.a.kwimgs.com`
- `ali2.a.yximgs.com`

## Douyin CDN

- `v5-dy-ov-experiment.zjcdn.com`
- `v27-cold.douyinvod.com`
- `v5-se-sjy-daily-cold.douyinvod.com`
- `pull-hs-f5.flive.douyincdn.com`
- `v3.douyinvod.com`

## AcFun CDN

- `tx-safety-video.acfun.cn`

## 音楽 CDN

- `music-api-qedge.kipfel.cloud`
- `music-api.kipfel.cloud`
- `music-api-ally.kipfel.cloud`
- `music-api-tx.kipfel.cloud`

## 完全なドメインリスト

以下は、ホワイトリストに追加する必要があるすべてのドメインの概要です。

```
api.kipfel.link
upos-sz-mirroraliov.bilivideo.com
upos-sz-mirrorhw.bilivideo.com
upos-sz-mirrorcos.bilivideo.com
upos-hz-mirroraliov.bilivideo.com
upos-hz-mirrorakam.akamaized.net
d1--ov-gotcha207.bilivideo.com
txmov2.a.kwimgs.com
ali2.a.yximgs.com
v5-dy-ov-experiment.zjcdn.com
v27-cold.douyinvod.com
v5-se-sjy-daily-cold.douyinvod.com
pull-hs-f5.flive.douyincdn.com
tx-safety-video.acfun.cn
v3.douyinvod.com
d1--ov-gotcha105.bilivideo.com
d1--cn-gotcha104.bilivideo.com
music-api-qedge.kipfel.cloud
music-api.kipfel.cloud
music-api-ally.kipfel.cloud
music-api-tx.kipfel.cloud
```

## VRChat マップへの追加方法

マップ作成者の場合、上記のドメインをマップのホワイトリストに追加する必要があります。

1. ホワイトリスト設定に上記のドメインを追加します。
2. URL リストは最大 100 個しかありませんので、必要に応じて選択してください。
3. 音楽リンクが必要な場合は、私にメールを送信してください。提供します。

## 解析サイトサポートの申請

当サイトの解析サポートを追加したい場合は、[admin@kipfel.link](mailto:admin@kipfel.link?subject=ドメイン解析リスト申請&body=こんにちは、私はxxxマップの作成者xxxです。当サイトの解析サポートを追加したいです。これは私のマップの招待リンクです：) にメールを送信し、あなたとあなたのマップに関する情報を含めてください。

## 関連ページ

- [ビデオ解析 API リファレンス](/ja/video-parser/api) —— エンドポイント、パラメータ、レスポンス項目
- [使用方法](/ja/video-parser/guide) —— 各エンドポイントの呼び出し方
- [よくある質問](/ja/video-parser/faq) —— マップのホワイトリストと再生トラブル
- [ドメイン割り当て](/ja/video-parser/domains) —— 各サブドメインの用途
