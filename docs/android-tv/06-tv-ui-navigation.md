# TV UI And Navigation

## TV Design Rule

Design for a remote, not a mouse.

Every interactive element must:

- be reachable by D-pad
- show a clear focused state
- have enough spacing for 10-foot viewing
- preserve focus when rows update
- work with Back, Select, Left, Right, Up, and Down

## App Navigation

Use a left rail or top tabs with these destinations:

- Home
- Movies
- TV Series
- Search
- Watchlist
- Bookmarks
- Settings

Recommended for v1: left rail, collapsed by default, expands on focus.

## Screen List

### HomeScreen

Rows:

- Hero/featured row
- Trending Movies
- Popular Movies
- Trending TV
- Popular TV
- Action Movies
- Horror Movies
- Korean Series

Each row is a horizontal lazy list of poster cards.

### BrowseScreen

Props:

```kotlin
mediaType: MediaType
```

Controls:

- genre
- year
- rating
- country/language
- sort

Use focusable chips or menu buttons. Avoid complex forms on TV.

### DetailScreen

Content:

- backdrop hero
- poster
- title
- rating
- year
- runtime or season count
- genres
- overview
- Play button
- server selector
- bookmark button
- watchlist button
- cast row
- recommendations row

For TV shows:

- season selector
- episode row/list
- selected episode summary
- Play episode button

### SearchScreen

Use Android TV-friendly search:

- focused search field
- on-screen keyboard support
- voice input later if desired
- search results grid

### PlaybackWebViewScreen

Fullscreen only.

Controls:

- Back exits playback
- optional server switch overlay
- loading indicator
- error message if WebView cannot load

Do not place playback inside a small card.

## Compose Component Sketch

```kotlin
@Composable
fun PosterCard(
    item: MediaItem,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onClick,
        modifier = modifier
            .width(150.dp)
            .height(225.dp),
        scale = CardDefaults.scale(focusedScale = 1.08f),
        border = CardDefaults.border(
            focusedBorder = Border(
                border = BorderStroke(3.dp, Color.White)
            )
        )
    ) {
        AsyncImage(
            model = item.posterUrl,
            contentDescription = item.title,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )
    }
}
```

## Focus Rules

Use these rules everywhere:

- The first item on each screen should receive initial focus.
- Back should return to the previous screen, not randomly jump focus.
- When returning from detail to a row, restore the previously focused poster.
- Never let focus enter hidden or disabled elements.
- Use stable item keys in lazy rows.

## Layout Sizes

Good starting sizes:

| Element | Size |
| --- | --- |
| Poster card | 150 x 225 dp |
| Focused poster scale | 1.06 to 1.10 |
| Row title | 22 to 28 sp |
| Body text | 16 to 18 sp |
| Primary button height | 48 to 56 dp |
| Screen side padding | 48 to 72 dp |

## Remote Key Handling

Handle:

- Back: navigate back or close overlay
- Select/Center: activate focused item
- Play/Pause: optional, only if native player exists later
- Menu: optional settings/server overlay

Since playback is WebView in v1, do not promise full playback key support.
