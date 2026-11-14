/**
 * Khan Jacket House - Mobile API Service
 * Connects to Express/MySQL backend with reliable offline mock fallback
 */

import { getDefaultApiUrl } from '../config/env';

export interface Customer {
  id: number;
  shopName: string;
  shopkeeperName: string;
  city: string;
  area: string;
  phone: string;
  phone2?: string;
  marketAddress?: string;
  totalPieces: number;
  totalBilled: number;
  totalPaid: number;
  remainingBalance: number;
  inUgrahi?: boolean;
  ugrahiRoute?: string;
}

export interface Article {
  id: number;
  articleNo: string;
  name: string;
  category: string;
  currentStock: number;
  unitPrice: number;
  color?: string;
  sizes?: string;
}

export interface OutwardRecord {
  id: number;
  challanNo: string;
  customerId: number;
  customerName: string;
  city: string;
  date: string;
  totalPieces: number;
  totalAmount: number;
  status: 'Delivered' | 'In Transit' | 'Pending';
  transportName?: string;
}

export interface PaymentRecord {
  id: number;
  receiptNo: string;
  customerId: number;
  customerName: string;
  city: string;
  route: string;
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Online / Bank' | 'Cheque';
}

export interface CityRecord {
  id: number;
  name: string;
  shopsCount: number;
  totalPieces: number;
  areas: string[];
}

// Configurable Backend API URL (Loaded from .env with fallback)
export let API_BASE_URL = getDefaultApiUrl();

export const setApiBaseUrl = (url: string) => {
  API_BASE_URL = url.trim().replace(/\/+$/, '');
  if (!API_BASE_URL.endsWith('/api/v1')) {
    API_BASE_URL = `${API_BASE_URL}/api/v1`;
  }
};

// Initial Seed Data reflecting current Portal Database
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    shopName: 'Hassan Raza Garments',
    shopkeeperName: 'Hassan Raza',
    city: 'Lahore',
    area: 'Cantt',
    phone: '0300-1234567',
    marketAddress: 'Cantt Market, Shop # 14',
    totalPieces: 180,
    totalBilled: 234000,
    totalPaid: 150000,
    remainingBalance: 84000,
    inUgrahi: true,
    ugrahiRoute: 'Lahore',
  },
  {
    id: 2,
    shopName: 'Hassan Ashfaq Shop',
    shopkeeperName: 'Hassan Ashfaq',
    city: 'Islamabad',
    area: 'Azam Market',
    phone: '0321-9876543',
    marketAddress: 'Blue Area, Shop # 8',
    totalPieces: 140,
    totalBilled: 182000,
    totalPaid: 182000,
    remainingBalance: 0,
    inUgrahi: true,
    ugrahiRoute: 'Islamabad',
  },
  {
    id: 3,
    shopName: 'Al-Madina Garments',
    shopkeeperName: 'Haji Rafiq',
    city: 'Lahore',
    area: 'Shah Alam',
    phone: '0302-5551234',
    marketAddress: 'Shah Alam Market, Basement # 2',
    totalPieces: 95,
    totalBilled: 142500,
    totalPaid: 90000,
    remainingBalance: 52500,
    inUgrahi: true,
    ugrahiRoute: 'Lahore',
  },
  {
    id: 4,
    shopName: 'Bismillah Jacket Centre',
    shopkeeperName: 'Bhai Akram',
    city: 'Sheikhupura',
    area: 'Raja Bazaar',
    phone: '0333-4447788',
    marketAddress: 'Main Circular Road, Shop # 5',
    totalPieces: 60,
    totalBilled: 109217,
    totalPaid: 30000,
    remainingBalance: 79217,
    inUgrahi: true,
    ugrahiRoute: 'Sheikhupura',
  },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    articleNo: 'JKT-101',
    name: 'Men Winter Puffer Jacket (Double Hood)',
    category: 'Puffer Jacket',
    currentStock: 350,
    unitPrice: 1650,
    color: 'Black, Navy, Olive',
    sizes: 'M, L, XL, XXL',
  },
  {
    id: 2,
    articleNo: 'JKT-204',
    name: 'Biker Leather Finished Jacket',
    category: 'Leather Jacket',
    currentStock: 180,
    unitPrice: 2400,
    color: 'Tan Brown, Black',
    sizes: 'L, XL',
  },
  {
    id: 3,
    articleNo: 'JKT-310',
    name: 'Waterproof Parachute Windbreaker',
    category: 'Windbreaker',
    currentStock: 420,
    unitPrice: 1250,
    color: 'Dark Grey, Royal Blue',
    sizes: 'M, L, XL',
  },
  {
    id: 4,
    articleNo: 'JKT-415',
    name: 'China Fleece Lined Bomber Jacket',
    category: 'Bomber',
    currentStock: 95,
    unitPrice: 1800,
    color: 'Maroon, Jet Black',
    sizes: 'S, M, L, XL',
  },
];

const INITIAL_OUTWARD: OutwardRecord[] = [
  {
    id: 1,
    challanNo: 'CH-8901',
    customerId: 1,
    customerName: 'Hassan Raza Garments',
    city: 'Lahore',
    date: '12/11/2026',
    totalPieces: 80,
    totalAmount: 132000,
    status: 'Delivered',
    transportName: 'Bilal Goods Cargo',
  },
  {
    id: 2,
    challanNo: 'CH-8902',
    customerId: 2,
    customerName: 'Hassan Ashfaq Shop',
    city: 'Islamabad',
    date: '11/11/2026',
    totalPieces: 60,
    totalAmount: 99000,
    status: 'In Transit',
    transportName: 'Skyline Logistics Rawalpindi',
  },
  {
    id: 3,
    challanNo: 'CH-8903',
    customerId: 4,
    customerName: 'Bismillah Jacket Centre',
    city: 'Sheikhupura',
    date: '10/11/2026',
    totalPieces: 45,
    totalAmount: 67500,
    status: 'Delivered',
    transportName: 'Local Van Delivery',
  },
];

const INITIAL_CITIES: CityRecord[] = [
  { id: 1, name: 'Lahore', shopsCount: 7, totalPieces: 470, areas: ['Anarkali', 'Azam Market', 'Cantt', 'Shah Alam', 'Shahdara'] },
  { id: 2, name: 'Islamabad', shopsCount: 1, totalPieces: 140, areas: ['Blue Area', 'F-10 Markaz', 'I-9 Wholesale'] },
  { id: 3, name: 'Karachi', shopsCount: 0, totalPieces: 0, areas: ['Bolton Market', 'Saddar'] },
  { id: 4, name: 'Faisalabad', shopsCount: 0, totalPieces: 0, areas: ['Clock Tower', 'Rail Bazaar'] },
  { id: 5, name: 'Rawalpindi', shopsCount: 1, totalPieces: 5, areas: ['Raja Bazaar', 'Saddar'] },
  { id: 6, name: 'Sheikhupura', shopsCount: 1, totalPieces: 60, areas: ['Bhikhi Road', 'Farooqabad'] },
  { id: 7, name: 'Multan', shopsCount: 0, totalPieces: 0, areas: ['Hussain Agahi', 'Ghanta Ghar'] },
  { id: 8, name: 'Sialkot', shopsCount: 0, totalPieces: 0, areas: ['Kashmir Road', 'Daska'] },
];

// In-Memory Mobile Store for instant reactive offline-first operations
let localCustomers = [...INITIAL_CUSTOMERS];
let localArticles = [...INITIAL_ARTICLES];
let localOutward = [...INITIAL_OUTWARD];
let localCities = [...INITIAL_CITIES];

export const mobileApi = {
  // 1. Dashboard Metrics
  getDashboardMetrics: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/reports/dashboard`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback to local store calculations
    }

    const totalMalSent = localCustomers.reduce((acc, c) => acc + (c.totalPieces || 0), 0);
    const totalBilled = localCustomers.reduce((acc, c) => acc + (c.totalBilled || 0), 0);
    const totalReceived = localCustomers.reduce((acc, c) => acc + (c.totalPaid || 0), 0);
    const totalDue = localCustomers.reduce((acc, c) => acc + (c.remainingBalance || 0), 0);

    return {
      totalMalSent,
      totalBilled,
      totalReceived,
      totalDue,
      activeShops: localCustomers.length,
      totalStock: localArticles.reduce((acc, a) => acc + (a.currentStock || 0), 0),
    };
  },

  // 2. Customers (CRUD)
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/customers`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {}
    return [...localCustomers];
  },

  addCustomer: async (newCust: Omit<Customer, 'id' | 'totalPieces' | 'totalBilled' | 'totalPaid'>): Promise<Customer> => {
    const cust: Customer = {
      ...newCust,
      id: Date.now(),
      totalPieces: 0,
      totalBilled: newCust.remainingBalance || 0,
      totalPaid: 0,
    };
    localCustomers = [cust, ...localCustomers];
    return cust;
  },

  updateCustomer: async (id: number, updated: Partial<Customer>): Promise<Customer | null> => {
    const idx = localCustomers.findIndex(c => c.id === id);
    if (idx !== -1) {
      localCustomers[idx] = { ...localCustomers[idx], ...updated };
      return localCustomers[idx];
    }
    return null;
  },

  deleteCustomer: async (id: number): Promise<boolean> => {
    localCustomers = localCustomers.filter(c => c.id !== id);
    return true;
  },

  // 3. Articles (Garments Stock CRUD)
  getArticles: async (): Promise<Article[]> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/articles`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {}
    return [...localArticles];
  },

  addArticle: async (newArt: Omit<Article, 'id'>): Promise<Article> => {
    const art: Article = { ...newArt, id: Date.now() };
    localArticles = [art, ...localArticles];
    return art;
  },

  updateArticle: async (id: number, updated: Partial<Article>): Promise<Article | null> => {
    const idx = localArticles.findIndex(a => a.id === id);
    if (idx !== -1) {
      localArticles[idx] = { ...localArticles[idx], ...updated };
      return localArticles[idx];
    }
    return null;
  },

  deleteArticle: async (id: number): Promise<boolean> => {
    localArticles = localArticles.filter(a => a.id !== id);
    return true;
  },

  // 4. Outward / Maal Rawangi (CRUD)
  getOutward: async (): Promise<OutwardRecord[]> => {
    return [...localOutward];
  },

  addOutward: async (record: Omit<OutwardRecord, 'id' | 'challanNo'>): Promise<OutwardRecord> => {
    const newRecord: OutwardRecord = {
      ...record,
      id: Date.now(),
      challanNo: `CH-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    localOutward = [newRecord, ...localOutward];

    // Update customer stats
    const cust = localCustomers.find(c => c.id === record.customerId);
    if (cust) {
      cust.totalPieces += record.totalPieces;
      cust.totalBilled += record.totalAmount;
      cust.remainingBalance += record.totalAmount;
    }
    return newRecord;
  },

  deleteOutward: async (id: number): Promise<boolean> => {
    localOutward = localOutward.filter(o => o.id !== id);
    return true;
  },

  // 5. Payment Collection (Wasooli Entry)
  recordPayment: async (customerId: number, amount: number, _method: 'Cash' | 'Online / Bank' | 'Cheque') => {
    const cust = localCustomers.find(c => c.id === customerId);
    if (cust) {
      cust.totalPaid += amount;
      cust.remainingBalance = Math.max(0, cust.remainingBalance - amount);
      return { success: true, newBalance: cust.remainingBalance };
    }
    return { success: false, message: 'Customer not found' };
  },

  // 6. Cities & Branches
  getCities: async (): Promise<CityRecord[]> => {
    return [...localCities];
  },
};
