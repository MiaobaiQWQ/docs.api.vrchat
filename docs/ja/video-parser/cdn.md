---
outline: deep
---

# CDN ドメインリスト

このページでは、VRChat パブリックワールドのホワイトリストに追加する必要がある CDN ドメインをリストします。

::: tip 注意
VRChatワールドはURLlistを最大100エントリに制限しています。必要に応じて追加してください。
:::

::: tip 推奨
VRChatプレイヤーでは `api.kipfel.vrchat.org.cn` をAPIエンドポイントとして使用することをおすすめします。
:::

## Bilibili CDN

### プライマリ
- `upos-sz-mirroraliov.bilivideo.com`

### 国内バックアップ
- `upos-sz-mirrorhw.bilivideo.com`
- `upos-sz-mirrorcos.bilivideo.com`
- `upos-hz-mirroraliov.bilivideo.com`
- `cn-zjwz5-dx-v-07.bilivideo.com`

### 海外/中華圏
- `upos-hz-mirrorakam.akamaized.net`

### その他のBilibiliドメイン
- `d1--cn-gotcha104.bilivideo.com`
- `d1--cn-gotcha104b.bilivideo.com`
- `cn-jssz-cm-02-08.bilivideo.com`
- `cn-jssz-cm-02-07.bilivideo.com`
- `cn-jxnc-cm-01-02.bilivideo.com`
- `d1--cn-gotcha204-4.bilivideo.com`
- `d1--cn-gotcha204b.bilivideo.com`
- `d1--ov-gotcha105.bilivideo.com`
- `d1--ov-gotcha107.bilivideo.com`
- `d1--ov-gotcha208.bilivideo.com`
- `d1--ov-gotcha209.bilivideo.com`
- `d1--ov-gotcha210.bilivideo.com`

## 快手 CDN

### プライマリ
- `txmov2.a.kwimgs.com`

### 国内バックアップ
- `txmov2.a.yximgs.com`
- `ali2.a.yximgs.com`

### 一時ドメイン
- `v2.kwaicdn.com`

### アップロード/配信ノード
- `upmov.a.kwimgs.com`

## 抖音 CDN

### プライマリ
- `v1.douyinvod.com`

### 一般的な国内バックアップ
- `v3.douyinvod.com`
- `v5.douyinvod.com`
- `v9.douyinvod.com`
- `v26.douyinvod.com`
- `v26-default.ixigua.com`
- `v3-default.ixigua.com`
- `v3-default.365yg.com`
- `v5-dy-o-abtest.zjcdn.com`

### 海外ノード
- `v16m-default.akamaized.net`

## 完全なドメインリスト

ホワイトリストに追加する必要があるドメインの完全なリストは以下の通りです:

```
api.kipfel.link
api.kipfel.vrchat.org.cn

upos-sz-mirroraliov.bilivideo.com
upos-sz-mirrorhw.bilivideo.com
upos-sz-mirrorcos.bilivideo.com
upos-hz-mirroraliov.bilivideo.com
cn-zjwz5-dx-v-07.bilivideo.com
upos-hz-mirrorakam.akamaized.net
d1--cn-gotcha104.bilivideo.com
d1--cn-gotcha104b.bilivideo.com
cn-jssz-cm-02-08.bilivideo.com
cn-jssz-cm-02-07.bilivideo.com
cn-jxnc-cm-01-02.bilivideo.com
d1--cn-gotcha204-4.bilivideo.com
d1--cn-gotcha204b.bilivideo.com
d1--ov-gotcha105.bilivideo.com
d1--ov-gotcha107.bilivideo.com
d1--ov-gotcha208.bilivideo.com
d1--ov-gotcha209.bilivideo.com
d1--ov-gotcha210.bilivideo.com

txmov2.a.kwimgs.com
txmov2.a.yximgs.com
ali2.a.yximgs.com
v2.kwaicdn.com
upmov.a.kwimgs.com

v1.douyinvod.com
v3.douyinvod.com
v5.douyinvod.com
v9.douyinvod.com
v26.douyinvod.com
v26-default.ixigua.com
v3-default.ixigua.com
v3-default.365yg.com
v5-dy-o-abtest.zjcdn.com
v16m-default.akamaized.net
```

## VRChatワールドへの追加方法

ワールド作者の場合は、上記のドメインをワールドのホワイトリストに追加する必要があります:

1. VRChatワールドプロジェクトを開きます
2. 動画プレイヤーの設定を見つけます
3. ホワイトリスト設定に上記のドメインを追加します
4. URLlistは100に制限されているので、必要に応じて選択してください

## パーサーサポートの申請

このパーサーサイトのサポートを追加したい場合は、[admin@kipfel.link](mailto:admin@kipfel.link?subject=ドメインホワイトリスト申請&body=こんにちは、[ワールド名]の作者です。このパーサーサイトのサポートを追加する必要があります。こちらがワールドの招待リンクです:)にメールを送信し、あなたとあなたのワールドの情報を添付してください。
