package com.zarf.farmhouse.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        EnquiryEntity::class,
        BookingEntity::class,
        ExpenseEntity::class,
        PersonEntity::class,
        TodoEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun enquiryDao(): EnquiryDao
    abstract fun bookingDao(): BookingDao
    abstract fun expenseDao(): ExpenseDao
    abstract fun personDao(): PersonDao
    abstract fun todoDao(): TodoDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "zarf_farmhouse.db"
                )
                .addCallback(DatabaseCallback())
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                CoroutineScope(Dispatchers.IO).launch {
                    val database = INSTANCE ?: return@launch
                    val bookingDao = database.bookingDao()
                    val enquiryDao = database.enquiryDao()
                    val personDao = database.personDao()
                    val todoDao = database.todoDao()
                    val expenseDao = database.expenseDao()

                    // Confirmed & Upcoming Bookings (Bhopal Farmhouse Real Records)
                    bookingDao.insertBooking(BookingEntity(guestName = "Afraj booking", checkInDate = "2026-10-21", checkOutDate = "2026-10-23", guestsCount = 85, guestsRange = "31-100", occasion = "Wedding Function", source = "Instagram", amount = 45000.0, paymentStatus = "Paid", notes = "125 people function and stay"))
                    bookingDao.insertBooking(BookingEntity(guestName = "Sakina Booking", checkInDate = "2026-11-18", checkOutDate = "2026-11-21", guestsCount = 35, guestsRange = "31-100", occasion = "Family Get Together", source = "Instagram", amount = 40000.0, paymentStatus = "Paid", notes = "30 to 35 people stay"))
                    bookingDao.insertBooking(BookingEntity(guestName = "Indian Baby pamper", checkInDate = "2026-11-27", checkOutDate = "2026-11-29", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Other", amount = 35000.0, paymentStatus = "Paid", notes = "Family Get Together celebration"))
                    bookingDao.insertBooking(BookingEntity(guestName = "Mansoor Booking", checkInDate = "2026-12-22", checkOutDate = "2026-12-27", guestsCount = 25, guestsRange = "0-30", occasion = "Wedding Function", source = "Referral", amount = 65000.0, paymentStatus = "Paid", notes = "chairs 20, Bhagone 3, bhatti, tables 2"))
                    bookingDao.insertBooking(BookingEntity(guestName = "Mujeeb 2 Booking", checkInDate = "2027-01-30", checkOutDate = "2027-01-31", guestsCount = 25, guestsRange = "0-30", occasion = "Wedding Function", source = "Instagram", amount = 30000.0, paymentStatus = "Partial", notes = "Wedding function overnight stay"))
                    bookingDao.insertBooking(BookingEntity(guestName = "Zakir Bhai", checkInDate = "2026-10-02", checkOutDate = "2026-10-02", guestsCount = 150, guestsRange = "100-250", occasion = "Wedding Function", source = "Referral", amount = 50000.0, paymentStatus = "Paid", notes = "3pm-12am (150 guests). Bhatti required, 8 hot cases, 4 water cooler"))
                    bookingDao.insertBooking(BookingEntity(guestName = "Haris Booking", checkInDate = "2026-08-18", checkOutDate = "2026-08-18", guestsCount = 20, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", amount = 25000.0, paymentStatus = "Paid", notes = "Family Get Together"))
                    bookingDao.insertBooking(BookingEntity(guestName = "Dr Abrar Booking", checkInDate = "2026-08-22", checkOutDate = "2026-08-22", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", amount = 25000.0, paymentStatus = "Paid", notes = "Family Get Together day event"))

                    // Real Enquiries Seed
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Naeem Booking", enquiryDate = "2026-10-15", preferredDates = "29-30 Nov 2026", guestsCount = 150, guestsRange = "100-250", occasion = "Wedding Function", source = "Instagram", status = "New", notes = "Wedding function enquiry for end of November"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Mubeen Khan", enquiryDate = "2026-10-14", preferredDates = "23 Nov 2026", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Event Planner", status = "New", notes = "Event Planner referral"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Nusrat Fatima", enquiryDate = "2026-10-12", preferredDates = "15 Nov 2026", guestsCount = 25, guestsRange = "0-30", occasion = "Wedding Function", source = "Maps", status = "New", notes = "Found via Google Maps"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Tabassum", enquiryDate = "2026-10-11", preferredDates = "11 Nov 2026", guestsCount = 20, guestsRange = "0-30", occasion = "Other", source = "Instagram", status = "New", notes = "November booking inquiry"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "sagheer Manzoor", enquiryDate = "2026-10-05", preferredDates = "October", guestsCount = 50, guestsRange = "31-100", occasion = "Wedding Function", source = "Instagram", status = "Follow-up", notes = "October wedding function"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Rizwan", enquiryDate = "2026-10-02", preferredDates = "02 Oct 2026", guestsCount = 20, guestsRange = "0-30", status = "Follow-up", notes = "October dates"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Faheem Booking", enquiryDate = "2026-09-05", preferredDates = "5 Sep 2026", guestsCount = 60, guestsRange = "31-100", occasion = "Wedding Function", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Najmi Baji", enquiryDate = "2026-09-05", preferredDates = "5 Sep 2026", guestsCount = 150, guestsRange = "100-250", occasion = "Wedding Function", source = "Referral", status = "Follow-up", notes = "Wedding function via referral"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Mohd Shariq", enquiryDate = "2026-09-08", preferredDates = "September", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Ayesha Booking", enquiryDate = "2026-09-10", preferredDates = "September Sunday", guestsCount = 50, guestsRange = "31-100", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Zeba Booking", enquiryDate = "2026-09-12", preferredDates = "September", guestsCount = 50, guestsRange = "31-100", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Faiza Booking", enquiryDate = "2026-09-14", preferredDates = "Flexible dates", guestsCount = 20, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up", notes = "not confirmed"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Shahwar Booking", enquiryDate = "2026-08-16", preferredDates = "16 Aug 2026", guestsCount = 50, guestsRange = "31-100", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Muin uddin", enquiryDate = "2026-08-15", preferredDates = "15 Aug 2026", guestsCount = 20, guestsRange = "0-30", occasion = "Family Get Together", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Farhan Booking", enquiryDate = "2026-08-15", preferredDates = "15 Aug", guestsCount = 20, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Aliza Booking", enquiryDate = "2026-08-12", preferredDates = "12 Aug 2026", guestsCount = 20, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Tasneem Khan", enquiryDate = "2026-08-10", preferredDates = "August", guestsCount = 20, guestsRange = "0-30", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Bubli Booking", enquiryDate = "2026-08-09", preferredDates = "9 Aug 2026", guestsCount = 20, guestsRange = "0-30", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Murtiza khan", enquiryDate = "2026-08-08", preferredDates = "8 Aug 2026", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Afzal 2 Booking", enquiryDate = "2026-08-08", preferredDates = "8 Aug 2026", guestsCount = 20, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Ankit Booking", enquiryDate = "2026-08-08", preferredDates = "8 Aug 2026", guestsCount = 20, guestsRange = "0-30", occasion = "Pool Party", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Som Booking", enquiryDate = "2026-08-05", preferredDates = "5 Aug 2026", guestsCount = 20, guestsRange = "0-30", occasion = "Pool Party", source = "Instagram", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "saman saud Owais", enquiryDate = "2026-08-02", preferredDates = "02 Aug 2026", guestsCount = 20, guestsRange = "0-30", occasion = "Family Get Together", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Riya Sarkar", enquiryDate = "2026-08-01", preferredDates = "01 Aug 2026", guestsCount = 25, guestsRange = "0-30", occasion = "Birthday Party", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Areeba", enquiryDate = "2026-08-01", preferredDates = "8/1/2026", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Referral", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "kahkashaul Booking", enquiryDate = "2026-08-22", preferredDates = "22 Aug", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up", notes = "No cooking"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Amul Booking", enquiryDate = "2026-08-23", preferredDates = "23 Aug 2026", guestsCount = 25, guestsRange = "0-30", occasion = "Pool Party", source = "Instagram", status = "Closed", notes = "not Allowed"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "P P Booking", enquiryDate = "2026-08-28", preferredDates = "28 Aug 2026", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Referral", status = "Follow-up"))
                    enquiryDao.insertEnquiry(EnquiryEntity(name = "Arshad Booking", enquiryDate = "2026-08-30", preferredDates = "30 Aug 2026", guestsCount = 25, guestsRange = "0-30", occasion = "Family Get Together", source = "Instagram", status = "Follow-up"))

                    // Real People & Staff
                    personDao.insertPerson(PersonEntity(name = "Ramesh Caretaker", role = "Staff", phone = "9826011223", notes = "On-site 24x7 caretaker. Key holder and farm maintenance."))
                    personDao.insertPerson(PersonEntity(name = "Imran Tent & Bhatti Services", role = "Vendor", phone = "9425044556", notes = "Supplies Bhatti, 8 hot cases, water coolers, chairs and tables for events."))
                    personDao.insertPerson(PersonEntity(name = "Saleem Electrician & Generator", role = "Vendor", phone = "9893077889", notes = "Generator diesel maintenance, pool pump and lighting."))
                    personDao.insertPerson(PersonEntity(name = "Zakir Bhai", role = "Guest Contact", phone = "9827099887", notes = "Guest organizer for Wedding Function"))

                    // Real Todos
                    todoDao.insertTodo(TodoEntity(task = "Farmhouse prep & room stay setup for Afraj 125 guests (Starts tomorrow 21 Oct)", dueDate = "2026-10-21", priority = "High", isDone = false))
                    todoDao.insertTodo(TodoEntity(task = "Confirm 20 chairs, 3 bhagone, bhatti, and 2 tables with Imran Vendor for Mansoor event", dueDate = "2026-12-20", priority = "Medium", isDone = false))
                    todoDao.insertTodo(TodoEntity(task = "Coordinate stay arrangements for Sakina booking (30-35 people stay 18 Nov)", dueDate = "2026-11-15", priority = "Medium", isDone = false))
                    todoDao.insertTodo(TodoEntity(task = "Provided 8 hot cases, bhatti, and 4 water coolers for Zakir Bhai event", dueDate = "2026-10-02", priority = "High", isDone = true))

                    // Real Expenses
                    expenseDao.insertExpense(ExpenseEntity(date = "2026-10-05", category = "Staff", amount = 12000.0, paidTo = "Ramesh Caretaker", notes = "Monthly caretaker salary for October"))
                    expenseDao.insertExpense(ExpenseEntity(date = "2026-10-10", category = "Maintenance", amount = 3500.0, paidTo = "Bhopal Pool Care", notes = "Pool chlorine treatment and pump filter cleaning"))
                    expenseDao.insertExpense(ExpenseEntity(date = "2026-10-18", category = "Utilities", amount = 4200.0, paidTo = "Indian Oil Bairagarh", notes = "Diesel refilling for backup generator"))
                }
            }
        }
    }
}
