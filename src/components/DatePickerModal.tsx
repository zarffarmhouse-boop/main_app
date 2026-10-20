import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  title?: string;
  initialDate?: string; // YYYY-MM-DD
  onSelect: (dateStr: string) => void;
  onClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  title = 'Select Date',
  initialDate,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const init = initialDate ? new Date(initialDate + 'T00:00:00') : today;
  const validInit = isNaN(init.getTime()) ? today : init;

  const [currentYear, setCurrentYear] = useState<number>(validInit.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(validInit.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate ||
      `${validInit.getFullYear()}-${String(validInit.getMonth() + 1).padStart(2, '0')}-${String(
        validInit.getDate()
      ).padStart(2, '0')}`
  );

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  // Helper for presets
  const applyPresetDays = (daysOffset: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysOffset);
    const yr = target.getFullYear();
    const mo = String(target.getMonth() + 1).padStart(2, '0');
    const dy = String(target.getDate()).padStart(2, '0');
    setSelectedDate(`${yr}-${mo}-${dy}`);
    setCurrentYear(yr);
    setCurrentMonth(target.getMonth());
  };

  const applyNextWeekend = () => {
    const target = new Date();
    const day = target.getDay();
    const diff = (6 - day + 7) % 7 || 7; // next Saturday
    target.setDate(target.getDate() + diff);
    const yr = target.getFullYear();
    const mo = String(target.getMonth() + 1).padStart(2, '0');
    const dy = String(target.getDate()).padStart(2, '0');
    setSelectedDate(`${yr}-${mo}-${dy}`);
    setCurrentYear(yr);
    setCurrentMonth(target.getMonth());
  };

  const dayCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-12" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = selectedDate === dateStr;
    const isToday =
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === d;

    dayCells.push(
      <button
        key={d}
        type="button"
        onClick={() => setSelectedDate(dateStr)}
        className={`h-12 text-xl font-bold rounded-xl flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-emerald-700 text-white shadow-lg ring-4 ring-emerald-300 dark:ring-emerald-800 scale-105'
            : isToday
            ? 'bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border-2 border-amber-600'
            : 'text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800'
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="date-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border-2 border-stone-300 dark:border-stone-700 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-[#C62828] dark:bg-red-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-white" />
            <div>
              <h2 id="date-picker-title" className="text-2xl font-black">{title}</h2>
              <p className="text-red-100 text-lg font-semibold">
                {selectedDate || 'Choose a date'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Date Picker"
            className="p-2 text-white hover:bg-red-800 rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border-b border-stone-200 dark:border-stone-800">
          <p className="text-base font-bold text-stone-600 dark:text-stone-400 mb-2">Quick Pick:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPresetDays(0)}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-stone-900 dark:text-white rounded-xl text-lg font-bold min-h-[48px]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => applyPresetDays(1)}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-stone-900 dark:text-white rounded-xl text-lg font-bold min-h-[48px]"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={applyNextWeekend}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-stone-900 dark:text-white rounded-xl text-lg font-bold min-h-[48px]"
            >
              Upcoming Weekend
            </button>
            <button
              type="button"
              onClick={() => applyPresetDays(7)}
              className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-stone-900 dark:text-white rounded-xl text-lg font-bold min-h-[48px]"
            >
              +7 Days
            </button>
          </div>
        </div>

        {/* Calendar Month Navigation */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-2xl hover:bg-stone-200 min-w-[50px] min-h-[50px] flex items-center justify-center font-bold"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-2xl hover:bg-stone-200 min-w-[50px] min-h-[50px] flex items-center justify-center font-bold"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-stone-500 dark:text-stone-400 mb-2 text-base">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {dayCells}
          </div>
        </div>

        {/* Large Save & Cancel Bottom Buttons */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900 border-t-2 border-stone-200 dark:border-stone-800 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-stone-300 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-2xl text-xl font-bold min-h-[56px] flex items-center justify-center gap-2 active:scale-95"
          >
            <X className="w-6 h-6" />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (selectedDate) onSelect(selectedDate);
              onClose();
            }}
            className="flex-1 py-4 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-2xl text-xl font-black min-h-[56px] flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Check className="w-6 h-6" />
            Confirm Date
          </button>
        </div>
      </div>
    </div>
  );
};
