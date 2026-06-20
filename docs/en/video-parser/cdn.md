---
outline: deep
---

# CDN Domain List

This page lists CDN domains that need to be added to the whitelist for VRChat public rooms.

::: tip Note
VRChat worlds limit URLlist to maximum 100 entries, please add selectively.
:::

::: tip Recommendation
It is recommended to use `api.kipfel.vrchat.org.cn` as the API endpoint in VRChat players.
:::

## Bilibili CDN

### Primary
- `upos-sz-mirroraliov.bilivideo.com`

### Domestic Backups
- `upos-sz-mirrorhw.bilivideo.com`
- `upos-sz-mirrorcos.bilivideo.com`
- `upos-hz-mirroraliov.bilivideo.com`
- `cn-zjwz5-dx-v-07.bilivideo.com`

### Overseas/Greater China
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

### Primary
- `txmov2.a.kwimgs.com`

### Domestic Backups
- `txmov2.a.yximgs.com`
- `ali2.a.yximgs.com`

### Temporary Domains
- `v2.kwaicdn.com`

### Upload/Distribution Nodes
- `upmov.a.kwimgs.com`

## Douyin CDN

### Primary
- `v1.douyinvod.com`

### Common Domestic Backups
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

## Complete Domain List

Here's the full list of domains that need to be added to the whitelist:

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

## How to Add to VRChat World

If you are a world author, you need to add the above domains to your world whitelist:

1. Open your VRChat world project
2. Locate the video player settings
3. Add the above domains in the whitelist configuration
4. Note URLlist is limited to 100, please select accordingly

## Request Parser Support

If you wish to add support for this parser site, please send an email to [admin@kipfel.link](mailto:admin@kipfel.link?subject=Domain whitelist request&body=Hello, I'm the author of [world name], I need to add support for this parser site, here's my world invite link:), including your information and your world details.
