import React from 'react';
import { Booking, Enquiry, Expense, Todo, NavigationTab } from '../types/index.ts';
import {
  formatCurrency,
  formatFriendlyDate,
  getDashboardSummary,
  getUpcomingBookings,
  getTodayDateString,
} from '../utils/calculations.ts';
import {
  MessageSquareQuote,
  CalendarCheck2,
  IndianRupee,
  CheckSquare,
  Plus,
  Phone,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HomeScreenProps {
  enquiries: Enquiry[];
  bookings: Booking[];
  expenses: Expense[];
  todos: Todo[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickAdd: (type: 'enquiry' | 'booking' | 'expense' | 'todo') => void;
  onSelectBooking: (booking: Booking) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  enquiries,
  bookings,
  expenses,
  todos,
  onNavigate,
  onOpenQuickAdd,
  onSelectBooking,
}) => {
  const summary = getDashboardSummary(enquiries, bookings, expenses, todos);
  const upcomingBookings = getUpcomingBookings(bookings, getTodayDateString(), 7);

  return (
    <div className="space-y-6 pb-24 text-stone-900 dark:text-stone-100">
      {/* Welcome Banner - Clean Pure White with thin red accent bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#C62828]" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <p className="text-stone-600 dark:text-stone-400 text-lg font-medium mt-1">
              Today is {formatFriendlyDate(getTodayDateString())}
            </p>
          </div>
         
        </div>
      </div>

      {/* Four Simple Summary Cards */}
      <div>
        <div className="mb-3">
          <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Overview
          </h3>
          <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Open Enquiries */}
          <div
            onClick={() => onNavigate('enquiries')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('enquiries')}
            className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#C62828] dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900">
                <MessageSquareQuote className="w-8 h-8" />
              </div>
              <div>
                <p className="text-stone-600 dark:text-stone-400 text-base font-bold">
                  Open Enquiries
                </p>
                <p className="text-3xl font-black text-[#C62828] dark:text-red-400">
                  {summary.openEnquiries}
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-stone-400" />
          </div>

          {/* 2. Confirmed Bookings */}
          <div
            onClick={() => onNavigate('bookings')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('bookings')}
            className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#C62828] dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900">
                <CalendarCheck2 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-stone-600 dark:text-stone-400 text-base font-bold">
                  Confirmed Bookings
                </p>
                <p className="text-3xl font-black text-stone-900 dark:text-white">
                  {summary.confirmedBookingsThisMonth}
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-stone-400" />
          </div>

          {/* 3. Total Expenses */}
          <div
            onClick={() => onNavigate('expenses')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('expenses')}
            className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                <IndianRupee className="w-8 h-8" />
              </div>
              <div>
                <p className="text-stone-600 dark:text-stone-400 text-base font-bold">
                  Total Expenses
                </p>
                <p className="text-2xl font-black text-stone-900 dark:text-white">
                  {formatCurrency(summary.totalExpensesThisMonth)}
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-stone-400" />
          </div>

          {/* 4. Pending To-Dos */}
          <div
            onClick={() => onNavigate('more')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('more')}
            className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                <CheckSquare className="w-8 h-8" />
              </div>
              <div>
                <p className="text-stone-600 dark:text-stone-400 text-base font-bold">
                  Pending To-Dos
                </p>
                <p className="text-3xl font-black text-stone-900 dark:text-white">
                  {summary.pendingTodos}
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-stone-400" />
          </div>
        </div>
      </div>

      {/* Four Quick Actions */}
      <div>
        <div className="mb-3">
          <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Quick Add
          </h3>
          <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onOpenQuickAdd('enquiry')}
            className="p-4 bg-[#C62828] hover:bg-red-800 active:scale-95 text-white rounded-2xl font-black text-xl shadow-sm flex flex-col items-center justify-center gap-2 min-h-[84px] transition-all"
          >
            <Plus className="w-7 h-7" />
            <span>+ Enquiry</span>
          </button>

          <button
            onClick={() => onOpenQuickAdd('booking')}
            className="p-4 bg-white dark:bg-stone-900 hover:bg-red-50 dark:hover:bg-red-950/40 border-2 border-[#C62828] text-[#C62828] dark:text-red-400 active:scale-95 rounded-2xl font-black text-xl shadow-xs flex flex-col items-center justify-center gap-2 min-h-[84px] transition-all"
          >
            <Plus className="w-7 h-7" />
            <span>+ Booking</span>
          </button>

          <button
            onClick={() => onOpenQuickAdd('expense')}
            className="p-4 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 active:scale-95 rounded-2xl font-black text-xl shadow-xs flex flex-col items-center justify-center gap-2 min-h-[84px] transition-all"
          >
            <Plus className="w-7 h-7" />
            <span>+ Expense</span>
          </button>

          <button
            onClick={() => onOpenQuickAdd('todo')}
            className="p-4 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 active:scale-95 rounded-2xl font-black text-xl shadow-xs flex flex-col items-center justify-center gap-2 min-h-[84px] transition-all"
          >
            <Plus className="w-7 h-7" />
            <span>+ To-Do</span>
          </button>
        </div>
      </div>

      {/* Upcoming Bookings (Next 7 Days) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
              Upcoming Bookings (Next 7 Days)
            </h3>
            <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
          </div>
          {upcomingBookings.length > 0 && (
            <span className="text-lg font-bold text-[#C62828] dark:text-red-400">
              {upcomingBookings.length} Scheduled
            </span>
          )}
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 text-center shadow-xs">
            <Calendar className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
            <p className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-1">
              No upcoming bookings
            </p>
            <p className="text-lg text-stone-500 mb-6 font-medium">
              Ready for real guest records. Add your first confirmed booking when ready.
            </p>
            <button
              onClick={() => onOpenQuickAdd('booking')}
              className="py-3.5 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-xl font-black shadow-sm inline-flex items-center gap-2 min-h-[52px] active:scale-95"
            >
              <Plus className="w-6 h-6" />
              Add First Booking
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectBooking(b)}
                className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-2xl font-black text-stone-900 dark:text-white">
                      {b.guestName}
                    </h4>
                    <p className="text-lg font-bold text-[#C62828] dark:text-red-400 flex items-center gap-2 mt-1">
                      <Calendar className="w-5 h-5" />
                      Check-in: {formatFriendlyDate(b.checkInDate)}
                      {b.checkOutDate && ` to ${formatFriendlyDate(b.checkOutDate)}`}
                    </p>
                    {(b.occasion || b.source || b.guestsRange) && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {b.occasion && (
                          <span className="px-2.5 py-0.5 rounded-lg text-sm font-bold bg-red-50 text-[#C62828] border border-red-200 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800">
                            {b.occasion}
                          </span>
                        )}
                        {b.source && (
                          <span className="px-2.5 py-0.5 rounded-lg text-sm font-bold bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700">
                            via {b.source}
                          </span>
                        )}
                        {b.guestsRange && (
                          <span className="px-2.5 py-0.5 rounded-lg text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                            {b.guestsRange} Guests
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-base font-black border ${
                        b.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                          : b.paymentStatus === 'Partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {b.paymentStatus}
                    </span>
                    <span className="text-2xl font-black text-stone-900 dark:text-white">
                      {formatCurrency(b.amount)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-base font-semibold gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-5 h-5 text-stone-500" />
                      {b.guestsCount} Guests
                    </span>
                    {b.notes && (
                      <span className="text-stone-500 truncate max-w-xs font-normal">
                        {b.notes}
                      </span>
                    )}
                  </div>

                  {b.phone && (
                    <a
                      href={`tel:${b.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950 text-stone-800 dark:text-stone-200 rounded-xl text-base font-bold flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Phone className="w-4 h-4 text-[#C62828]" />
                      Call {b.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
