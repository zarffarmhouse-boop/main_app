import React, { useState } from 'react';
import { Expense } from '../types/index.ts';
import {
  formatCurrency,
  formatFriendlyDate,
} from '../utils/calculations.ts';
import {
  IndianRupee,
  Plus,
  Calendar,
  FileText,
  User,
} from 'lucide-react';

interface ExpensesScreenProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  expenses,
  onAddExpense,
  onEditExpense,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Staff', 'Food', 'Maintenance', 'Utilities', 'Other'];

  const filteredExpenses = expenses
    .filter((exp) => categoryFilter === 'All' || exp.category === categoryFilter)
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="space-y-5 pb-24 text-stone-900 dark:text-stone-100">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
            Expenses
          </h2>
          <div className="h-0.5 w-12 bg-[#C62828] mt-1" />
          <p className="text-base sm:text-lg font-bold text-stone-600 dark:text-stone-400 mt-1">
            {filteredExpenses.length} expense{filteredExpenses.length === 1 ? '' : 's'} recorded
            {filteredExpenses.length > 0 && (
              <span className="text-stone-500 font-semibold ml-2">
                • Total: <strong className="text-[#C62828] dark:text-red-400">{formatCurrency(totalAmount)}</strong>
              </span>
            )}
          </p>
        </div>

        <button
          onClick={onAddExpense}
          className="py-3 px-6 bg-[#C62828] hover:bg-red-800 active:scale-95 text-white rounded-xl text-xl font-black shadow-sm flex items-center justify-center gap-2 min-h-[52px] transition-all"
        >
          <Plus className="w-6 h-6" />
          <span>New Expense</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`min-h-[46px] px-4 py-2 rounded-xl text-base sm:text-lg font-bold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-[#C62828] border-[#C62828] text-white shadow-xs font-black'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-8 border border-stone-200 dark:border-stone-800 text-center shadow-xs">
          <IndianRupee className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
          <p className="text-2xl font-black text-stone-800 dark:text-stone-200 mb-1">
            No expenses recorded yet
          </p>
          <p className="text-lg text-stone-500 mb-6 font-medium">
            Record staff wages, grocery, electricity bills, and maintenance to keep accounts clear.
          </p>
          <button
            onClick={onAddExpense}
            className="py-3.5 px-6 bg-[#C62828] hover:bg-red-800 text-white rounded-xl text-xl font-black shadow-sm inline-flex items-center gap-2 min-h-[52px] active:scale-95"
          >
            <Plus className="w-6 h-6" />
            Add First Expense
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onEditExpense(exp)}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 hover:border-red-300 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-lg text-sm font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                      {exp.category}
                    </span>
                    <span className="text-base font-semibold text-stone-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatFriendlyDate(exp.date)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#C62828] dark:text-red-400" />
                    Paid to: {exp.paidTo}
                  </h3>
                </div>

                <div className="text-2xl font-black text-[#C62828] dark:text-red-400">
                  {formatCurrency(exp.amount)}
                </div>
              </div>

              {exp.notes && (
                <div className="mt-1.5 p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-base font-medium text-stone-700 dark:text-stone-300 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>{exp.notes}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-sm font-bold text-[#C62828] dark:text-red-400 underline">
                  Tap to edit
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
