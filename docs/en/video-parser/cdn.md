---
outline: deep
---

# CDN Domain List

This page lists the CDN domains that need to be added to the whitelist for VRChat public rooms.

::: tip Note
VRChat map URL lists have a maximum of 100 entries. Please add them as needed.
:::

::: tip Suggestion
It is recommended to use the `api.kipfel.vrchat.org.cn` domain as the interface for VRChat players.
:::

## Bilibili CDN

### Main Line
- `upos-sz-mirroraliov.bilivideo.com`

### Domestic Backup
- `upos-sz-mirrorhw.bilivideo.com`
- `upos-sz-mirrorcos.bilivideo.com`
- `upos-hz-mirroraliov.bilivideo.com`
- `cn-zjwz5-dx-v-07.bilivideo.com`

### Overseas/Hong Kong, Macau, Taiwan
- `upos-hz-mirrorakam.akamaized.net`

### Other Bilibili Domains
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

## Kuaishou CDN

### Main Line
- `txmov2.a.kwimgs.com`

### Domestic Backup
- `txmov2.a.yximgs.com`
- `ali2.a.yximgs.com`

### Temporary Domain
- `v2.kwaicdn.com`

### Upload/Distribution Nodes
- `upmov.a.kwimgs.com`

## Douyin CDN

### Main Line
- `v1.douyinvod.com`

### Commonly Used Domestic Backup
- `v3.douyinvod.com`
- `v5.douyinvod.com`
- `v9.douyinvod.com`
- `v26.douyinvod.com`
- `v26-default.ixigua.com`
- `v3-default.ixigua.com`
- `v3-default.365yg.com`
- `v5-dy-o-abtest.zjcdn.com`

### Overseas Nodes
- `v16m-default.akamaized.net`

## Kuaishou Live CDN

### Main Line
- `tx-origin.hlspull.yximgs.com`

### Domestic Backup
- `ws-origin.hlspull.yximgs.com`
- `hw-origin.hlspull.yximgs.com`
- `ali-origin.hlspull.yximgs.com`

## Bilibili Live CDN

### Main Line
- `d1--cn-gotcha104.bilivideo.com`
- `d1--cn-gotcha104b.bilivideo.com`

### Available Domestic Nodes
- `cn-jssz-cm-02-08.bilivideo.com`
- `cn-jssz-cm-02-07.bilivideo.com`
- `cn-jxnc-cm-01-02.bilivideo.com`
- `d1--cn-gotcha204-4.bilivideo.com`
- `d1--cn-gotcha204b.bilivideo.com`

### Overseas Nodes (HLS only)
- `d1--ov-gotcha105.bilivideo.com` (Wangsu)
- `d1--ov-gotcha107.bilivideo.com` (Baidu Cloud Zenlayer)
- `d1--ov-gotcha208.bilivideo.com` (Huawei Cloud)
- `d1--ov-gotcha209.bilivideo.com` (Aliyun)
- `d1--ov-gotcha210.bilivideo.com` (Akamai)

## Full Domain List

Below is a summary of all domains that need to be added to the whitelist:

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
tx-origin.hlspull.yximgs.com
ws-origin.hlspull.yximgs.com
hw-origin.hlspull.yximgs.com
ali-origin.hlspull.yximgs.com

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

## How to add to VRChat map

If you are a map author, you need to add the above domains to your map's whitelist:

1. Add the above domains to the whitelist configuration.
2. Note that the URL list has a maximum of 100 entries, please select as needed.
3. If you need music links, please send me an email and I will provide them.

## Apply to add parsing site support

If you wish to add parsing support for this site, please send an email to [admin@kipfel.link](mailto:admin@kipfel.link?subject=Domain Parsing List Application&body=Hello, I am xxx, the author of xxx map. I need to add parsing support for this site. This is the invitation link to my map:), including relevant information about you and your map.
