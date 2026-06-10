package com.freekyi.tv

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        setContent {
            CinemaFlowTvApp()
        }
    }
}

@Composable
private fun CinemaFlowTvApp() {
    val context = LocalContext.current
    val rows = remember {
        listOf(
            MediaRow("Continue building", sampleItems.take(5)),
            MediaRow("Trending movies", sampleItems),
            MediaRow("Popular TV series", sampleItems.reversed())
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(Color(0xFF151A22), Color(0xFF05070A))
                )
            )
            .padding(horizontal = 56.dp, vertical = 40.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    AppText(
                        text = "FreeKyi TV",
                        size = 34,
                        weight = FontWeight.Bold,
                        color = Color.White
                    )
                    AppText(
                        text = "Native Android TV starter is running",
                        size = 17,
                        color = Color(0xFFB8C0CC)
                    )
                }

                TvButton(
                    text = "Test WebView",
                    onClick = {
                        val intent = Intent(context, PlaybackWebViewActivity::class.java)
                            .putExtra(PlaybackWebViewActivity.EXTRA_URL, "https://example.com")
                            .putExtra(PlaybackWebViewActivity.EXTRA_TITLE, "Playback WebView Test")
                        context.startActivity(intent)
                    }
                )
            }

            Spacer(modifier = Modifier.height(34.dp))

            HeroPanel()

            Spacer(modifier = Modifier.height(30.dp))

            rows.forEach { row ->
                MediaShelf(row)
                Spacer(modifier = Modifier.height(26.dp))
            }
        }
    }
}

@Composable
private fun HeroPanel() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(190.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(
                Brush.horizontalGradient(
                    listOf(Color(0xFF253142), Color(0xFF121820), Color(0xFF07090D))
                )
            )
            .border(1.dp, Color(0x22FFFFFF), RoundedCornerShape(18.dp))
            .padding(28.dp)
    ) {
        Column(
            modifier = Modifier.align(Alignment.CenterStart),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            AppText("Ready for remote testing", 26, FontWeight.SemiBold, Color.White)
            AppText(
                "Use arrow keys or an Android TV remote to move focus. Press center/enter to open actions.",
                16,
                color = Color(0xFFD5DAE3)
            )
            AppText(
                "Next step: connect your TMDB rows and third-party embed URLs.",
                15,
                color = Color(0xFFF5C84C)
            )
        }
    }
}

@Composable
private fun MediaShelf(row: MediaRow) {
    Column {
        AppText(row.title, 22, FontWeight.SemiBold, Color.White)
        Spacer(modifier = Modifier.height(12.dp))
        LazyRow(horizontalArrangement = Arrangement.spacedBy(18.dp)) {
            items(row.items, key = { it.id }) { item ->
                PosterCard(item)
            }
        }
    }
}

@Composable
private fun PosterCard(item: SampleMedia) {
    var focused by remember { mutableStateOf(false) }
    val borderColor = if (focused) Color(0xFFF5C84C) else Color(0x22FFFFFF)
    val bg = if (focused) Color(0xFF273140) else Color(0xFF171D27)

    Column(
        modifier = Modifier
            .width(if (focused) 166.dp else 154.dp)
            .onFocusChanged { focused = it.isFocused }
            .onPreviewKeyEvent { event ->
                if (
                    event.type == KeyEventType.KeyUp &&
                    (event.key == Key.Enter || event.key == Key.DirectionCenter)
                ) {
                    true
                } else {
                    false
                }
            }
            .clickable { }
            .focusable(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(width = if (focused) 166.dp else 154.dp, height = if (focused) 242.dp else 226.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(bg)
                .border(BorderStroke(3.dp, borderColor), RoundedCornerShape(12.dp))
        ) {
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .size(64.dp)
                    .clip(RoundedCornerShape(32.dp))
                    .background(Color(0xFFF5C84C)),
                contentAlignment = Alignment.Center
            ) {
                AppText("▶", 28, FontWeight.Bold, Color(0xFF05070A))
            }
        }
        Spacer(modifier = Modifier.height(10.dp))
        AppText(
            text = item.title,
            size = 14,
            weight = FontWeight.SemiBold,
            color = Color.White,
            maxLines = 1
        )
        AppText(
            text = item.subtitle,
            size = 12,
            color = Color(0xFF9FA8B5),
            maxLines = 1
        )
    }
}

@Composable
private fun TvButton(text: String, onClick: () -> Unit) {
    var focused by remember { mutableStateOf(false) }
    val background = if (focused) Color(0xFFF5C84C) else Color(0xFF202938)
    val textColor = if (focused) Color(0xFF05070A) else Color.White

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(10.dp))
            .background(background)
            .border(2.dp, if (focused) Color.White else Color(0x33FFFFFF), RoundedCornerShape(10.dp))
            .onFocusChanged { focused = it.isFocused }
            .onPreviewKeyEvent { event ->
                if (
                    event.type == KeyEventType.KeyUp &&
                    (event.key == Key.Enter || event.key == Key.DirectionCenter)
                ) {
                    onClick()
                    true
                } else {
                    false
                }
            }
            .clickable(onClick = onClick)
            .focusable()
            .padding(horizontal = 22.dp, vertical = 14.dp),
        contentAlignment = Alignment.Center
    ) {
        AppText(text, 16, FontWeight.Bold, textColor)
    }
}

@Composable
private fun AppText(
    text: String,
    size: Int,
    weight: FontWeight = FontWeight.Normal,
    color: Color = Color.White,
    maxLines: Int = Int.MAX_VALUE
) {
    androidx.compose.foundation.text.BasicText(
        text = text,
        maxLines = maxLines,
        overflow = TextOverflow.Ellipsis,
        style = androidx.compose.ui.text.TextStyle(
            color = color,
            fontSize = size.sp,
            fontWeight = weight
        )
    )
}

private data class MediaRow(
    val title: String,
    val items: List<SampleMedia>
)

private data class SampleMedia(
    val id: Int,
    val title: String,
    val subtitle: String
)

private val sampleItems = listOf(
    SampleMedia(1, "Movie Detail", "TMDB screen"),
    SampleMedia(2, "TV Detail", "Season picker"),
    SampleMedia(3, "Search", "Remote keyboard"),
    SampleMedia(4, "Watchlist", "DataStore later"),
    SampleMedia(5, "Bookmarks", "Local library"),
    SampleMedia(6, "Server Select", "Embed URLs"),
    SampleMedia(7, "Playback", "WebView"),
    SampleMedia(8, "Settings", "App config")
)
