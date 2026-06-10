# Playback With Third-Party Iframe Embeds

## Current Web Behavior

The current web app uses `src/components/player/VideoPlayer.tsx`:

```tsx
<iframe
  src={embedUrl}
  allowFullScreen
  allow="autoplay; encrypted-media; picture-in-picture; web-share"
/>
```

Android Compose cannot render this iframe directly. The native Android TV app needs a fullscreen Android WebView screen that loads the third-party embed URL.

## Recommended V1 Playback Flow

```text
DetailScreen
  -> user selects server
  -> user presses Play
  -> app builds embedUrl
  -> PlaybackWebViewActivity opens fullscreen
  -> WebView loads embedUrl
```

## WebView Settings

Use a dedicated Activity for playback.

Recommended settings:

```kotlin
webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.settings.mediaPlaybackRequiresUserGesture = false
webView.settings.loadWithOverviewMode = true
webView.settings.useWideViewPort = true
webView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE

webView.webChromeClient = WebChromeClient()
webView.webViewClient = object : WebViewClient() {
    override fun shouldOverrideUrlLoading(
        view: WebView,
        request: WebResourceRequest
    ): Boolean {
        return false
    }
}
```

## Manifest Permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

If the provider uses non-HTTPS resources, you may need network security config. Prefer HTTPS.

## Activity Behavior

Playback Activity should:

- force landscape
- hide system UI
- keep screen awake
- show loading indicator
- show error/retry if URL fails
- close on Back
- clear WebView when destroyed

Cleanup:

```kotlin
override fun onDestroy() {
    webView.stopLoading()
    webView.loadUrl("about:blank")
    webView.clearHistory()
    webView.removeAllViews()
    webView.destroy()
    super.onDestroy()
}
```

## Important Limitations

Third-party iframe playback may not behave perfectly on Android TV:

- remote focus may be trapped inside the webpage
- provider fullscreen buttons may not respond consistently
- provider ads/popups may break TV remote navigation
- autoplay can be blocked by provider behavior
- some providers block WebView user agents
- Google Play review can care about content rights and playback behavior

This is why the rest of the app should be native and only the playback surface should be WebView.

## Better Future Option

If you can get direct stream URLs from a legal provider:

- HLS `.m3u8`
- MPEG-DASH `.mpd`
- MP4

Then use AndroidX Media3 ExoPlayer and remove WebView playback.

Native playback gives:

- proper remote controls
- subtitles
- resume position
- audio focus
- playback speed if needed
- reliable fullscreen
- better TV performance

## Server Selection

Keep your current server model:

```kotlin
data class VideoServer(
    val id: String,
    val name: String,
    val embedUrl: String
)
```

On the detail screen:

- show server buttons
- save last selected server id
- if selected server is unavailable, fall back to first server

For TV episodes, rebuild server URLs whenever season or episode changes.
