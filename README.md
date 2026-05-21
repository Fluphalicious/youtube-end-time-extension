# YouTube End Time

A Safari extension that shows when the current YouTube video will end, displayed right inside the player's time bubble.

**`0:20 / 7:23 · ends 11:44pm`**

Automatically adjusts in real time for any playback speed, seeking, and works in fullscreen.

---

## Installation

You'll need **macOS** with **Xcode** installed (free from the App Store).

**1. Clone the repo**
```bash
git clone https://github.com/Fluphalicious/youtube-end-time.git
cd youtube-end-time
```

**2. Open in Xcode**
```bash
open *.xcodeproj
```

**3. Build and run**

Press **⌘R**. This compiles the app and installs it — a small launcher window will open and redirect you to Safari's Extensions settings page.

**4. Allow unsigned extensions**

In Safari's menu bar: **Develop → Allow Unsigned Extensions**

> If you don't see the Develop menu: Safari → Settings → Advanced → tick **"Show features for web developers"**

> Note: you'll need to re-enable this each time you restart Safari.

**5. Enable the extension**

Safari → Settings → Extensions → tick **YouTube End Time** → set access to **Allow on youtube.com**.

---

## Features

- Displays end time inside YouTube's native time bubble — no extra clutter
- Updates instantly when you change playback speed (`0.25×` → `2×` and beyond)
- Updates on seek
- Works in fullscreen
- Handles YouTube's single-page navigation between videos
- Hides automatically for live streams

---

## How it works

The extension injects a content script into YouTube pages that reads the video element's `duration`, `currentTime`, and `playbackRate` to calculate the wall-clock finish time, then appends it inside the `.ytp-time-duration` element in the player controls.

---

## License

MIT
