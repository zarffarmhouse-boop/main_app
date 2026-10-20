import { Booking, Enquiry, EnquiryStatus, Expense, ExpenseCategory, Todo } from '../types/index.ts';

/**
 * Format currency in Indian Rupees format (e.g. Rs. 25,000)
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount || 0);
  return 'Rs. ' + rounded.toLocaleString('en-IN');
}

/**
 * Returns formatted friendly date (e.g. "20 Oct 2026")
 */
export function formatFriendlyDate(dateStr?: string): string {
  if (!dateStr) return 'No date';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

/**
 * Format today's date in YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format current month in YYYY-MM
 */
export function getCurrentMonthString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Filter bookings upcoming within next N days from reference date (default 7 days)
 */
export function getUpcomingBookings(
  bookings: Booking[],
  referenceDateStr: string = getTodayDateString(),
  daysAhead: number = 7
): Booking[] {
  const refDate = new Date(referenceDateStr + 'T00:00:00');
  const maxDate = new Date(refDate);
  maxDate.setDate(maxDate.getDate() + daysAhead);
  maxDate.setHours(23, 59, 59, 999);

  return bookings
    .filter((b) => {
      if (!b.checkInDate) return false;
      const checkIn = new Date(b.checkInDate + 'T00:00:00');
      // include if check-in is between today and today+daysAhead
      // or if booking is currently ongoing (checkIn <= today <= checkOut)
      const checkOut = b.checkOutDate ? new Date(b.checkOutDate + 'T23:59:59') : checkIn;
      const isUpcoming = checkIn >= refDate && checkIn <= maxDate;
      const isCurrentlyOngoing = checkIn <= refDate && checkOut >= refDate;
      return isUpcoming || isCurrentlyOngoing;
    })
    .sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));
}

/**
 * Calculate total revenue for a given month (YYYY-MM)
 */
export function calculateMonthlyRevenue(bookings: Booking[], yearMonth: string): number {
  return bookings
    .filter((b) => b.checkInDate && b.checkInDate.startsWith(yearMonth))
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
}

/**
 * Calculate confirmed bookings count for a given month (YYYY-MM)
 */
export function countMonthlyBookings(bookings: Booking[], yearMonth: string): number {
  return bookings.filter((b) => b.checkInDate && b.checkInDate.startsWith(yearMonth)).length;
}

/**
 * Calculate total expenses for a given month (YYYY-MM)
 */
export function calculateMonthlyExpenses(expenses: Expense[], yearMonth: string): number {
  return expenses
    .filter((e) => e.date && e.date.startsWith(yearMonth))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

/**
 * Filter enquiries by query and status
 */
export function filterEnquiries(
  enquiries: Enquiry[],
  searchQuery: string = '',
  statusFilter: string = 'All'
): Enquiry[] {
  const query = searchQuery.trim().toLowerCase();
  return enquiries
    .filter((enq) => {
      const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      return (
        enq.name.toLowerCase().includes(query) ||
        enq.phone.toLowerCase().includes(query) ||
        (enq.notes && enq.notes.toLowerCase().includes(query)) ||
        (enq.preferredDates && enq.preferredDates.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => (b.enquiryDate || '').localeCompare(a.enquiryDate || '') || b.createdAt - a.createdAt);
}

/**
 * Filter expenses by category and month
 */
export function filterExpenses(
  expenses: Expense[],
  yearMonth: string = '',
  categoryFilter: string = 'All'
): Expense[] {
  return expenses
    .filter((exp) => {
      const matchesMonth = !yearMonth || (exp.date && exp.date.startsWith(yearMonth));
      const matchesCat = categoryFilter === 'All' || exp.category === categoryFilter;
      return matchesMonth && matchesCat;
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);
}

/**
 * Sort todos: uncompleted first (High -> Medium -> Low), completed moved to bottom
 */
export function sortTodos(todos: Todo[]): Todo[] {
  const priorityWeight: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return [...todos].sort((a, b) => {
    // 1. Done status: incomplete (false) before complete (true)
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }
    // 2. Priority: High before Medium before Low
    const weightDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    if (weightDiff !== 0) return weightDiff;

    // 3. Due Date: earlier due date first
    if (a.dueDate && b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // 4. Creation time newest first
    return b.createdAt - a.createdAt;
  });
}

/**
 * Calculate Summary Stats for Dashboard
 */
export function getDashboardSummary(
  enquiries: Enquiry[],
  bookings: Booking[],
  expenses: Expense[],
  todos: Todo[],
  currentMonth: string = getCurrentMonthString()
) {
  const openEnquiries = enquiries.filter(
    (e) => e.status === 'New' || e.status === 'Follow-up'
  ).length;

  const confirmedBookingsThisMonth = countMonthlyBookings(bookings, currentMonth);
  const totalRevenueThisMonth = calculateMonthlyRevenue(bookings, currentMonth);
  const totalExpensesThisMonth = calculateMonthlyExpenses(expenses, currentMonth);
  const pendingTodos = todos.filter((t) => !t.isDone).length;

  return {
    openEnquiries,
    confirmedBookingsThisMonth,
    totalRevenueThisMonth,
    totalExpensesThisMonth,
    pendingTodos,
  };
}
