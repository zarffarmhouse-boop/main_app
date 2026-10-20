package com.zarf.farmhouse.data.seed

import com.zarf.farmhouse.data.local.BookingEntity
import com.zarf.farmhouse.data.local.EnquiryEntity
import com.zarf.farmhouse.data.local.EnquiryDao
import com.zarf.farmhouse.data.local.BookingDao
import java.util.Locale

/**
 * Seeds enquiries and confirmed bookings from the two Zarf Lead Tracking CSV exports.
 * People, todos, and expenses are intentionally left empty.
 */
object CsvLeadSeeder {

    private data class Row(
        val status: String,
        val name: String,
        val firstContact: String,
        val dateNeeded: String,
        val occasion: String,
        val source: String,
        val guests: String,
        val notes: String
    )

    suspend fun seed(enquiryDao: EnquiryDao, bookingDao: BookingDao) {
        val rows = baseCsvRows() + upcomingCsvRows()
        val seenBookingNames = mutableSetOf<String>()
        val seenEnquiryNames = mutableSetOf<String>()

        for (row in rows) {
            val name = row.name.trim()
            val status = row.status.trim()
            
            // Skip empty rows and rows without names
            if (name.isEmpty() || status.isEmpty()) continue

            when (status) {
                "Upcoming Booking", "Booked - Event Over" -> {
                    val key = name.lowercase(Locale.US)
                    if (!seenBookingNames.add(key)) continue
                    bookingDao.insertBooking(row.toBooking())
                }
                "Inquired", "Lost" -> {
                    val key = name.lowercase(Locale.US)
                    if (!seenEnquiryNames.add(key)) continue
                    enquiryDao.insertEnquiry(row.toEnquiry())
                }
            }
        }
    }

    private fun Row.toBooking(): BookingEntity {
        val (checkIn, checkOut) = DateParseUtil.dateRange(dateNeeded)
        val noteParts = buildList {
            if (dateNeeded.isNotBlank()) add("Date needed: $dateNeeded")
            if (notes.isNotBlank()) add(notes.trim())
        }
        return BookingEntity(
            guestName = name.trim(),
            checkInDate = checkIn,
            checkOutDate = checkOut,
            guestsCount = DateParseUtil.guestsFromRange(guests),
            guestsRange = guests.trim(),
            occasion = occasion.trim(),
            source = source.trim(),
            amount = 0.0,
            paymentStatus = "Pending",
            notes = noteParts.joinToString("\n")
        )
    }

    private fun Row.toEnquiry(): EnquiryEntity {
        val enquiryStatus = if (status.trim() == "Lost") "Closed" else "New"
        return EnquiryEntity(
            name = name.trim(),
            enquiryDate = DateParseUtil.toSortableDate(firstContact),
            preferredDates = dateNeeded.trim(),
            guestsCount = DateParseUtil.guestsFromRange(guests),
            guestsRange = guests.trim(),
            occasion = occasion.trim(),
            source = source.trim(),
            notes = notes.trim(),
            status = enquiryStatus
        )
    }

    /** Zarf - Lead Tracking - Base.csv */
    private fun baseCsvRows(): List<Row> = listOf(
        Row("Upcoming Booking", "Indian Baby pamper.", "27 Nov 2026 to 29 Nov 2026 (morning)", "27 Nov 2026 to 29 Nov 2026 (11 AM - 9 AM)", "Family Get Together", "", "0-30", ""),
        Row("Upcoming Booking", "Zakir Bhai", "29th July 2026", "2 nd Oct 2026 (3 pm -12am)", "Wedding Function", "Referral", "100-250", "150 , Bhatti reqrd, 8 hot cases, 4 water cooler "),
        Row("Upcoming Booking", " Mansoor Booking ", "17 th Aug 2026", "22 dec to 27 dec 2026 (11 am to 11 am)", "Wedding Function", "Referral", "0-30", "chairs 20, Bhagone 3, bhatti,tables 2"),
        Row("Upcoming Booking", "Afraj booking", "2 nd Sep 2026", "21st Oct to 23 rd Oct 2026(12 pm to 3 pm", "Wedding Function", "Instagram", "31-100", "125 people function anad stay"),
        Row("Upcoming Booking", "Sakina Booking ", "10th Sep 2026", "18th Nov to 21 st Nov2026", "Family Get Together", "Instagram", "31-100", "30 to 35 people stay"),
        Row("Upcoming Booking", "Mujeeb 2 Booking ", "17 th Oct 2026", "30 th Jan 27 to 31st Jan 27 4pm to 4 pm", "Wedding Function", "Instagram", "0-30", ""),
        Row("Inquired", "Shahwar Booking ", "4th Aug 2026", "16th Aug 2026(10 am to 10 am )", "Family Get Together", "Instagram", "31-100", ""),
        Row("Inquired", "Riya Sarkar", "30 th July 2026", "01 Aug 2026 (12 PM - 9 PM)", "Birthday Party", "", "", ""),
        Row("Inquired", "Nusrat Fatima ", "20th July 2026", "15 th. Nov 2026", "Wedding Function", "Maps", "0-30", ""),
        Row("Inquired", "Muin uddin", "26th July 2026", "15 Aug 2026 (9 AM - 9 PM)", "Family Get Together", "", "", ""),
        Row("Inquired", "Mubeen Khan", "20th July 2026", "23rd Nov 2026", "Family Get Together", "Event Planner", "0-30", ""),
        Row("Inquired", "saman saud Owais", "2nd Aug 2026", "02 Aug 2026 (11 AM - 5 PM)", "Family Get Together", "", "", ""),
        Row("Inquired", "Rizwan", "27th July 2026", "02 Oct 2026 (11 AM - 8 PM)", "", "", "", ""),
        Row("Inquired", "Areeba", "20th Aug 2026", "8/1/2026", "Family Get Together", "Referral", "0-30", ""),
        Row("Inquired", "Saniya Booking ", "6th Aug 2026", "", "", "", "", ""),
        Row("Inquired", "Murtiza khan", "3rd Aug 2026", "8th Aug 2026", "Family Get Together", "Instagram", "0-30", ""),
        Row("Inquired", "Tasneem Khan", "3rd Aug 2026", "", "", "Instagram", "0-30", ""),
        Row("Inquired", "Som Booking ", "4th Aug 2026", "5th Aug 2026", "Pool Party", "Instagram", "0-30", ""),
        Row("Inquired", "Tabassum ", "4th Aug 2026", "11th Nov 2026", "", "", "", ""),
        Row("Inquired", "Bubli Booking ", "6th Aug 2026 ", "9 Aug 2026(11am -8pm)", "", "Instagram", "0-30", ""),
        Row("Inquired", "Faheem Booking ", "6th Aug 2026 ", "5 September (4pm - 12 pm)", "Wedding Function", "Instagram", "31-100", ""),
        Row("Inquired", "Afzal 2 Booking ", "7th Aug 2026", "8th Aug 2026", "Family Get Together", "Instagram", "0-30", ""),
        Row("Inquired", "kahkashaul Booking ", "7th Aug 2026", "22 nd Aug (Saturday)", "Family Get Together", "Instagram", "0-30", "No cooking "),
        Row("Inquired", "Aliza Booking ", "7th Aug 2026", "12 th Aug 2026", "Family Get Together", "Instagram", "0-30", ""),
        Row("Inquired", "Farhan Booking ", "7th Aug 2026", "15 th Aug", "Family Get Together", "Instagram", "0-30", ""),
        Row("Inquired", "Ankit Booking ", "8th Aug 2026", "8th Aug ,2026", "Pool Party", "Instagram", "0-30", ""),
        Row("Inquired", "Ayesha Booking ", "8th Aug 2026", "September Sunday ", "", "Instagram", "31-100", ""),
        Row("Inquired", "Zeba Booking ", "7th Aug 2026", "", "Family Get Together", "Instagram", "31-100", ""),
        Row("Inquired", "Faiza Booking ", "8th Aug 2026", "not confirmed ", "Family Get Together", "Instagram", "0-30", ""),
        Row("Inquired", "Amul Booking ", "21st Aug 2026", "23rd Aug 2026. (college students)", "Pool Party", "Instagram", "0-30", "not Allowed "),
        Row("Inquired", "sagheer Manzoor ", "21st Aug 2026", "October ", "Wedding Function", "Instagram", "", ""),
        Row("Inquired", "Mohd Shariq ", "21st Aug 2026", "September ", "Family Get Together", "Instagram", "", ""),
        Row("Inquired", "Naeem Booking ", "24th Aug 2026", "29 to. 30 th November r 2026", "Wedding Function", "Instagram", "100-250", ""),
        Row("Inquired", "Najmi Baji", "24 th Aug 26 ", "5 th September 26", "Wedding Function", "Referral", "100-250", ""),
        Row("Inquired", "P P Booking ", "27th Aug 26 ", "28th Aug 26 (8pm to 8 am)", "Family Get Together", "Referral", "0-30", ""),
        Row("Inquired", "Arshad Booking ", "27th Aug 2026", "30 th August 26 12 pm to 12 am)", "Family Get Together", "Instagram", "0-30", ""),
        Row("Inquired", "Mohammad Booking ", "26th Aug 2026 ", "30th August 26 ", "Family Get Together", "Instagram", "0-30", ""),
        Row("Inquired", "Mohit booking ", "30th Aug 2026", "", "", "", "", ""),
        Row("Inquired", "Mohammad 2 Booking ", "2nd Sep 2026", "6th Sep 2026(12 am to 6 pm)", "Pool Party", "Instagram", "0-30", ""),
        Row("Booked - Event Over", "second time booking swimming pool construction in process ", "11th September 2026", "12th Sep 2026", "", "", "", ""),
        Row("Booked - Event Over", "Hemant", "4th Aug 2026", "26 Aug 26 (8pm to 8 am)", "Birthday Party", "Instagram", "0-30", ""),
        Row("Booked - Event Over", "Saquib ", "8th Aug/2026", "14 th Aug 2026(8pm - 8 am)", "Family Get Together", "Instagram", "0-30", ""),
        Row("Booked - Event Over", "Dr Abrar Booking ", "15th Aug 2026", "22 nd Aug 2026(9am to 9 m)", "Family Get Together", "Instagram", "0-30", ""),
        Row("Booked - Event Over", "Haris Booking ", "14th Aug 2026", "18th Aug 2026 (12 pm to 12 am", "Family Get Together", "Instagram", "0-30", ""),
        Row("Booked - Event Over", "Sanjana. Khatri", "1st July 2026", "15 Aug 2026 (2 PM - 9 AM)", "Family Get Together", "Instagram", "0-30", "15 mattress required, bhatti "),
        Row("Booked - Event Over", "Farhana ", "5 th Aug 2026", "9th Aug. (10 am to 10 pm)", "Family Get Together", "Instagram", "0-30", "Bhatti required "),
        Row("Booked - Event Over", "saman saud Owais", "2nd July 2026", "02 Aug 2026 (11 AM - 5 PM)", "Family Get Together", "", "", ""),
        Row("Booked - Event Over", "mujeeb khan", "26th July 2026", "26 Jul 2026 (Done)", "Family Get Together", "", "", ""),
        Row("Booked - Event Over", "saman Saud Khan", "", "26 th July", "Family Get Together", "Whatsapp", "0-30", ""),
        Row("Booked - Event Over", "Firdous Booking ", "14 th Aug 2026", "16 th Aug 2026(10 am to 10 pm)", "Family Get Together", "Instagram", "0-30", ""),
        Row("Booked - Event Over", "Uzma Booking ", "29th Aug 2026", "30 th August 26(12 am to 5 pm)", "Pool Party", "Instagram", "0-30", ""),
        Row("Lost", "Salman Booking ", "14 th Aug 2026", "18th Aug 2026(12pm to 11 am) ", "Family Get Together", "Instagram", "0-30", ""),
        Row("Lost", "AfzAmul booking al KhanFirdMansoomohammohit ", "7 th July. 2026", "16 Aug 2026 (11 AM - 7 PM)", "Family Get Together", "Instagram", "", "")
    )

    /** Zarf - Lead Tracking - Upcoming Bookings.csv (merged; duplicates skipped by name) */
    private fun upcomingCsvRows(): List<Row> = listOf(
        Row("Upcoming Booking", "Indian Baby pamper.", "27 Nov 2026 to 29 Nov 2026 (morning)", "27 Nov 2026 to 29 Nov 2026 (11 AM - 9 AM)", "Family Get Together", "", "0-30", ""),
        Row("Upcoming Booking", "Zakir Bhai", "7/29/2026", "2 nd Oct 2026 (3 pm -12am)", "Wedding Function", "Referral", "100-250", "150 , Bhatti reqrd, 8 hot cases, 4 water cooler "),
        Row("Upcoming Booking", "Haris Booking ", "8/14/2026", "18th Aug 2026 (12 pm to 12 am", "Family Get Together", "Instagram", "0-30", ""),
        Row("Upcoming Booking", "Dr Abrar Booking ", "8/15/2026", "22 nd Aug 2026(9am to 9 m)", "Family Get Together", "Instagram", "0-30", ""),
        Row("Upcoming Booking", " Mansoor Booking ", "17 th Aug 2026", "22 dec to 27 dec 2026 (11 am to 11 am)", "Wedding Function", "Referral", "0-30", "chairs 20, Bhagone 3, bhatti,tables 2"),
        Row("Inquired", "Nusrat Fatima ", "7/20/2026", "15 th. Nov 2026", "Wedding Function", "Maps", "0-30", ""),
        Row("Inquired", "Mubeen Khan", "20th July", "23rd Nov 2026", "Family Get Together", "Event Planner", "0-30", ""),
        Row("Inquired", "Rizwan", "7/27/2026", "02 Oct 2026 (11 AM - 8 PM)", "", "", "", ""),
        Row("Inquired", "Tabassum ", "4th Aug 2026", "11th Nov 2026", "", "", "", ""),
        Row("Inquired", "Amul Booking ", "8/21/2026", "23rd Aug 2026. (college students)", "Pool Party", "Instagram", "0-30", "not Allowed")
    )
}
