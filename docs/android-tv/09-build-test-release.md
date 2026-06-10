# Build, Test, And Release

## Development Devices

Use both:

- Android TV emulator
- real Android TV or Google TV device

Do not rely only on the emulator. WebView playback and remote behavior can differ on real devices.

## Test Checklist

### Remote Navigation

- D-pad reaches every visible item.
- Focus state is obvious.
- Back returns to the correct screen.
- Focus restores after returning from detail.
- Long rows scroll smoothly.
- Search works with TV keyboard.

### Data

- Home rows load.
- Detail screen loads movie and TV data.
- TV seasons and episodes load.
- Failed rows do not crash the whole screen.
- Empty search state is clear.

### Library

- Bookmark add/remove works.
- Watchlist add/remove works.
- 300 item limit works.
- Data survives app restart.

### Playback

- Each configured server opens.
- Movie embed URL loads.
- TV episode embed URL includes season and episode.
- Back exits playback.
- Screen stays awake during playback.
- WebView cleanup happens on exit.

### Performance

- Home screen does not stutter badly on real TV hardware.
- Poster images lazy load.
- Backdrop images do not consume excessive memory.
- Rows use stable keys.

## Automated Tests

Start with:

- unit tests for video server URL builder
- unit tests for DTO mapping
- unit tests for bookmark/watchlist rules
- ViewModel tests for loading/error states

Later:

- Compose UI tests for navigation basics
- screenshot tests for key screens

## Release Build

Before release:

1. Create TV launcher banner.
2. Create TV icon assets.
3. Confirm app name.
4. Set package name.
5. Configure signing.
6. Build release APK/AAB.
7. Test on a real Android TV device.

## Google Play Notes

For Android TV distribution, prepare:

- TV screenshots
- banner image
- privacy policy if needed
- content rating
- data safety form
- clear rights/compliance story for the content being streamed

Because the app loads third-party playback embeds, make sure you understand provider terms and content rights before publishing publicly.

## Internal Distribution

If this is only for your own Android TV:

- build a debug APK
- enable developer mode on the TV
- sideload with `adb install`

For a private family/internal app, this is much simpler than public Play Store release.
