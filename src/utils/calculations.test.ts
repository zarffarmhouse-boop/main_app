import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  getUpcomingBookings,
  calculateMonthlyRevenue,
  calculateMonthlyExpenses,
  filterEnquiries,
  filterExpenses,
  sortTodos,
  getDashboardSummary,
} from './calculations.ts';
import { Booking, Enquiry, Expense, Todo } from '../types/index.ts';

test('formatCurrency formats Indian Rupee values properly', () => {
  assert.equal(formatCurrency(0), 'Rs. 0');
  assert.equal(formatCurrency(25000), 'Rs. 25,000');
  assert.equal(formatCurrency(150000), 'Rs. 1,50,000');
});

test('calculateMonthlyRevenue sums amounts only for matching month', () => {
  const bookings: Booking[] = [
    {
      id: '1',
      guestName: 'Rajesh Sharma',
      phone: '9826012345',
      checkInDate: '2026-10-15',
      checkOutDate: '2026-10-17',
      guestsCount: 15,
      amount: 30000,
      paymentStatus: 'Paid',
      notes: 'Family gathering',
      createdAt: 1000,
    },
    {
      id: '2',
      guestName: 'Amit Verma',
      phone: '9826055555',
      checkInDate: '2026-10-24',
      checkOutDate: '2026-10-26',
      guestsCount: 20,
      amount: 45000,
      paymentStatus: 'Partial',
      notes: 'Birthday party',
      createdAt: 1001,
    },
    {
      id: '3',
      guestName: 'Sunil Jain',
      phone: '9826099999',
      checkInDate: '2026-11-05',
      checkOutDate: '2026-11-07',
      guestsCount: 10,
      amount: 25000,
      paymentStatus: 'Pending',
      notes: 'Weekend get-together',
      createdAt: 1002,
    },
  ];

  const octRevenue = calculateMonthlyRevenue(bookings, '2026-10');
  assert.equal(octRevenue, 75000);

  const novRevenue = calculateMonthlyRevenue(bookings, '2026-11');
  assert.equal(novRevenue, 25000);

  const decRevenue = calculateMonthlyRevenue(bookings, '2026-12');
  assert.equal(decRevenue, 0);
});

test('getUpcomingBookings retrieves bookings within the next 7 days or currently ongoing', () => {
  const bookings: Booking[] = [
    {
      id: 'past',
      guestName: 'Past Guest',
      phone: '9826000001',
      checkInDate: '2026-10-10',
      checkOutDate: '2026-10-12',
      guestsCount: 8,
      amount: 20000,
      paymentStatus: 'Paid',
      notes: '',
      createdAt: 1,
    },
    {
      id: 'ongoing',
      guestName: 'Ongoing Guest',
      phone: '9826000002',
      checkInDate: '2026-10-19',
      checkOutDate: '2026-10-22',
      guestsCount: 12,
      amount: 35000,
      paymentStatus: 'Paid',
      notes: '',
      createdAt: 2,
    },
    {
      id: 'soon',
      guestName: 'Upcoming Soon Guest',
      phone: '9826000003',
      checkInDate: '2026-10-25',
      checkOutDate: '2026-10-26',
      guestsCount: 18,
      amount: 40000,
      paymentStatus: 'Partial',
      notes: '',
      createdAt: 3,
    },
    {
      id: 'future',
      guestName: 'Far Future Guest',
      phone: '9826000004',
      checkInDate: '2026-11-15',
      checkOutDate: '2026-11-16',
      guestsCount: 10,
      amount: 25000,
      paymentStatus: 'Pending',
      notes: '',
      createdAt: 4,
    },
  ];

  // Test reference date: 2026-10-20
  const upcoming = getUpcomingBookings(bookings, '2026-10-20', 7);
  // Expect 'ongoing' (checkIn 19, checkOut 22) and 'soon' (checkIn 25)
  assert.equal(upcoming.length, 2);
  assert.equal(upcoming[0].id, 'ongoing');
  assert.equal(upcoming[1].id, 'soon');
});

test('calculateMonthlyExpenses aggregates correctly', () => {
  const expenses: Expense[] = [
    {
      id: 'e1',
      date: '2026-10-05',
      category: 'Staff',
      amount: 8000,
      paidTo: 'Ramesh (Gardener)',
      notes: 'Monthly salary',
      createdAt: 1,
    },
    {
      id: 'e2',
      date: '2026-10-12',
      category: 'Utilities',
      amount: 3500,
      paidTo: 'Electricity Board',
      notes: 'Farmhouse meter bill',
      createdAt: 2,
    },
    {
      id: 'e3',
      date: '2026-09-30',
      category: 'Maintenance',
      amount: 4000,
      paidTo: 'Plumber Suresh',
      notes: 'Pump repair',
      createdAt: 3,
    },
  ];

  const octTotal = calculateMonthlyExpenses(expenses, '2026-10');
  assert.equal(octTotal, 11500);
});

test('sortTodos moves completed tasks to bottom and sorts by priority', () => {
  const todos: Todo[] = [
    {
      id: 't1',
      task: 'Buy pool chlorine',
      priority: 'Low',
      isDone: false,
      createdAt: 1,
    },
    {
      id: 't2',
      task: 'Fix water pump before weekend',
      priority: 'High',
      isDone: false,
      createdAt: 2,
    },
    {
      id: 't3',
      task: 'Pay electricity bill',
      priority: 'High',
      isDone: true,
      createdAt: 3,
    },
    {
      id: 't4',
      task: 'Cut lawn grass',
      priority: 'Medium',
      isDone: false,
      createdAt: 4,
    },
  ];

  const sorted = sortTodos(todos);

  // Incomplete high priority first: t2
  assert.equal(sorted[0].id, 't2');
  // Incomplete medium priority: t4
  assert.equal(sorted[1].id, 't4');
  // Incomplete low priority: t1
  assert.equal(sorted[2].id, 't1');
  // Completed item at the bottom: t3
  assert.equal(sorted[3].id, 't3');
});

test('filterEnquiries filters by query and status properly', () => {
  const enquiries: Enquiry[] = [
    {
      id: 'eq1',
      name: 'Dr. Vivek Saxena',
      phone: '9826112233',
      enquiryDate: '2026-10-20',
      preferredDates: 'First week November',
      guestsCount: 25,
      notes: 'Lawn dinner required',
      status: 'New',
      createdAt: 10,
    },
    {
      id: 'eq2',
      name: 'Pooja Tiwari',
      phone: '9425098765',
      enquiryDate: '2026-10-18',
      preferredDates: 'Weekend',
      guestsCount: 15,
      notes: 'Pool access needed',
      status: 'Follow-up',
      createdAt: 9,
    },
    {
      id: 'eq3',
      name: 'Mohit Agarwal',
      phone: '9893012345',
      enquiryDate: '2026-10-15',
      preferredDates: 'Dec 25',
      guestsCount: 30,
      notes: '',
      status: 'Closed',
      createdAt: 8,
    },
  ];

  // Filter by status 'New'
  const newOnly = filterEnquiries(enquiries, '', 'New');
  assert.equal(newOnly.length, 1);
  assert.equal(newOnly[0].id, 'eq1');

  // Search by text 'Pool'
  const poolEnq = filterEnquiries(enquiries, 'pool', 'All');
  assert.equal(poolEnq.length, 1);
  assert.equal(poolEnq[0].id, 'eq2');
});
