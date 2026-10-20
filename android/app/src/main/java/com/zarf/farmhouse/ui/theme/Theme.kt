package com.zarf.farmhouse.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// High contrast palette: Primary Red (#C62828) + Pure White + Soft Light Grey
val PrimaryRed = Color(0xFFC62828)
val PrimaryRedDark = Color(0xFFEF5350)
val SurfaceWarmLight = Color(0xFFFFFFFF)
val CardBackgroundLight = Color(0xFFFFFFFF)
val TextHighContrastLight = Color(0xFF111827)

val DarkSurface = Color(0xFF121412)
val DarkCard = Color(0xFF1E221E)
val TextHighContrastDark = Color(0xFFF3F4F6)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryRed,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFFEBEE),
    onPrimaryContainer = Color(0xFFB71C1C),
    secondary = PrimaryRed,
    background = Color(0xFFFAFAFA),
    surface = CardBackgroundLight,
    onBackground = TextHighContrastLight,
    onSurface = TextHighContrastLight
)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryRedDark,
    onPrimary = Color.Black,
    primaryContainer = Color(0xFF7F0000),
    onPrimaryContainer = Color(0xFFFFCDD2),
    secondary = Color(0xFFE57373),
    background = DarkSurface,
    surface = DarkCard,
    onBackground = TextHighContrastDark,
    onSurface = TextHighContrastDark
)

// Large accessible typography for older non-technical user (minimum 20sp for body, 24sp+ for titles)
// Using Serif font family as fallback that approximates Lora style
val SeniorTypography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 40.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 26.sp,
        lineHeight = 34.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 32.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Normal,
        fontSize = 20.sp,
        lineHeight = 28.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Normal,
        fontSize = 18.sp,
        lineHeight = 26.sp
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Serif,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 26.sp
    )
)

@Composable
fun ZarfFarmhouseTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = SeniorTypography,
        content = content
    )
}