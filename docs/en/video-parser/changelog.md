---
outline: deep
description: "Changelog for the kipfel.link video parsing service, recording interface changes, parser fixes, the IP ban mechanism and new features by date."
---

# Changelog

This page records the update history of the Kipfel video parsing service.

## Contact Information

### Feedback
- **Admin**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **Operations Staff**: Hailuo QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)

---

## 2026

### 2026/07/13
- Updated animation effects and styles for the docs pages
- Styles provided by [`Luoyuxi API`](https://api.yuki-can.top/)

### 2026/07/10
- Do you feel that videos without danmaku are boring?
- Currently, you can use the latest V3 interface in the cafe, and you can watch danmaku in the cafe! (Please use its built-in parsing, do not parse it yourself, otherwise you will not be able to view danmaku)
- The main functions of the V3 interface are the danmaku system (of course! this also supports Bilibili and Douyin) and subsequent extended functions such as multi-part playback and music playback.
- YouTube video parsing, umm, I can't reverse it anymore, let's just leave it there for now. I'm really sorry that foreign users can't use it temporarily!

### 26/07/04
- Issue fixed: Previously, Kuaishou video parsing could only return fragmented files, but we have now fixed this issue!
- Optimized parsing logic, prioritizing complete high-quality video links and filtering out fragmented files.

### 26/06/23
- Added IP banning mechanism
- Added banned content display page
- Canceled 302 redirects for non-video platforms and whitelist addresses
- [Reason for banning] The service does not have whitelist verification by default. Today's investigation found illegal videos being played.

### 26/06/21
- Fixed some abnormal crashes in backend parsing, which caused some video parsing to not work properly. It has now been fixed.
- Mo Bai QWQ has been adjusted to be the document负责人 (person in charge of documents), responsible for document area management and content maintenance.
- Hailuo QWQ has been adjusted to be the backend video parsing repair, responsible for parsing service maintenance and fault repair.
- kole-knol's position has been updated to domain provider server holder.

### 26/06/15
- Deleted the link replacement cache function. The reason is that the same link may not be playable by others but playable by oneself.
- Status repair is complete and has little impact on the server, and has been put into use.

### 26/06/14
- Fixed and optimized that as long as the correct bv and Douyin links are returned, they can be parsed normally.
- Optimized the problem that missing https and www and corresponding platform domains cannot be parsed normally.
- When you return a wrong link, it will return an image with a prompt to guide you.
- YouTube video parsing cannot be fixed temporarily.

### 26/06/13
- Fixed parsing failure caused by some short direct link access errors from youtu.be.
- Rewrote Bilibili live broadcast replacement logic (if you find it cannot be played normally, please contact us).

### 26/06/12
- Fixed the issue where domestic live broadcast parsing failed because the administrator forgot to renew the server, and has been reprimanded.

### 26/06/11
- Fixed Bilibili official event live broadcast parsing failure.
- Fixed the issue where the entire parsing crashed due to uploading files to the wrong server due to staying up late (fixed at 07:00 (UTC+8)).
- Fixed Bilibili short live link parsing failure.
- Fixed the issue where live links were incorrectly replaced with video links.

### 26/06/10
- Fixed some old Bilibili videos that could not be parsed normally.
- Fixed slow response speed.
- Fixed known bugs.

### 26/06/08
- Updated direct link 302 redirect.
- Fixed some videos being blocked by the security system, returning: "This link contains an unsafe target address and has been blocked by the system."
- Fixed video playback not being parsed normally, returning: "404".
- Optimized the problem that some Japanese parts could not be filtered correctly, resulting in parsing failure.
- Optimized parsing logic for faster parsing.

### 26/05/26
- Fixed the probability of Douyin live broadcast parsing failing and not being able to play.
- It is recommended to use it in a private room for a better video viewing experience.
- Some video playback in the cafe may be invalid.
- ⚠️ **Important Note**: Please be sure to delete the copy, especially the copy with # in it. The content after # will not be sent back to the server. This follows RFC 3986, so the copy after # cannot be sent to the server. Please understand.
