import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, Person } from '../types/index.ts';
import { getTodayDateString } from '../utils/calculations.ts';
import { DatePickerModal } from './DatePickerModal.tsx';
import { Calendar, Check, X, IndianRupee, User, Tag, FileText, Trash2 } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  expense?: Expense | null;
  peopleList?: Person[];
  onSave: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  expense,
  peopleList = [],
  onSave,
  onDelete,
  onClose,
}) => {
  const [date, setDate] = useState(getTodayDateString());
  const [category, setCategory] = useState<ExpenseCategory>('Staff');
  const [amount, setAmount] = useState<number>(1000);
  const [paidTo, setPaidTo] = useState('');
  const [notes, setNotes] = useState('');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; paidTo?: string }>({});

  useEffect(() => {
    if (expense) {
      setDate(expense.date || getTodayDateString());
      setCategory(expense.category || 'Staff');
      setAmount(expense.amount || 1000);
      setPaidTo(expense.paidTo || '');
      setNotes(expense.notes || '');
    } else {
      setDate(getTodayDateString());
      setCategory('Staff');
      setAmount(1000);
      setPaidTo('');
      setNotes('');
    }
    setErrors({});
  }, [expense, isOpen]);

  if (!isOpen) return null;

  const categoryPresets: ExpenseCategory[] = ['Staff', 'Food', 'Maintenance', 'Utilities', 'Other'];
  const amountPresets = [500, 1000, 2000, 3500, 5000, 10000];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { amount?: string; paidTo?: string } = {};

    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter valid expense amount';
    }
    if (!paidTo.trim()) {
      newErrors.paidTo = 'Please enter who was paid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: Expense = {
      id: expense?.id || `exp-${Date.now()}`,
      date,
      category,
      amount: Number(amount),
      paidTo: paidTo.trim(),
      notes: notes.trim(),
      createdAt: expense?.createdAt || Date.now(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="expense-modal-title"
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
      >
        <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-xl shadow-2xl border-2 border-stone-300 dark:border-stone-700 flex flex-col my-auto max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#C62828] dark:bg-red-950 text-white p-5 flex items-center justify-between shrink-0">
            <div>
              <h2 id="expense-modal-title" className="text-2xl sm:text-3xl font-black">
                {expense ? 'Edit Expense' : 'Add New Expense'}
              </h2>
              <p className="text-red-100 text-lg font-medium">
                Zarf Farmhouse, Bhopal
              </p>
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
          <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-6 flex-1 text-stone-900 dark:text-stone-100">
            {/* Category Chips */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Tag className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoryPresets.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`min-h-[52px] py-3 px-3 rounded-2xl text-lg font-black transition-all flex items-center justify-center border-2 ${
                        isSelected
                          ? 'bg-[#C62828] border-red-800 text-white shadow-md ring-2 ring-red-300'
                          : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="exp-amount" className="block text-xl font-black mb-2 flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Amount (₹) *
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {amountPresets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      if (errors.amount) setErrors({ ...errors, amount: undefined });
                    }}
                    className={`min-h-[48px] px-3.5 py-2 rounded-xl text-lg font-bold border-2 ${
                      amount === amt
                        ? 'bg-[#C62828] text-white border-[#C62828] ring-2 ring-red-300'
                        : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                id="exp-amount"
                type="number"
                step="100"
                min="1"
                value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value) || 0);
                  if (errors.amount) setErrors({ ...errors, amount: undefined });
                }}
                className={`w-full min-h-[56px] text-2xl px-4 py-2 rounded-2xl border-2 bg-stone-50 dark:bg-stone-800 font-black text-[#C62828] dark:text-red-400 ${
                  errors.amount
                    ? 'border-red-600 focus:ring-4 focus:ring-red-200'
                    : 'border-stone-400 dark:border-stone-600 focus:border-[#C62828]'
                }`}
              />
              {errors.amount && (
                <p className="text-red-600 font-bold text-lg mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Paid To */}
            <div>
              <label htmlFor="exp-paid-to" className="block text-xl font-black mb-2 flex items-center gap-2">
                <User className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Paid To (Person / Vendor) *
              </label>
              {peopleList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-sm font-bold text-stone-500 py-1">Quick Select:</span>
                  {peopleList.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPaidTo(p.name);
                        if (errors.paidTo) setErrors({ ...errors, paidTo: undefined });
                      }}
                      className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950 text-stone-800 dark:text-stone-200 rounded-lg text-sm font-semibold"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
              <input
                id="exp-paid-to"
                type="text"
                value={paidTo}
                onChange={(e) => {
                  setPaidTo(e.target.value);
                  if (errors.paidTo) setErrors({ ...errors, paidTo: undefined });
                }}
                placeholder="e.g. Ramesh Caretaker, Plumber Suresh, Electricity Board"
                className={`w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 bg-stone-50 dark:bg-stone-800 font-medium ${
                  errors.paidTo
                    ? 'border-red-600 focus:ring-4 focus:ring-red-200'
                    : 'border-stone-400 dark:border-stone-600 focus:border-[#C62828]'
                }`}
              />
              {errors.paidTo && (
                <p className="text-red-600 font-bold text-lg mt-1">{errors.paidTo}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xl font-black mb-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Date of Expense
              </label>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className="w-full min-h-[56px] text-xl px-4 py-3 rounded-2xl border-2 border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 text-left font-bold flex items-center justify-between"
              >
                <span>{date}</span>
                <span className="text-base text-[#C62828] dark:text-red-400 underline font-black">
                  Change
                </span>
              </button>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="exp-notes" className="block text-xl font-black mb-2 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#C62828] dark:text-red-400" />
                Notes / Purpose
              </label>
              <textarea
                id="exp-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Monthly salary advance, submersible pump capacitor repair"
                className="w-full text-xl px-4 py-3 rounded-2xl border-2 border-stone-400 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 font-medium"
              />
            </div>

            {/* Big Save & Cancel Buttons */}
            <div className="pt-4 border-t-2 border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
              {expense && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this expense?')) {
                      onDelete(expense.id);
                      onClose();
                    }
                  }}
                  className="py-4 px-6 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-2 border-red-400 rounded-2xl text-xl font-black min-h-[56px] flex items-center justify-center gap-2 active:scale-95"
                >
                  <Trash2 className="w-6 h-6" />
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-900 dark:text-stone-100 rounded-2xl text-xl font-black min-h-[56px] flex items-center justify-center gap-2 active:scale-95 border-2 border-stone-400 dark:border-stone-600"
              >
                <X className="w-6 h-6" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-2xl text-xl font-black min-h-[56px] flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Check className="w-7 h-7" />
                Save Expense
              </button>
            </div>
          </form>
        </div>
      </div>

      <DatePickerModal
        isOpen={isDatePickerOpen}
        title="Select Expense Date"
        initialDate={date}
        onSelect={(newDate) => setDate(newDate)}
        onClose={() => setIsDatePickerOpen(false)}
      />
    </>
  );
};
