/**
 * Zarf Farmhouse Manager - Data Models & Types
 * Represents Room Database Entities in Kotlin
 */

export type EnquiryStatus = 'New' | 'Follow-up' | 'Confirmed' | 'Closed';

export type OccasionType =
  | 'Family Get Together'
  | 'Wedding Function'
  | 'Birthday Party'
  | 'Pool Party'
  | 'Other';

export type LeadSource =
  | 'Instagram'
  | 'Referral'
  | 'Maps'
  | 'Event Planner'
  | 'WhatsApp'
  | 'Other';

export type GuestsRange = '0-30' | '31-100' | '100-250' | '250+';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  enquiryDate: string; // YYYY-MM-DD
  preferredDates: string; // e.g. "27 Nov 2026 to 29 Nov 2026"
  guestsCount: number;
  guestsRange?: GuestsRange;
  occasion?: OccasionType | string;
  source?: LeadSource | string;
  notes: string;
  status: EnquiryStatus;
  createdAt: number;
}

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid';

export interface Booking {
  id: string;
  guestName: string;
  phone: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestsCount: number;
  guestsRange?: GuestsRange;
  occasion?: OccasionType | string;
  source?: LeadSource | string;
  amount: number; // in Rupees
  paymentStatus: PaymentStatus;
  notes: string;
  createdAt: number;
}

export type ExpenseCategory = 'Staff' | 'Food' | 'Maintenance' | 'Utilities' | 'Other';

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  amount: number; // in Rupees
  paidTo: string; // Person/vendor name
  notes: string;
  createdAt: number;
}

export type PersonRole = 'Staff' | 'Vendor' | 'Guest Contact';

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  phone: string;
  notes: string;
  createdAt: number;
}

export type TodoPriority = 'Low' | 'Medium' | 'High';

export interface Todo {
  id: string;
  task: string;
  dueDate?: string; // YYYY-MM-DD optional
  priority: TodoPriority;
  isDone: boolean;
  createdAt: number;
}

export type MarketingStatus = 'Active' | 'Needs Attention' | 'Not Started';
export type MarketingFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'As Needed';

export interface MarketingPlatformItem {
  id: string;
  name: string;
  status: MarketingStatus;
  frequency: MarketingFrequency;
  nextAction: string;
  lastDoneDate?: string;
}

export type NavigationTab = 'home' | 'enquiries' | 'bookings' | 'expenses' | 'more';
export type MoreSubTab = 'marketing' | 'people' | 'todos' | 'android-code' | 'settings';
