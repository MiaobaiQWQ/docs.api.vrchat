---
outline: deep
---

# Changelog

This page records the update history of the Kipfel video parsing service.

## Contact

### Feedback
- **Admin**: [admin@kipfel.link](mailto:admin@kipfel.link)
- **Operations**: 海落QWQ [xiao-luo@kipfel.cn](mailto:xiao-luo@kipfel.cn)

---

## 2026

### 26/07/04
- Bug fixed: Previously, Kuaishou video parsing could only return clip files, now we have fixed this issue!
- Optimized parsing logic, prioritizing complete high-quality video links and filtering out clip files

### 26/06/23
- Added IP ban mechanism
- Added banned content display page
- Removed 302 redirect for non-video platforms and non-whitelist addresses
- [Ban reason] Service had no whitelist verification by default, today we discovered illegal video playback during investigation

### 26/06/21
- Fixed some backend parsing exceptions causing crashes, which made some videos unable to parse properly. Now fixed
- MiaobaiQWQ reassigned to Documentation Lead, responsible for documentation section management and content maintenance
- 海落QWQ reassigned to Backend Video Parsing Fixes, responsible for parsing service maintenance and troubleshooting
- kole-knol role updated to Domain Provider &amp; Server Owner

### 26/06/15
- Removed URL cache replacement feature because same URL might not work for others even if it works for you
- Status fix completed and deployed with minimal server impact

### 26/06/14
- Fixed and optimized that proper BV and Douyin links can be parsed normally
- Optimized handling of links missing https, www, and corresponding platform domains
- When you send wrong links, you'll get an image with instructions to follow
- YouTube video parsing is temporarily unfixable

### 26/06/13
- Fixed parsing failure caused by some youtu.be short direct link access errors
- Rewrote Bilibili live replacement logic (contact us if you find it not working properly)

### 26/06/12
- Fixed domestic live parsing failure because admin forgot to renew server (they've been scolded)

### 26/06/11
- Fixed Bilibili official event live stream parsing failure
- Fixed entire parser blowing up because someone uploaded files to wrong server while sleep-deprived (fixed at 07:00 UTC+8)
- Fixed Bilibili short live link parsing failure
- Fixed live links being incorrectly replaced with video links

### 26/06/10
- Fixed some old Bilibili videos not parsing properly
- Fixed slow response times
- Fixed known bugs

### 26/06/08
- Updated to use direct 302 redirect for direct links
- Fixed some videos being blocked by security system returning: The link contains an unsafe destination and has been blocked by the system
- Fixed videos not parsing properly returning: 404
- Optimized Japanese text filtering that was causing parsing failures
- Optimized parsing logic for faster parsing

### 26/05/26
- Fixed Douyin live parsing occasionally failing to play
- Recommend using in private rooms for better video experience
- May not work in Café worlds
- ⚠️ **Important**: Please make sure to remove any sharing text, especially anything with #. Content after # won't be sent to the server because it follows RFC 3986, so text after # cannot be sent to the server. Thank you for your understanding.
