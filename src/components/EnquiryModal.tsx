import React, { useState, useEffect } from 'react';
import { Enquiry, EnquiryStatus, GuestsRange, LeadSource, OccasionType } from '../types/index.ts';
import { getTodayDateString } from '../utils/calculations.ts';
import { DatePickerModal } from './DatePickerModal.tsx';
import {
  Calendar,
  Check,
  X,
  Phone,
  User,
  Users,
  FileText,
  Trash2,
  Tag,
  Share2,
} from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  enquiry?: Enquiry | null;
  onSave: (enquiry: Enquiry) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  enquiry,
  onSave,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [enquiryDate, setEnquiryDate] = useState(getTodayDateString());
  const [preferredDates, setPreferredDates] = useState('');
  const [guestsCount, setGuestsCount] = useState<number>(15);
  const [guestsRange, setGuestsRange] = useState<GuestsRange | ''>('0-30');
  const [occasion, setOccasion] = useState<string>('Family Get Together');
  const [source, setSource] = useState<string>('Instagram');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<EnquiryStatus>('New');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (enquiry) {
      setName(enquiry.name || '');
      setPhone(enquiry.phone || '');
      setEnquiryDate(enquiry.enquiryDate || getTodayDateString());
      setPreferredDates(enquiry.preferredDates || '');
      setGuestsCount(enquiry.guestsCount || 15);
      setGuestsRange(enquiry.guestsRange || '0-30');
      setOccasion(enquiry.occasion || 'Family Get Together');
      setSource(enquiry.source || 'Instagram');
      setNotes(enquiry.notes || '');
      setStatus(enquiry.status || 'New');
    } else {
      setName('');
      setPhone('');
      setEnquiryDate(getTodayDateString());
      setPreferredDates('');
      setGuestsCount(15);
      setGuestsRange('0-30');
      setOccasion('Family Get Together');
      setSource('Instagram');
      setNotes('');
      setStatus('New');
    }
    setErrors({});
  }, [enquiry, isOpen]);

  if (!isOpen) return null;

  const statusPresets: EnquiryStatus[] = ['New', 'Follow-up', 'Confirmed', 'Closed'];
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
  const datePresets = [
    'Upcoming Weekend',
    'Next Weekend',
    'Coming Friday to Sunday',
    'Diwali / Festival Holidays',
    'November Weekend',
    'December Wedding Season',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter guest name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Enquiry = {
      id: enquiry?.id || `enq-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      enquiryDate: enquiryDate || getTodayDateString(),
      preferredDates: preferredDates.trim() || 'Flexible dates',
      guestsCount: Number(guestsCount) || 15,
      guestsRange: guestsRange || undefined,
      occasion: occasion.trim() || undefined,
      source: source.trim() || undefined,
      notes: notes.trim(),
      status,
      createdAt: enquiry?.createdAt || Date.now(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      >
        <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl shadow-2xl border-2 border-stone-300 dark:border-stone-700 flex flex-col my-auto max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#C62828] dark:bg-red-950 text-white p-5 flex items-center justify-between shrink-0">
            <div>
              <h2 id="enquiry-modal-title" className="text-2xl sm:text-3xl font-black">
                {enquiry ? 'Edit Farmhouse Enquiry' : 'New Farmhouse Enquiry'}
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
            {/* Status Chips */}
            <div>
              <span className="block text-xl font-black mb-2">Enquiry Status *</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {statusPresets.map((st) => {
                  const isSelected = status === st;
                  const colorClass =
                    st === 'Confirmed'
                      ? 'bg-emerald-600 text-white'
                      : st === 'Follow-up'
                      ? 'bg-amber-600 text-white'
                      : st === 'New'
                      ? 'bg-[#C62828] text-white'
                      : 'bg-stone-600 text-white';

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`min-h-[52px] rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
                        isSelected
                          ? `${colorClass} shadow-md ring-4 ring-red-200 dark:ring-red-900 border-transparent`
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      <span>{st}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Name */}
            <div>
              <label
                htmlFor="enq-name"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <User className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Guest / Booking Name *
              </label>
              <input
                id="enq-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g. Shahwar Booking or Riya Sarkar"
                className={`w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 bg-stone-50 dark:bg-stone-800 font-bold ${
                  errors.name
                    ? 'border-red-600 focus:ring-4 focus:ring-red-200'
                    : 'border-stone-300 dark:border-stone-700 focus:border-[#C62828]'
                }`}
              />
              {errors.name && (
                <p className="text-red-600 font-bold text-lg mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label
                htmlFor="enq-phone"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <Phone className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Phone Number (Optional)
              </label>
              <input
                id="enq-phone"
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

            {/* Enquiry Date */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Enquiry Date
              </label>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className="w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-left font-bold flex items-center justify-between"
              >
                <span>{enquiryDate}</span>
                <span className="text-base text-[#C62828] dark:text-red-400 underline font-black">
                  Pick Date
                </span>
              </button>
            </div>

            {/* Preferred Dates & Presets */}
            <div>
              <label
                htmlFor="enq-pref-dates"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <Calendar className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Preferred Dates / Timeline
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {datePresets.map((dp) => (
                  <button
                    key={dp}
                    type="button"
                    onClick={() => setPreferredDates(dp)}
                    className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-red-50 text-stone-800 dark:text-stone-200 rounded-xl text-base font-semibold border border-stone-300 dark:border-stone-700"
                  >
                    {dp}
                  </button>
                ))}
              </div>
              <input
                id="enq-pref-dates"
                type="text"
                value={preferredDates}
                onChange={(e) => setPreferredDates(e.target.value)}
                placeholder="e.g. 29-30 Nov 2026 or Next Sunday"
                className="w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold focus:border-[#C62828]"
              />
            </div>

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

            {/* Notes */}
            <div>
              <label
                htmlFor="enq-notes"
                className="block text-xl font-black mb-2 flex items-center gap-2"
              >
                <FileText className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Notes / Special Requests (Cooking, timing, etc.)
              </label>
              <textarea
                id="enq-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. No cooking, or needs tent setup"
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
                <span>Save Enquiry</span>
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

                {enquiry && onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this enquiry?')) {
                        onDelete(enquiry.id);
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
      {isDatePickerOpen && (
        <DatePickerModal
          isOpen={true}
          title="Select Enquiry Date"
          initialDate={enquiryDate}
          onSelectDate={(selected) => {
            setEnquiryDate(selected);
            setIsDatePickerOpen(false);
          }}
          onClose={() => setIsDatePickerOpen(false)}
        />
      )}
    </>
  );
};
