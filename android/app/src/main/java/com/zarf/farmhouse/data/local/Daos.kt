package com.zarf.farmhouse.data.local

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
    @Query("SELECT * FROM todos ORDER BY isDone ASC, createdAt DESC")
    fun getAllTodos(): Flow<List<TodoEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTodo(todo: TodoEntity): Long

    @Update
    suspend fun updateTodo(todo: TodoEntity)

    @Delete
    suspend fun deleteTodo(todo: TodoEntity)
}
