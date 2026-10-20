import React, { useState, useEffect } from 'react';
import {
  Booking,
  Enquiry,
  EnquiryStatus,
  Expense,
  NavigationTab,
  Person,
  Todo,
} from './types/index.ts';
import { FarmhouseStorage } from './db/storage.ts';
import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { EnquiriesScreen } from './screens/EnquiriesScreen.tsx';
import { BookingsScreen } from './screens/BookingsScreen.tsx';
import { ExpensesScreen } from './screens/ExpensesScreen.tsx';
import { MoreScreen } from './screens/MoreScreen.tsx';
import { LoginScreen } from './screens/LoginScreen.tsx';

import { EnquiryModal } from './components/EnquiryModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { ExpenseModal } from './components/ExpenseModal.tsx';
import { PersonModal } from './components/PersonModal.tsx';
import { TodoModal } from './components/TodoModal.tsx';
import { AndroidProjectModal } from './components/AndroidProjectModal.tsx';

export default function App() {
  // App state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in by default for preview, can lock anytime
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => FarmhouseStorage.getDarkMode());
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(() => FarmhouseStorage.getDeviceFrame());
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  // Database State (Room DB replica)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  // Modals state
  const [enquiryModal, setEnquiryModal] = useState<{ isOpen: boolean; item: Enquiry | null }>({
    isOpen: false,
    item: null,
  });
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; item: Booking | null }>({
    isOpen: false,
    item: null,
  });
  const [expenseModal, setExpenseModal] = useState<{ isOpen: boolean; item: Expense | null }>({
    isOpen: false,
    item: null,
  });
  const [personModal, setPersonModal] = useState<{ isOpen: boolean; item: Person | null }>({
    isOpen: false,
    item: null,
  });
  const [todoModal, setTodoModal] = useState<{ isOpen: boolean; item: Todo | null }>({
    isOpen: false,
    item: null,
  });
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);

  // Load data on mount
  const loadData = () => {
    setEnquiries(FarmhouseStorage.getEnquiries());
    setBookings(FarmhouseStorage.getBookings());
    setExpenses(FarmhouseStorage.getExpenses());
    setPeople(FarmhouseStorage.getPeople());
    setTodos(FarmhouseStorage.getTodos());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync dark mode class to html document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    FarmhouseStorage.saveDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Handle dark mode toggle
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Handle device frame toggle
  const handleToggleDeviceFrame = () => {
    setIsDeviceFrame((prev) => {
      const next = !prev;
      FarmhouseStorage.saveDeviceFrame(next);
      return next;
    });
  };

  // --- Enquiry Handlers ---
  const handleSaveEnquiry = (enquiry: Enquiry) => {
    let updated: Enquiry[];
    const exists = enquiries.some((e) => e.id === enquiry.id);
    if (exists) {
      updated = enquiries.map((e) => (e.id === enquiry.id ? enquiry : e));
    } else {
      updated = [enquiry, ...enquiries];
    }
    setEnquiries(updated);
    FarmhouseStorage.saveEnquiries(updated);
  };

  const handleDeleteEnquiry = (id: string) => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    FarmhouseStorage.saveEnquiries(updated);
  };

  const handleQuickUpdateStatus = (id: string, newStatus: EnquiryStatus) => {
    const updated = enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e));
    setEnquiries(updated);
    FarmhouseStorage.saveEnquiries(updated);
  };

  // --- Booking Handlers ---
  const handleSaveBooking = (booking: Booking) => {
    let updated: Booking[];
    const exists = bookings.some((b) => b.id === booking.id);
    if (exists) {
      updated = bookings.map((b) => (b.id === booking.id ? booking : b));
    } else {
      updated = [...bookings, booking];
    }
    setBookings(updated);
    FarmhouseStorage.saveBookings(updated);
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    FarmhouseStorage.saveBookings(updated);
  };

  // --- Expense Handlers ---
  const handleSaveExpense = (expense: Expense) => {
    let updated: Expense[];
    const exists = expenses.some((e) => e.id === expense.id);
    if (exists) {
      updated = expenses.map((e) => (e.id === expense.id ? expense : e));
    } else {
      updated = [expense, ...expenses];
    }
    setExpenses(updated);
    FarmhouseStorage.saveExpenses(updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    FarmhouseStorage.saveExpenses(updated);
  };

  // --- Person Handlers ---
  const handleSavePerson = (person: Person) => {
    let updated: Person[];
    const exists = people.some((p) => p.id === person.id);
    if (exists) {
      updated = people.map((p) => (p.id === person.id ? person : p));
    } else {
      updated = [...people, person];
    }
    setPeople(updated);
    FarmhouseStorage.savePeople(updated);
  };

  const handleDeletePerson = (id: string) => {
    const updated = people.filter((p) => p.id !== id);
    setPeople(updated);
    FarmhouseStorage.savePeople(updated);
  };

  // --- Todo Handlers ---
  const handleSaveTodo = (todo: Todo) => {
    let updated: Todo[];
    const exists = todos.some((t) => t.id === todo.id);
    if (exists) {
      updated = todos.map((t) => (t.id === todo.id ? todo : t));
    } else {
      updated = [todo, ...todos];
    }
    setTodos(updated);
    FarmhouseStorage.saveTodos(updated);
  };

  const handleToggleTodo = (todo: Todo) => {
    const updated = todos.map((t) =>
      t.id === todo.id ? { ...t, isDone: !t.isDone } : t
    );
    setTodos(updated);
    FarmhouseStorage.saveTodos(updated);
  };

  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    FarmhouseStorage.saveTodos(updated);
  };

  // Quick action from Home screen
  const handleOpenQuickAdd = (type: 'enquiry' | 'booking' | 'expense' | 'todo') => {
    if (type === 'enquiry') setEnquiryModal({ isOpen: true, item: null });
    if (type === 'booking') setBookingModal({ isOpen: true, item: null });
    if (type === 'expense') setExpenseModal({ isOpen: true, item: null });
    if (type === 'todo') setTodoModal({ isOpen: true, item: null });
  };

  // If not logged in, render single-user login PIN screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        storedPin={FarmhouseStorage.getPinCode()}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  const openEnquiriesCount = enquiries.filter(
    (e) => e.status === 'New' || e.status === 'Follow-up'
  ).length;
  const pendingTodosCount = todos.filter((t) => !t.isDone).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-stone-100 dark:bg-stone-950 flex flex-col items-center selection:bg-red-200`}>
      {/* Container wrapper: either full width or Android Phone frame */}
      <div
        className={`w-full flex-1 flex flex-col bg-stone-50 dark:bg-stone-950 transition-all ${
          isDeviceFrame
            ? 'max-w-md my-4 rounded-[42px] border-[10px] border-stone-800 dark:border-stone-700 shadow-2xl overflow-hidden min-h-[844px]'
            : 'max-w-4xl shadow-md border-x border-stone-200 dark:border-stone-800'
        }`}
      >
        {/* Android status bar mock if in frame */}
        {isDeviceFrame && (
          <div className="bg-[#B71C1C] text-white px-6 pt-2 pb-1 text-xs font-bold flex justify-between items-center select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          title="Zarf Farmhouse"
          subtitle="Bhopal Manager"
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onLockApp={() => setIsLoggedIn(false)}
          isDeviceFrame={isDeviceFrame}
          onToggleDeviceFrame={handleToggleDeviceFrame}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen
              enquiries={enquiries}
              bookings={bookings}
              expenses={expenses}
              todos={todos}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenQuickAdd={handleOpenQuickAdd}
              onSelectBooking={(b) => setBookingModal({ isOpen: true, item: b })}
            />
          )}

          {activeTab === 'enquiries' && (
            <EnquiriesScreen
              enquiries={enquiries}
              onAddEnquiry={() => setEnquiryModal({ isOpen: true, item: null })}
              onEditEnquiry={(enq) => setEnquiryModal({ isOpen: true, item: enq })}
              onQuickUpdateStatus={handleQuickUpdateStatus}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsScreen
              bookings={bookings}
              onAddBooking={() => setBookingModal({ isOpen: true, item: null })}
              onEditBooking={(b) => setBookingModal({ isOpen: true, item: b })}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesScreen
              expenses={expenses}
              onAddExpense={() => setExpenseModal({ isOpen: true, item: null })}
              onEditExpense={(exp) => setExpenseModal({ isOpen: true, item: exp })}
            />
          )}

          {activeTab === 'more' && (
            <MoreScreen
              people={people}
              todos={todos}
              onAddPerson={() => setPersonModal({ isOpen: true, item: null })}
              onEditPerson={(p) => setPersonModal({ isOpen: true, item: p })}
              onAddTodo={() => setTodoModal({ isOpen: true, item: null })}
              onEditTodo={(t) => setTodoModal({ isOpen: true, item: t })}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
              onReloadAllData={loadData}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          openEnquiriesCount={openEnquiriesCount}
          pendingTodosCount={pendingTodosCount}
        />
      </div>

      {/* Modals */}
      <EnquiryModal
        isOpen={enquiryModal.isOpen}
        enquiry={enquiryModal.item}
        onSave={handleSaveEnquiry}
        onDelete={handleDeleteEnquiry}
        onClose={() => setEnquiryModal({ isOpen: false, item: null })}
      />

      <BookingModal
        isOpen={bookingModal.isOpen}
        booking={bookingModal.item}
        onSave={handleSaveBooking}
        onDelete={handleDeleteBooking}
        onClose={() => setBookingModal({ isOpen: false, item: null })}
      />

      <ExpenseModal
        isOpen={expenseModal.isOpen}
        expense={expenseModal.item}
        peopleList={people}
        onSave={handleSaveExpense}
        onDelete={handleDeleteExpense}
        onClose={() => setExpenseModal({ isOpen: false, item: null })}
      />

      <PersonModal
        isOpen={personModal.isOpen}
        person={personModal.item}
        onSave={handleSavePerson}
        onDelete={handleDeletePerson}
        onClose={() => setPersonModal({ isOpen: false, item: null })}
      />

      <TodoModal
        isOpen={todoModal.isOpen}
        todo={todoModal.item}
        onSave={handleSaveTodo}
        onDelete={handleDeleteTodo}
        onClose={() => setTodoModal({ isOpen: false, item: null })}
      />

      <AndroidProjectModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />
    </div>
  );
}
