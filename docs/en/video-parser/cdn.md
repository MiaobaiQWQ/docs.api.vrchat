---
outline: deep
description: "The complete CDN domain list for the VRChat map whitelist, covering Bilibili, Kuaishou, Douyin and music service nodes, ready to paste into URLlist."
---

# CDN Domain List

This page lists the CDN domains that need to be added to the whitelist for VRChat public rooms.

::: tip Note
VRChat map URL lists have a maximum of 100 entries. Please add them as needed.
:::

::: tip Suggestion
It is recommended to use the `api.kipfel.link` domain as the interface for VRChat players.
:::

## Parser API

- `api.kipfel.link`

## Bilibili CDN

- `upos-sz-mirroraliov.bilivideo.com`
- `upos-sz-mirrorhw.bilivideo.com`
- `upos-sz-mirrorcos.bilivideo.com`
- `upos-hz-mirroraliov.bilivideo.com`
- `upos-hz-mirrorakam.akamaized.net`

## Bilibili Live CDN

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

## Music CDN

- `music-api-qedge.kipfel.cloud`
- `music-api.kipfel.cloud`
- `music-api-ally.kipfel.cloud`
- `music-api-tx.kipfel.cloud`

## Full Domain List

Below is a summary of all domains that need to be added to the whitelist:

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

## How to add to VRChat map

If you are a map author, you need to add the above domains to your map's whitelist:

1. Add the above domains to the whitelist configuration.
2. Note that the URL list has a maximum of 100 entries, please select as needed.
3. If you need music links, please send me an email and I will provide them.

## Apply to add parsing site support

If you wish to add parsing support for this site, please send an email to [admin@kipfel.link](mailto:admin@kipfel.link?subject=Domain Parsing List Application&body=Hello, I am xxx, the author of xxx map. I need to add parsing support for this site. This is the invitation link to my map:), including relevant information about you and your map.

## Related Pages

- [Video Parser API Reference](/en/video-parser/api) — endpoints, parameters and response fields
- [Usage Guide](/en/video-parser/guide) — how to call each endpoint
- [FAQ](/en/video-parser/faq) — map whitelist and playback troubleshooting
- [Domain Allocation](/en/video-parser/domains) — what each subdomain is used for
