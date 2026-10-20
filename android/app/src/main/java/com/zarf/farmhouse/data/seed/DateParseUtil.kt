package com.zarf.farmhouse.data.seed

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.regex.Pattern

/**
 * Parses messy CSV date text into YYYY-MM-DD for Room sorting.
 * Unparseable values fall back to [FALLBACK_SORT_DATE]; original text stays on the entity.
 */
object DateParseUtil {
    const val FALLBACK_SORT_DATE = "1970-01-01"

    private val ISO = DateTimeFormatter.ISO_LOCAL_DATE

    private val monthNames = mapOf(
        "jan" to 1, "feb" to 2, "mar" to 3, "apr" to 4, "may" to 5, "jun" to 6,
        "jul" to 7, "aug" to 8, "sep" to 9, "oct" to 10, "nov" to 11, "dec" to 12
    )

    private val slashUs = Pattern.compile("""^(\d{1,2})/(\d{1,2})/(\d{2,4})$""")

    fun toSortableDate(raw: String?): String {
        if (raw.isNullOrBlank()) return FALLBACK_SORT_DATE
        val trimmed = raw.trim()
        runCatching { LocalDate.parse(trimmed, ISO) }.getOrNull()?.let { return it.format(ISO) }

        slashUs.matcher(trimmed).takeIf { it.matches() }?.let { m ->
            val month = m.group(1)!!.toInt()
            val day = m.group(2)!!.toInt()
            var year = m.group(3)!!.toInt()
            if (year < 100) year += 2000
            return safeDate(year, month, day)
        }

        val lowered = trimmed.lowercase(Locale.US)
        for ((key, month) in monthNames) {
            if (lowered.contains(key)) {
                val dayMatch = Regex("""(\d{1,2})""").find(trimmed)
                val yearMatch = Regex("""(20\d{2}|\d{2})(?!\d)""").findAll(trimmed).lastOrNull()
                val day = dayMatch?.groupValues?.get(1)?.toIntOrNull() ?: continue
                var year = yearMatch?.value?.toIntOrNull() ?: 2026
                if (year < 100) year += 2000
                return safeDate(year, month, day)
            }
        }

        return FALLBACK_SORT_DATE
    }

    /** First and last parseable dates found in a range string (e.g. check-in / check-out). */
    fun dateRange(raw: String?): Pair<String, String> {
        if (raw.isNullOrBlank()) {
            val f = FALLBACK_SORT_DATE
            return f to f
        }
        val candidates = mutableListOf<String>()
        val slashMatches = Regex("""\d{1,2}/\d{1,2}/\d{2,4}""").findAll(raw)
        slashMatches.forEach { candidates.add(toSortableDate(it.value)) }

        for ((key, month) in monthNames) {
            if (!raw.lowercase(Locale.US).contains(key)) continue
            val chunkPattern = Regex("""(\d{1,2})\s*(?:st|nd|rd|th)?\s*${key.take(3)}[\w.]*\s*(?:\d{4}|\d{2})?""", RegexOption.IGNORE_CASE)
            chunkPattern.findAll(raw).forEach { match ->
                candidates.add(toSortableDate(match.value))
            }
        }

        if (candidates.isEmpty()) {
            val single = toSortableDate(raw)
            return single to single
        }

        val sorted = candidates.filter { it != FALLBACK_SORT_DATE }.sorted()
        if (sorted.isEmpty()) {
            val single = toSortableDate(raw)
            return single to single
        }
        return sorted.first() to sorted.last()
    }

    fun guestsFromRange(range: String?): Int {
        return when (range?.trim()) {
            "0-30" -> 15
            "31-100" -> 65
            "100-250" -> 175
            else -> 15
        }
    }

    private fun safeDate(year: Int, month: Int, day: Int): String {
        return runCatching {
            LocalDate.of(year, month.coerceIn(1, 12), day.coerceIn(1, 28)).format(ISO)
        }.getOrDefault(FALLBACK_SORT_DATE)
    }
}
