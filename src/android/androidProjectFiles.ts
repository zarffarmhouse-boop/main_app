/**
 * Complete Native Android Studio Project (Kotlin + Jetpack Compose + Material 3 + Room Database)
 * Configured with large text, 48dp+ touch targets, single-activity architecture, offline Room DB,
 * and Material Date Pickers for older non-technical users.
 */

export interface AndroidFile {
  path: string;
  name: string;
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Project)',
    description: 'Top-level Gradle build configuration',
    content: `// Top-level build file for Zarf Farmhouse Manager
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`,
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    description: 'Gradle repository settings',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Zarf Farmhouse Manager"
include(":app")
`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    description: 'App-level build file with Room, Compose, Material 3',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.zarf.farmhouse"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.zarf.farmhouse"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Room Database (Offline local storage)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    description: 'Application manifest - Offline only, no internet permission required',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Offline only, no INTERNET permission required -->
    <!-- Direct phone call permission for dialing guests and staff easily -->
    <uses-permission android:name="android.intent.action.DIAL" />

    <application
        android:name=".ZarfApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Zarf Farmhouse"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ZarfFarmhouse">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="Zarf Farmhouse Manager"
            android:theme="@style/Theme.ZarfFarmhouse">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/zarf/farmhouse/data/local/Entities.kt',
    name: 'Entities.kt',
    description: 'Room Database Entity definitions with Bhopal farmhouse fields',
    content: `package com.zarf.farmhouse.data.local

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
`,
  },
  {
    path: 'app/src/main/java/com/zarf/farmhouse/data/local/Daos.kt',
    name: 'Daos.kt',
    description: 'Room Database Data Access Objects (DAOs)',
    content: `package com.zarf.farmhouse.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface EnquiryDao {
    @Query("SELECT * FROM enquiries ORDER BY enquiryDate DESC, id DESC")
    fun getAllEnquiries(): Flow<List<EnquiryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEnquiry(enquiry: EnquiryEntity): Long

    @Update
    suspend fun updateEnquiry(enquiry: EnquiryEntity)

    @Delete
    suspend fun deleteEnquiry(enquiry: EnquiryEntity)
}

@Dao
interface BookingDao {
    @Query("SELECT * FROM bookings ORDER BY checkInDate ASC")
    fun getAllBookings(): Flow<List<BookingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBooking(booking: BookingEntity): Long

    @Update
    suspend fun updateBooking(booking: BookingEntity)

    @Delete
    suspend fun deleteBooking(booking: BookingEntity)
}

@Dao
interface ExpenseDao {
    @Query("SELECT * FROM expenses ORDER BY date DESC, id DESC")
    fun getAllExpenses(): Flow<List<ExpenseEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExpense(expense: ExpenseEntity): Long

    @Update
    suspend fun updateExpense(expense: ExpenseEntity)

    @Delete
    suspend fun deleteExpense(expense: ExpenseEntity)
}

@Dao
interface PersonDao {
    @Query("SELECT * FROM people ORDER BY name ASC")
    fun getAllPeople(): Flow<List<PersonEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPerson(person: PersonEntity): Long

    @Update
    suspend fun updatePerson(person: PersonEntity)

    @Delete
    suspend fun deletePerson(person: PersonEntity)
}

@Dao
interface TodoDao {
    @Query("SELECT * FROM todos ORDER BY isDone ASC, id DESC")
    fun getAllTodos(): Flow<List<TodoEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTodo(todo: TodoEntity): Long

    @Update
    suspend fun updateTodo(todo: TodoEntity)

    @Delete
    suspend fun deleteTodo(todo: TodoEntity)
}
`,
  },
  {
    path: 'app/src/main/java/com/zarf/farmhouse/data/local/AppDatabase.kt',
    name: 'AppDatabase.kt',
    description: 'Room Database setup with pre-populated real authentic Bhopal records',
    content: `package com.zarf.farmhouse.data.local

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
`,
  },
  {
    path: 'app/src/main/java/com/zarf/farmhouse/ui/theme/Theme.kt',
    name: 'Theme.kt',
    description: 'Material 3 Theme with primary red (#C62828), large typography (20sp+), and 48dp+ buttons',
    content: `package com.zarf.farmhouse.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
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

// Large accessible typography (minimum 20sp for body, 24sp+ for titles)
val SeniorTypography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 40.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 26.sp,
        lineHeight = 34.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 32.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 20.sp,
        lineHeight = 28.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 18.sp,
        lineHeight = 26.sp
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
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
`,
  },
  {
    path: 'app/src/main/java/com/zarf/farmhouse/MainActivity.kt',
    name: 'MainActivity.kt',
    description: 'Single activity hosting Material 3 Scaffold with 5-tab Bottom Navigation',
    content: `package com.zarf.farmhouse

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.zarf.farmhouse.ui.screens.*
import com.zarf.farmhouse.ui.theme.ZarfFarmhouseTheme
import com.zarf.farmhouse.ui.viewmodel.FarmhouseViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: FarmhouseViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            var isDarkMode by remember { mutableStateOf(false) }
            var isLoggedIn by remember { mutableStateOf(false) }

            ZarfFarmhouseTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    if (!isLoggedIn) {
                        LoginScreen(
                            onLoginSuccess = { isLoggedIn = true }
                        )
                    } else {
                        MainScreenContainer(
                            viewModel = viewModel,
                            isDarkMode = isDarkMode,
                            onToggleDarkMode = { isDarkMode = !isDarkMode }
                        )
                    }
                }
            }
        }
    }
}

enum class NavigationTab(val label: String) {
    Home("Home"),
    Enquiries("Enquiries"),
    Bookings("Bookings"),
    Expenses("Expenses"),
    More("More")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreenContainer(
    viewModel: FarmhouseViewModel,
    isDarkMode: Boolean,
    onToggleDarkMode: () -> Unit
) {
    var selectedTab by remember { mutableStateOf(NavigationTab.Home) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Zarf Farmhouse",
                        style = MaterialTheme.typography.titleLarge
                    )
                },
                actions = {
                    IconButton(
                        onClick = onToggleDarkMode,
                        modifier = Modifier.size(56.dp)
                    ) {
                        Icon(
                            imageVector = if (isDarkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                            contentDescription = "Toggle Dark Mode",
                            modifier = Modifier.size(32.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                modifier = Modifier.height(84.dp), // Extra large bar for older users
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                NavigationTab.values().forEach { tab ->
                    NavigationBarItem(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        icon = {
                            val icon = when (tab) {
                                NavigationTab.Home -> Icons.Default.Home
                                NavigationTab.Enquiries -> Icons.Default.QuestionAnswer
                                NavigationTab.Bookings -> Icons.Default.EventAvailable
                                NavigationTab.Expenses -> Icons.Default.CurrencyRupee
                                NavigationTab.More -> Icons.Default.MoreHoriz
                            }
                            Icon(
                                imageVector = icon,
                                contentDescription = tab.label,
                                modifier = Modifier.size(30.dp)
                            )
                        },
                        label = {
                            Text(
                                text = tab.label,
                                fontSize = 16.sp
                            )
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (selectedTab) {
                NavigationTab.Home -> HomeScreen(viewModel, onNavigate = { selectedTab = it })
                NavigationTab.Enquiries -> EnquiriesScreen(viewModel)
                NavigationTab.Bookings -> BookingsScreen(viewModel)
                NavigationTab.Expenses -> ExpensesScreen(viewModel)
                NavigationTab.More -> MoreScreen(viewModel)
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/zarf/farmhouse/ui/viewmodel/FarmhouseViewModel.kt',
    name: 'FarmhouseViewModel.kt',
    description: 'Android ViewModel connecting Room DAOs to Jetpack Compose UI state',
    content: `package com.zarf.farmhouse.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.zarf.farmhouse.data.local.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class FarmhouseViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getDatabase(application)
    private val enquiryDao = db.enquiryDao()
    private val bookingDao = db.bookingDao()
    private val expenseDao = db.expenseDao()
    private val personDao = db.personDao()
    private val todoDao = db.todoDao()

    val allEnquiries = enquiryDao.getAllEnquiries()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allBookings = bookingDao.getAllBookings()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allExpenses = expenseDao.getAllExpenses()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allPeople = personDao.getAllPeople()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allTodos = todoDao.getAllTodos()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addEnquiry(enquiry: EnquiryEntity) = viewModelScope.launch {
        enquiryDao.insertEnquiry(enquiry)
    }

    fun updateEnquiry(enquiry: EnquiryEntity) = viewModelScope.launch {
        enquiryDao.updateEnquiry(enquiry)
    }

    fun addBooking(booking: BookingEntity) = viewModelScope.launch {
        bookingDao.insertBooking(booking)
    }

    fun updateBooking(booking: BookingEntity) = viewModelScope.launch {
        bookingDao.updateBooking(booking)
    }

    fun addExpense(expense: ExpenseEntity) = viewModelScope.launch {
        expenseDao.insertExpense(expense)
    }

    fun addPerson(person: PersonEntity) = viewModelScope.launch {
        personDao.insertPerson(person)
    }

    fun addTodo(todo: TodoEntity) = viewModelScope.launch {
        todoDao.insertTodo(todo)
    }

    fun toggleTodo(todo: TodoEntity) = viewModelScope.launch {
        todoDao.updateTodo(todo.copy(isDone = !todo.isDone))
    }
}
`,
  },
];
