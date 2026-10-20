import React from 'react';
import { Booking } from '../types/index.ts';
import {
  formatCurrency,
  formatFriendlyDate,
} from '../utils/calculations.ts';
import {
  CalendarCheck2,
  Plus,
  Phone,
  Calendar,
  Users,
  FileText,
} from 'lucide-react';

interface BookingsScreenProps {
  bookings: Booking[];
  onAddBooking: () => void;
  onEditBooking: (booking: Booking) => void;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  bookings,
  onAddBooking,
  onEditBooking,
}) => {
  const sortedBookings = [...bookings].sort((a, b) =>
    (a.checkInDate || '').localeCompare(b.checkInDate || '')
  );

  // Quiet, small list total
  const totalAmount = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  return (
    <div className="space-y-5 pb-24 text-stone-900 dark:text-stone-100">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
            Confirmed Bookings
          </h2>
          <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
          <p className="text-base sm:text-lg font-bold text-stone-600 dark:text-stone-400 mt-1">
            {bookings.length} booking{bookings.length === 1 ? '' : 's'} recorded
            {bookings.length > 0 && (
              <span className="text-stone-500 font-semibold ml-2">
                • Total: <strong className="text-[#C62828] dark:text-red-400">{formatCurrency(totalAmount)}</strong>
              </span>
            )}
          </p>
        </div>

        <button
          onClick={onAddBooking}
          className="py-3 px-6 bg-[#C62828] hover:bg-red-800 active:scale-95 text-white rounded-xl text-xl font-black shadow-sm flex items-center justify-center gap-2 min-h-[52px] transition-all"
        >
          <Plus className="w-6 h-6" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Bookings List */}
      {sortedBookings.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 text-center shadow-xs">
          <CalendarCheck2 className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <p className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-1">
            No bookings recorded yet
          </p>
          <p className="text-lg text-stone-500 mb-6 font-medium">
            The database is clean and ready. Add your real farmhouse bookings.
          </p>
          <button
            onClick={onAddBooking}
            className="py-3.5 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-xl font-black shadow-sm inline-flex items-center gap-2 min-h-[52px] active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Add First Booking
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBookings.map((b) => (
            <div
              key={b.id}
              onClick={() => onEditBooking(b)}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                    {b.guestName}
                  </h3>
                  <div className="text-lg font-bold text-[#C62828] dark:text-red-400 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {formatFriendlyDate(b.checkInDate)}
                      {b.checkOutDate && ` to ${formatFriendlyDate(b.checkOutDate)}`}
                    </span>
                  </div>
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

              <div className="flex flex-wrap items-center justify-between gap-2 my-2 text-base">
                <div className="font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>{b.guestsCount} Guests</span>
                </div>
                {b.notes && (
                  <div className="w-full mt-1 p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-base font-medium text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>{b.notes}</span>
                  </div>
                )}
              </div>

              {/* Call Action & Edit Hint */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-sm font-bold text-[#C62828] dark:text-red-400 underline">
                  Tap to edit
                </span>
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
  );
};
