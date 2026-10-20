import { Booking, Enquiry, Expense, Person, Todo } from '../types/index.ts';
import {
  REAL_BOOKINGS,
  REAL_ENQUIRIES,
  REAL_EXPENSES,
  REAL_PEOPLE,
  REAL_TODOS,
} from './seedData.ts';

const STORAGE_KEYS = {
  ENQUIRIES: 'zarf_enquiries_real_v4',
  BOOKINGS: 'zarf_bookings_real_v4',
  EXPENSES: 'zarf_expenses_real_v4',
  PEOPLE: 'zarf_people_real_v4',
  TODOS: 'zarf_todos_real_v4',
  AUTH_PIN: 'zarf_auth_pin_real_v4',
  DARK_MODE: 'zarf_dark_mode_real_v4',
  DEVICE_FRAME: 'zarf_device_frame_real_v4',
  INITIALIZED: 'zarf_initialized_real_v4',
};

// Storage helpers with safe fallback
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Automatically seed authentic records on first open
function ensureRealSeedDataLoaded(): void {
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(REAL_BOOKINGS));
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(REAL_ENQUIRIES));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(REAL_EXPENSES));
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(REAL_PEOPLE));
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(REAL_TODOS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch {
    // ignore
  }
}

// Run initial seed check
ensureRealSeedDataLoaded();

/**
 * Farmhouse Storage Service - Clean, Local, 100% Offline.
 * Pre-populated with real authentic Bhopal Farmhouse data.
 */
export class FarmhouseStorage {
  static getEnquiries(): Enquiry[] {
    return loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, REAL_ENQUIRIES);
  }

  static saveEnquiries(data: Enquiry[]): void {
    saveToStorage(STORAGE_KEYS.ENQUIRIES, data);
  }

  static getBookings(): Booking[] {
    return loadFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, REAL_BOOKINGS);
  }

  static saveBookings(data: Booking[]): void {
    saveToStorage(STORAGE_KEYS.BOOKINGS, data);
  }

  static getExpenses(): Expense[] {
    return loadFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, REAL_EXPENSES);
  }

  static saveExpenses(data: Expense[]): void {
    saveToStorage(STORAGE_KEYS.EXPENSES, data);
  }

  static getPeople(): Person[] {
    return loadFromStorage<Person[]>(STORAGE_KEYS.PEOPLE, REAL_PEOPLE);
  }

  static savePeople(data: Person[]): void {
    saveToStorage(STORAGE_KEYS.PEOPLE, data);
  }

  static getTodos(): Todo[] {
    return loadFromStorage<Todo[]>(STORAGE_KEYS.TODOS, REAL_TODOS);
  }

  static saveTodos(data: Todo[]): void {
    saveToStorage(STORAGE_KEYS.TODOS, data);
  }

  static getPinCode(): string {
    return loadFromStorage<string>(STORAGE_KEYS.AUTH_PIN, '1234');
  }

  static savePinCode(pin: string): void {
    saveToStorage(STORAGE_KEYS.AUTH_PIN, pin);
  }

  static getDarkMode(): boolean {
    return loadFromStorage<boolean>(STORAGE_KEYS.DARK_MODE, false);
  }

  static saveDarkMode(isDark: boolean): void {
    saveToStorage(STORAGE_KEYS.DARK_MODE, isDark);
  }

  static getDeviceFrame(): boolean {
    return loadFromStorage<boolean>(STORAGE_KEYS.DEVICE_FRAME, false);
  }

  static saveDeviceFrame(enabled: boolean): void {
    saveToStorage(STORAGE_KEYS.DEVICE_FRAME, enabled);
  }

  static clearAll(): void {
    saveToStorage(STORAGE_KEYS.ENQUIRIES, []);
    saveToStorage(STORAGE_KEYS.BOOKINGS, []);
    saveToStorage(STORAGE_KEYS.EXPENSES, []);
    saveToStorage(STORAGE_KEYS.PEOPLE, []);
    saveToStorage(STORAGE_KEYS.TODOS, []);
  }

  static resetToRealSeedData(): void {
    saveToStorage(STORAGE_KEYS.BOOKINGS, REAL_BOOKINGS);
    saveToStorage(STORAGE_KEYS.ENQUIRIES, REAL_ENQUIRIES);
    saveToStorage(STORAGE_KEYS.EXPENSES, REAL_EXPENSES);
    saveToStorage(STORAGE_KEYS.PEOPLE, REAL_PEOPLE);
    saveToStorage(STORAGE_KEYS.TODOS, REAL_TODOS);
  }

  static exportBackup(): string {
    const dump = {
      version: '4.0',
      farmhouse: 'Zarf Farmhouse, Bhopal',
      exportedAt: new Date().toISOString(),
      enquiries: this.getEnquiries(),
      bookings: this.getBookings(),
      expenses: this.getExpenses(),
      people: this.getPeople(),
      todos: this.getTodos(),
    };
    return JSON.stringify(dump, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.enquiries)) this.saveEnquiries(data.enquiries);
      if (Array.isArray(data.bookings)) this.saveBookings(data.bookings);
      if (Array.isArray(data.expenses)) this.saveExpenses(data.expenses);
      if (Array.isArray(data.people)) this.savePeople(data.people);
      if (Array.isArray(data.todos)) this.saveTodos(data.todos);
      return true;
    } catch {
      return false;
    }
  }
}
