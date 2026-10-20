import React, { useState, useEffect } from 'react';
import { Booking, GuestsRange, LeadSource, OccasionType, PaymentStatus } from '../types/index.ts';
import { getTodayDateString } from '../utils/calculations.ts';
import { DatePickerModal } from './DatePickerModal.tsx';
import {
  Calendar,
  Check,
  X,
  Phone,
  User,
  Users,
  IndianRupee,
  FileText,
  Trash2,
  Tag,
  Share2,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  booking?: Booking | null;
  onSave: (booking: Booking) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  booking,
  onSave,
  onDelete,
  onClose,
}) => {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState(getTodayDateString());
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestsCount, setGuestsCount] = useState<number>(15);
  const [guestsRange, setGuestsRange] = useState<GuestsRange | ''>('0-30');
  const [occasion, setOccasion] = useState<string>('Family Get Together');
  const [source, setSource] = useState<string>('Instagram');
  const [amount, setAmount] = useState<number>(30000);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [notes, setNotes] = useState('');

  const [datePickerTarget, setDatePickerTarget] = useState<'checkIn' | 'checkOut' | null>(null);
  const [errors, setErrors] = useState<{ guestName?: string; dates?: string }>({});

  useEffect(() => {
    if (booking) {
      setGuestName(booking.guestName || '');
      setPhone(booking.phone || '');
      setCheckInDate(booking.checkInDate || getTodayDateString());
      setCheckOutDate(booking.checkOutDate || '');
      setGuestsCount(booking.guestsCount || 15);
      setGuestsRange(booking.guestsRange || '0-30');
      setOccasion(booking.occasion || 'Family Get Together');
      setSource(booking.source || 'Instagram');
      setAmount(booking.amount || 30000);
      setPaymentStatus(booking.paymentStatus || 'Paid');
      setNotes(booking.notes || '');
    } else {
      const today = getTodayDateString();
      setGuestName('');
      setPhone('');
      setCheckInDate(today);

      const d = new Date(today + 'T00:00:00');
      d.setDate(d.getDate() + 1);
      const nextDayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      setCheckOutDate(nextDayStr);

      setGuestsCount(15);
      setGuestsRange('0-30');
      setOccasion('Family Get Together');
      setSource('Instagram');
      setAmount(30000);
      setPaymentStatus('Pending');
      setNotes('');
    }
    setErrors({});
  }, [booking, isOpen]);

  if (!isOpen) return null;

  const paymentPresets: PaymentStatus[] = ['Pending', 'Partial', 'Paid'];
  const occasionPresets: OccasionType[] = [
    'Family Get Together',
    'Wedding Function',
    'Birthday Party',
    'Pool Party',
    'Other',
  ];
  const sourcePresets: LeadSource[] = ['Instagram', 'Referral', 'Maps', 'Event Planner', 'Other'];
  const guestsRangePresets: GuestsRange[] = ['0-30', '31-100', '100-250', '250+'];
  const guestPresets = [10, 15, 20, 25, 30, 50, 100, 150];
  const amountPresets = [15000, 25000, 30000, 35000, 45000, 50000, 65000];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { guestName?: string; dates?: string } = {};

    if (!guestName.trim()) {
      newErrors.guestName = 'Please enter guest name';
    }
    if (checkOutDate && checkInDate && checkOutDate < checkInDate) {
      newErrors.dates = 'Check-out date cannot be earlier than check-in';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Booking = {
      id: booking?.id || `bk-${Date.now()}`,
      guestName: guestName.trim(),
      phone: phone.trim(),
      checkInDate,
      checkOutDate: checkOutDate || checkInDate,
      guestsCount: Number(guestsCount) || 15,
      guestsRange: guestsRange || undefined,
      occasion: occasion.trim() || undefined,
      source: source.trim() || undefined,
      amount: Number(amount) || 0,
      paymentStatus,
      notes: notes.trim(),
      createdAt: booking?.createdAt || Date.now(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      >
        <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl shadow-2xl border-2 border-stone-300 dark:border-stone-700 flex flex-col my-auto max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#C62828] dark:bg-red-950 text-white p-5 flex items-center justify-between shrink-0">
            <div>
              <h2 id="booking-modal-title" className="text-2xl sm:text-3xl font-black">
                {booking ? 'Edit Confirmed Booking' : 'New Confirmed Booking'}
              </h2>
              <p className="text-red-100 text-lg font-medium">Zarf Farmhouse, Bhopal</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close form"
              className="p-2 text-white hover:bg-red-800 rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSave}
            className="p-5 overflow-y-auto space-y-5 flex-1 text-stone-900 dark:text-stone-100"
          >
            {/* Payment Status Chips */}
            <div>
              <span className="block text-xl font-black mb-2">Payment Status *</span>
              <div className="grid grid-cols-3 gap-2">
                {paymentPresets.map((st) => {
                  const isSelected = paymentStatus === st;
                  const colorClass =
                    st === 'Paid'
                      ? 'bg-emerald-600 text-white'
                      : st === 'Partial'
                      ? 'bg-amber-600 text-white'
                      : 'bg-[#C62828] text-white';

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPaymentStatus(st)}
                      className={`min-h-[52px] rounded-2xl text-xl font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
                        isSelected
                          ? `${colorClass} shadow-md ring-4 ring-red-200 dark:ring-red-900 border-transparent`
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected && <Check className="w-5 h-5" />}
                      <span>{st}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Name */}
            <div>
              <label
                htmlFor="bk-name"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <User className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Guest / Booking Name *
              </label>
              <input
                id="bk-name"
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  if (errors.guestName) setErrors({ ...errors, guestName: undefined });
                }}
                placeholder="e.g. Zakir Bhai or Afraj Booking"
                className={`w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 bg-stone-50 dark:bg-stone-800 font-bold ${
                  errors.guestName
                    ? 'border-red-600 focus:ring-4 focus:ring-red-200'
                    : 'border-stone-300 dark:border-stone-700 focus:border-[#C62828]'
                }`}
              />
              {errors.guestName && (
                <p className="text-red-600 font-bold text-lg mt-1">{errors.guestName}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label
                htmlFor="bk-phone"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <Phone className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Phone Number (Optional)
              </label>
              <input
                id="bk-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number (if available)"
                className="w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium focus:border-[#C62828]"
              />
            </div>

            {/* Occasion Presets */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Tag className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Occasion Type
              </label>
              <div className="flex flex-wrap gap-2">
                {occasionPresets.map((occ) => {
                  const isSelected = occasion === occ;
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`min-h-[46px] px-3.5 py-1.5 rounded-xl text-base font-bold border transition-all ${
                        isSelected
                          ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lead Source Presets */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Share2 className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Lead Source
              </label>
              <div className="flex flex-wrap gap-2">
                {sourcePresets.map((src) => {
                  const isSelected = source === src;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSource(src)}
                      className={`min-h-[46px] px-3.5 py-1.5 rounded-xl text-base font-bold border transition-all ${
                        isSelected
                          ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {src}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Check-In and Check-Out Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-black mb-2 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                  Check-in Date *
                </label>
                <button
                  type="button"
                  onClick={() => setDatePickerTarget('checkIn')}
                  className="w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-left font-bold flex items-center justify-between"
                >
                  <span>{checkInDate}</span>
                  <span className="text-base text-[#C62828] dark:text-red-400 underline font-black">
                    Pick
                  </span>
                </button>
              </div>

              <div>
                <label className="block text-xl font-black mb-2 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                  Check-out Date *
                </label>
                <button
                  type="button"
                  onClick={() => setDatePickerTarget('checkOut')}
                  className="w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-left font-bold flex items-center justify-between"
                >
                  <span>{checkOutDate || checkInDate}</span>
                  <span className="text-base text-[#C62828] dark:text-red-400 underline font-black">
                    Pick
                  </span>
                </button>
              </div>
            </div>
            {errors.dates && <p className="text-red-600 font-bold text-lg">{errors.dates}</p>}

            {/* Guests Range & Count */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Guests Range:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {guestsRangePresets.map((r) => {
                  const isSelected = guestsRange === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setGuestsRange(r)}
                      className={`min-h-[46px] px-4 py-2 rounded-xl text-base font-bold border transition-all ${
                        isSelected
                          ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {r} Guests
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {guestPresets.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setGuestsCount(cnt)}
                    className={`min-h-[44px] px-3 py-1.5 rounded-xl text-base font-bold border ${
                      guestsCount === cnt
                        ? 'bg-[#C62828] text-white border-[#C62828]'
                        : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="bk-amount"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <IndianRupee className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Total Amount (₹)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {amountPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`min-h-[46px] px-3.5 py-1.5 rounded-xl text-base font-bold border transition-all ${
                      amount === preset
                        ? 'bg-[#C62828] text-white border-[#C62828]'
                        : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                id="bk-amount"
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full min-h-[56px] text-2xl px-4 py-2 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-black text-stone-900 dark:text-white focus:border-[#C62828]"
              />
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="bk-notes"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <FileText className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Notes / Special Requests (Bhatti, coolers, stay, etc.)
              </label>
              <textarea
                id="bk-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. 150 guests, Bhatti required, 8 hot cases, 4 water cooler"
                className="w-full text-lg p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-medium focus:border-[#C62828]"
              />
            </div>

            {/* Big Action Buttons (Save & Cancel) */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full min-h-[58px] bg-[#C62828] hover:bg-red-800 active:scale-98 text-white rounded-2xl text-2xl font-black shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-7 h-7" />
                <span>Save Booking</span>
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 min-h-[52px] bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl text-xl font-bold flex items-center justify-center border border-stone-300 dark:border-stone-700"
                >
                  <X className="w-5 h-5 mr-1" />
                  <span>Cancel</span>
                </button>

                {booking && onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this booking?')) {
                        onDelete(booking.id);
                        onClose();
                      }
                    }}
                    className="min-h-[52px] px-5 bg-red-50 hover:bg-red-100 dark:bg-red-950/60 text-[#C62828] rounded-2xl text-lg font-bold flex items-center justify-center gap-1.5 border border-red-200 dark:border-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Date Picker Modal */}
      {datePickerTarget && (
        <DatePickerModal
          isOpen={true}
          title={datePickerTarget === 'checkIn' ? 'Select Check-in Date' : 'Select Check-out Date'}
          initialDate={datePickerTarget === 'checkIn' ? checkInDate : checkOutDate || checkInDate}
          onSelectDate={(selected) => {
            if (datePickerTarget === 'checkIn') {
              setCheckInDate(selected);
              if (checkOutDate && checkOutDate < selected) {
                setCheckOutDate(selected);
              }
            } else {
              setCheckOutDate(selected);
            }
            setDatePickerTarget(null);
          }}
          onClose={() => setDatePickerTarget(null)}
        />
      )}
    </>
  );
};
