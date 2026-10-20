package com.zarf.farmhouse.ui.viewmodel

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

    fun deleteEnquiry(enquiry: EnquiryEntity) = viewModelScope.launch {
        enquiryDao.deleteEnquiry(enquiry)
    }

    fun addBooking(booking: BookingEntity) = viewModelScope.launch {
        bookingDao.insertBooking(booking)
    }

    fun updateBooking(booking: BookingEntity) = viewModelScope.launch {
        bookingDao.updateBooking(booking)
    }

    fun deleteBooking(booking: BookingEntity) = viewModelScope.launch {
        bookingDao.deleteBooking(booking)
    }

    fun addExpense(expense: ExpenseEntity) = viewModelScope.launch {
        expenseDao.insertExpense(expense)
    }

    fun updateExpense(expense: ExpenseEntity) = viewModelScope.launch {
        expenseDao.updateExpense(expense)
    }

    fun deleteExpense(expense: ExpenseEntity) = viewModelScope.launch {
        expenseDao.deleteExpense(expense)
    }

    fun addPerson(person: PersonEntity) = viewModelScope.launch {
        personDao.insertPerson(person)
    }

    fun updatePerson(person: PersonEntity) = viewModelScope.launch {
        personDao.updatePerson(person)
    }

    fun deletePerson(person: PersonEntity) = viewModelScope.launch {
        personDao.deletePerson(person)
    }

    fun addTodo(todo: TodoEntity) = viewModelScope.launch {
        todoDao.insertTodo(todo)
    }

    fun toggleTodo(todo: TodoEntity) = viewModelScope.launch {
        todoDao.updateTodo(todo.copy(isDone = !todo.isDone))
    }

    fun deleteTodo(todo: TodoEntity) = viewModelScope.launch {
        todoDao.deleteTodo(todo)
    }
}
