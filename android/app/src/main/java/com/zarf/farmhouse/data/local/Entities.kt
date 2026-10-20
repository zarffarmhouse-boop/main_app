package com.zarf.farmhouse.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "enquiries")
data class EnquiryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val phone: String = "",
    val enquiryDate: String, // YYYY-MM-DD
    val preferredDates: String = "",
    val guestsCount: Int = 15,
    val guestsRange: String = "",
    val occasion: String = "",
    val source: String = "",
    val notes: String = "",
    val status: String = "New", // New, Follow-up, Confirmed, Closed
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "bookings")
data class BookingEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val guestName: String,
    val phone: String = "",
    val checkInDate: String, // YYYY-MM-DD
    val checkOutDate: String, // YYYY-MM-DD
    val guestsCount: Int = 15,
    val guestsRange: String = "",
    val occasion: String = "",
    val source: String = "",
    val amount: Double = 0.0,
    val paymentStatus: String = "Paid", // Pending, Partial, Paid
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "expenses")
data class ExpenseEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val date: String, // YYYY-MM-DD
    val category: String, // Staff, Food, Maintenance, Utilities, Other
    val amount: Double,
    val paidTo: String,
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "people")
data class PersonEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val role: String, // Staff, Vendor, Guest Contact
    val phone: String = "",
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "todos")
data class TodoEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val task: String,
    val dueDate: String? = null,
    val priority: String = "Medium", // Low, Medium, High
    val isDone: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)
