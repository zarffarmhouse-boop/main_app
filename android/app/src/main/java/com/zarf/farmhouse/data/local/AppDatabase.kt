package com.zarf.farmhouse.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.zarf.farmhouse.data.seed.CsvLeadSeeder
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
    version = 3,
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
                    .fallbackToDestructiveMigration()
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
                    CsvLeadSeeder.seed(
                        database.enquiryDao(),
                        database.bookingDao()
                    )
                }
            }
        }
    }
}
