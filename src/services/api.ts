/**
 * Khan Jacket House - Mobile API Service
 * Connects to Express/MySQL backend with reliable offline mock fallback
 */

import { getDefaultApiUrl } from '../config/env';
import { formatCustomerDisplayName } from '../utils/formatters';

export { formatCustomerDisplayName };

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
  daysPending?: number;
  lastPaymentDate?: string;
}

export interface Article {
  id: number;
  articleNo: string;
  name: string;
  category: string;
  stuff?: string;
  currentStock: number;
  initialStock?: number;
  totalPurchased?: number;
  totalOut?: number;
  unitPrice: number;
  color?: string;
  sizes?: string | string[];
  warehouseLocation?: string;
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
  status: 'Delivered' | 'In Transit' | 'Pending' | 'dispatched' | 'Dispatched';
  transportName?: string;
  articleNo?: string;
  articleName?: string;
  isWithoutStock?: boolean;
  notes?: string;
  biltyNo?: string;
  goodsName?: string;
}

export interface PaymentRecord {
  id: number;
  receiptNo: string;
  customerId: number;
  customerName: string;
  city: string;
  route?: string;
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Online / Bank' | 'Cheque';
  notes?: string;
  refNo?: string;
}

export interface ClearancePaymentEntry {
  id: number;
  clearanceId: number;
  amount: number;
  paymentMethod: string;
  date: string;
  referenceNo?: string;
  notes?: string;
}

export interface ClearanceBill {
  id: number;
  billNo: string;
  clearingAgent: string;
  party?: string;
  containerNo: string;
  containerSize?: string;
  blNo?: string;
  gdNo?: string;
  port: string;
  date: string;
  customDuty: number;
  shippingLineCharges: number;
  portPayment?: number;
  clearanceCharges: number;
  dryPortExpenses: number;
  agencyFee: number;
  craneLabour?: number;
  railway?: number;
  otherExpenses: number;
  totalAmount: number;
  paidAmount: number;
  remainingDue: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  payments?: ClearancePaymentEntry[];
}

export interface CityRecord {
  id: number;
  name: string;
  shopsCount: number;
  totalPieces: number;
  areas: string[];
  province?: string;
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
    shopName: 'MK Collection',
    shopkeeperName: 'MK Collection',
    city: 'Lahore',
    area: 'Brandreth Road',
    phone: '0300-9876543',
    marketAddress: 'Brandreth Road, Shop # 12',
    totalPieces: 150,
    totalBilled: 14950,
    totalPaid: 1222,
    remainingBalance: 13728,
    inUgrahi: true,
    ugrahiRoute: 'Lahore',
    daysPending: 1,
    lastPaymentDate: '2026-11-18',
  },
  {
    id: 2,
    shopName: 'Khan Jacket House',
    shopkeeperName: 'Khan Jacket House',
    city: 'Lahore',
    area: 'Cantt',
    phone: '0321-7788990',
    marketAddress: 'Wholesale Depot, Hall # 1',
    totalPieces: 200,
    totalBilled: 13000,
    totalPaid: 9000000,
    remainingBalance: -8987000,
    inUgrahi: true,
    ugrahiRoute: 'Lahore',
    daysPending: 1,
    lastPaymentDate: '2026-11-18',
  },
  {
    id: 3,
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
    daysPending: 12,
    lastPaymentDate: '2026-11-06',
  },
  {
    id: 4,
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
    daysPending: 0,
    lastPaymentDate: '2026-11-12',
  },
  {
    id: 5,
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
    daysPending: 15,
    lastPaymentDate: '2026-11-03',
  },
  {
    id: 6,
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
    daysPending: 20,
    lastPaymentDate: '2026-10-29',
  },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    articleNo: 'JKT-101',
    name: 'Men Winter Puffer Jacket (Double Hood)',
    category: 'Puffer Jacket',
    stuff: 'Waterproof Nylon',
    currentStock: 0,
    initialStock: 500,
    totalPurchased: 500,
    totalOut: 500,
    unitPrice: 1650,
    color: 'Black, Navy, Olive',
    sizes: 'M, L, XL, XXL',
    warehouseLocation: 'Main Godown (Section A)',
  },
  {
    id: 2,
    articleNo: 'JKT-204',
    name: 'Biker Leather Finished Jacket',
    category: 'Leather Jacket',
    stuff: 'Genuine Finished PU',
    currentStock: 15,
    initialStock: 250,
    totalPurchased: 250,
    totalOut: 235,
    unitPrice: 2400,
    color: 'Tan Brown, Black',
    sizes: 'L, XL',
    warehouseLocation: 'Central Racks (Shelf 3)',
  },
  {
    id: 3,
    articleNo: 'JKT-310',
    name: 'Waterproof Parachute Windbreaker',
    category: 'Windbreaker',
    stuff: 'Parachute Polyester',
    currentStock: 38,
    initialStock: 200,
    totalPurchased: 200,
    totalOut: 162,
    unitPrice: 1250,
    color: 'Dark Grey, Royal Blue',
    sizes: 'M, L, XL',
    warehouseLocation: 'Godown 2 (Bay B)',
  },
  {
    id: 4,
    articleNo: 'JKT-415',
    name: 'China Fleece Lined Bomber Jacket',
    category: 'Bomber',
    stuff: 'Thermal Fleece',
    currentStock: 42,
    initialStock: 150,
    totalPurchased: 150,
    totalOut: 108,
    unitPrice: 1800,
    color: 'Maroon, Jet Black',
    sizes: 'S, M, L, XL',
    warehouseLocation: 'Aisle 4',
  },
  {
    id: 5,
    articleNo: 'JKT-520',
    name: 'Reversible Heavy Duck Down Jacket',
    category: 'Down Jacket',
    stuff: 'Micro Down / Nylon',
    currentStock: 85,
    initialStock: 180,
    totalPurchased: 180,
    totalOut: 95,
    unitPrice: 2850,
    color: 'Olive Green, Charcoal',
    sizes: 'L, XL, XXL',
    warehouseLocation: 'Main Godown',
  },
  {
    id: 6,
    articleNo: 'JKT-630',
    name: 'Kids Padded Winter Hooded Coat',
    category: 'Kids Garments',
    stuff: 'Quilted Cotton',
    currentStock: 380,
    initialStock: 400,
    totalPurchased: 400,
    totalOut: 20,
    unitPrice: 950,
    color: 'Red, Royal Blue, Yellow',
    sizes: '26, 28, 30, 32',
    warehouseLocation: 'Kids Section',
  },
];

const INITIAL_OUTWARD: OutwardRecord[] = [
  {
    id: 1,
    challanNo: '1056365',
    customerId: 1,
    customerName: 'MK Collection',
    city: 'Lahore',
    date: '2026-11-18',
    totalPieces: 50,
    totalAmount: 1950,
    status: 'Delivered',
    transportName: 'Direct Delivery',
    articleNo: 'JKT-KHADER',
    articleName: 'Garment KHADER - Warehouse to MK Collection Transfer',
    isWithoutStock: true,
  },
  {
    id: 2,
    challanNo: '4158692',
    customerId: 1,
    customerName: 'MK Collection',
    city: 'Lahore',
    date: '2026-11-18',
    totalPieces: 100,
    totalAmount: 13000,
    status: 'Delivered',
    transportName: 'Shop Van Transfer',
    articleNo: 'JKT-TEST',
    articleName: 'Test Jacket Consignment',
    isWithoutStock: false,
  },
  {
    id: 3,
    challanNo: '7464234',
    customerId: 2,
    customerName: 'Khan Jacket House',
    city: 'Lahore',
    date: '2026-11-18',
    totalPieces: 200,
    totalAmount: 13000,
    status: 'Delivered',
    transportName: 'Main Outlet Transit',
    articleNo: 'JKT-101',
    articleName: 'Men Winter Puffer Jacket',
    isWithoutStock: false,
  },
  {
    id: 4,
    challanNo: 'CH-8901',
    customerId: 3,
    customerName: 'Hassan Raza Garments',
    city: 'Lahore',
    date: '2026-11-12',
    totalPieces: 80,
    totalAmount: 132000,
    status: 'Delivered',
    transportName: 'Bilal Goods Cargo',
    articleNo: 'JKT-204',
    articleName: 'Biker Leather Finished Jacket',
  },
  {
    id: 5,
    challanNo: 'CH-8902',
    customerId: 4,
    customerName: 'Hassan Ashfaq Shop',
    city: 'Islamabad',
    date: '2026-11-11',
    totalPieces: 60,
    totalAmount: 99000,
    status: 'In Transit',
    transportName: 'Skyline Logistics Rawalpindi',
    articleNo: 'JKT-101',
    articleName: 'Men Winter Puffer Jacket',
  },
  {
    id: 6,
    challanNo: 'CH-8903',
    customerId: 6,
    customerName: 'Bismillah Jacket Centre',
    city: 'Sheikhupura',
    date: '2026-11-10',
    totalPieces: 45,
    totalAmount: 67500,
    status: 'Delivered',
    transportName: 'Local Van Delivery',
    articleNo: 'JKT-310',
    articleName: 'Waterproof Parachute Windbreaker',
  },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 1,
    receiptNo: 'REC-1056365',
    customerId: 1,
    customerName: 'MK Collection',
    city: 'Lahore',
    amount: 1111,
    date: '2026-11-18',
    paymentMethod: 'Cash',
    notes: 'Cash received against Challan #1056365',
    refNo: 'REC-1056365',
  },
  {
    id: 2,
    receiptNo: 'REC-4158692',
    customerId: 1,
    customerName: 'MK Collection',
    city: 'Lahore',
    amount: 111,
    date: '2026-11-18',
    paymentMethod: 'Cash',
    notes: 'Cash received against Challan #4158692',
    refNo: 'REC-4158692',
  },
  {
    id: 3,
    receiptNo: 'REC-7464234',
    customerId: 2,
    customerName: 'Khan Jacket House',
    city: 'Lahore',
    amount: 9000000,
    date: '2026-11-18',
    paymentMethod: 'Cash',
    notes: 'Cash received against Challan #7464234 (Shop Cash Deposit)',
    refNo: 'REC-7464234',
  },
  {
    id: 4,
    receiptNo: 'REC-8901',
    customerId: 3,
    customerName: 'Hassan Raza Garments',
    city: 'Lahore',
    amount: 100000,
    date: '2026-11-16',
    paymentMethod: 'Cash',
    notes: 'Partial payment received on Lahore collection route',
    refNo: 'REC-8901',
  },
  {
    id: 5,
    receiptNo: 'REC-8902',
    customerId: 5,
    customerName: 'Al-Madina Garments',
    city: 'Lahore',
    amount: 1000,
    date: '2026-11-15',
    paymentMethod: 'Online / Bank',
    notes: 'Bank transfer received via Meezan Bank',
    refNo: 'REC-8902',
  },
];

const INITIAL_CLEARANCES: ClearanceBill[] = [
  {
    id: 1,
    billNo: '#Debitis voluptatem',
    clearingAgent: 'Consequuntur optio',
    party: 'Et repellendus Labo..',
    containerNo: 'Ea sit eiusmod..',
    containerSize: '20 FT',
    blNo: 'Blanditiis voluptatu',
    gdNo: 'GD: Qui anim aut ullam e',
    port: 'DryPort Lahore',
    date: '2026-11-19',
    customDuty: 68,
    shippingLineCharges: 120,
    clearanceCharges: 80,
    dryPortExpenses: 110,
    agencyFee: 50,
    otherExpenses: 21,
    totalAmount: 449,
    paidAmount: 49,
    remainingDue: 400,
    status: 'Partial',
    payments: [
      {
        id: 1,
        clearanceId: 1,
        amount: 49,
        paymentMethod: 'Cash (Voucher #101)',
        date: '2026-11-19',
        referenceNo: 'CLR-REC-01',
        notes: 'Initial advance installment to Barca clearing agent',
      },
    ],
  },
  {
    id: 2,
    billNo: '#Laborum Animi corr',
    clearingAgent: 'Aperiam ut quis dolo',
    party: 'Party: Consequatur dolor m..',
    containerNo: 'Ad voluptatem ..',
    containerSize: '40 FT',
    blNo: 'Amet et fugiat inve',
    gdNo: 'GD: Vel ut nisi libero a',
    port: 'Port Qasim Karachi',
    date: '2026-11-15',
    customDuty: 95,
    shippingLineCharges: 250,
    clearanceCharges: 180,
    dryPortExpenses: 120,
    agencyFee: 80,
    otherExpenses: 53,
    totalAmount: 778,
    paidAmount: 100,
    remainingDue: 678,
    status: 'Partial',
    payments: [
      {
        id: 2,
        clearanceId: 2,
        amount: 100,
        paymentMethod: 'Online Bank Transfer',
        date: '2026-11-16',
        referenceNo: 'CLR-REC-02',
        notes: 'Railway and port crane clearance payment',
      },
    ],
  },
];

const INITIAL_CITIES: CityRecord[] = [
  { id: 1, name: 'Lahore', shopsCount: 7, totalPieces: 470, areas: ['Anarkali', 'Azam Market', 'Brandreth Road', 'Cantt', 'Shah Alam', 'Shahdara'] },
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
let localPayments = [...INITIAL_PAYMENTS];
let localClearances = [...INITIAL_CLEARANCES];
let localCities = [...INITIAL_CITIES];

// Smart backend reachability cache (prevents 2s timeouts on screens when backend is offline)
let isBackendLive: boolean | null = null;
let lastReachabilityCheck = 0;
const REACHABILITY_TTL = 30000; // 30 seconds
const FAST_TIMEOUT_MS = 600; // Snappy 600ms timeout for live backend

const shouldProbeBackend = (): boolean => {
  if (isBackendLive === false && Date.now() - lastReachabilityCheck < REACHABILITY_TTL) {
    return false; // Skip network call, return instant data in 0ms
  }
  return true;
};

export const mobileApi = {
  // Synchronous Instant Getters (0ms UI render)
  getArticlesSync: (): Article[] => [...localArticles],
  getCustomersSync: (): Customer[] => [...localCustomers],
  getOutwardSync: (): OutwardRecord[] => [...localOutward],
  getPaymentsSync: (): PaymentRecord[] => [...localPayments],
  getClearancesSync: (): ClearanceBill[] => [...localClearances],
  getCitiesSync: (): CityRecord[] => [...localCities],

  getDashboardMetricsSync: () => {
    const totalMalSent = localCustomers.reduce((acc, c) => acc + (c.totalPieces || 0), 0);
    const totalBilled = localOutward.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const totalReceived = localPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
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

  // 1. Dashboard Metrics
  getDashboardMetrics: async () => {
    if (shouldProbeBackend()) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FAST_TIMEOUT_MS);
        const res = await fetch(`${API_BASE_URL}/reports/dashboard`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            isBackendLive = true;
            lastReachabilityCheck = Date.now();
            return json.data;
          }
        }
      } catch {
        isBackendLive = false;
        lastReachabilityCheck = Date.now();
      }
    }

    return mobileApi.getDashboardMetricsSync();
  },

  // 2. Customers (CRUD)
  getCustomers: async (): Promise<Customer[]> => {
    if (shouldProbeBackend()) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FAST_TIMEOUT_MS);
        const res = await fetch(`${API_BASE_URL}/customers`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            isBackendLive = true;
            lastReachabilityCheck = Date.now();
            return json.data;
          }
        }
      } catch {
        isBackendLive = false;
        lastReachabilityCheck = Date.now();
      }
    }
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
    if (shouldProbeBackend()) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FAST_TIMEOUT_MS);
        const res = await fetch(`${API_BASE_URL}/articles`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            isBackendLive = true;
            lastReachabilityCheck = Date.now();
            return json.data;
          }
        }
      } catch {
        isBackendLive = false;
        lastReachabilityCheck = Date.now();
      }
    }
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
    if (shouldProbeBackend()) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FAST_TIMEOUT_MS);
        const res = await fetch(`${API_BASE_URL}/outward`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            isBackendLive = true;
            lastReachabilityCheck = Date.now();
            return json.data;
          }
        }
      } catch {
        isBackendLive = false;
        lastReachabilityCheck = Date.now();
      }
    }
    return [...localOutward];
  },

  addOutward: async (record: Partial<OutwardRecord> & { customerId: number; totalPieces: number; totalAmount: number }): Promise<OutwardRecord> => {
    const newRecord: OutwardRecord = {
      date: new Date().toISOString().split('T')[0],
      customerName: 'Customer',
      city: 'Lahore',
      status: 'Delivered',
      ...record,
      id: Date.now(),
      challanNo: record.challanNo || `CH-${Math.floor(1000 + Math.random() * 9000)}`,
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

  createOutward: async (record: any): Promise<OutwardRecord> => {
    return mobileApi.addOutward(record);
  },

  deleteOutward: async (id: number): Promise<boolean> => {
    localOutward = localOutward.filter(o => o.id !== id);
    return true;
  },

  // 5. Payment Collection (Customer Wasooli)
  getPayments: async (): Promise<PaymentRecord[]> => {
    if (shouldProbeBackend()) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FAST_TIMEOUT_MS);
        const res = await fetch(`${API_BASE_URL}/payments/customer`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            isBackendLive = true;
            lastReachabilityCheck = Date.now();
            return json.data;
          }
        }
      } catch {
        isBackendLive = false;
        lastReachabilityCheck = Date.now();
      }
    }
    return [...localPayments];
  },

  recordPayment: async (
    customerId: number,
    amount: number,
    method: 'Cash' | 'Online / Bank' | 'Cheque',
    notes?: string
  ) => {
    const cust = localCustomers.find(c => c.id === customerId);
    if (cust) {
      cust.totalPaid += amount;
      cust.remainingBalance = cust.remainingBalance - amount;
      cust.daysPending = 0;
      cust.lastPaymentDate = new Date().toISOString().split('T')[0];

      const newPayment: PaymentRecord = {
        id: Date.now(),
        receiptNo: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: cust.id,
        customerName: cust.shopName,
        city: cust.city,
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: method,
        notes: notes || `Wasooli recorded for ${cust.shopName}`,
      };
      localPayments = [newPayment, ...localPayments];

      return { success: true, newBalance: cust.remainingBalance, payment: newPayment };
    }
    return { success: false, message: 'Customer not found' };
  },

  // 6. Clearance Bills & Agents Khata
  getClearances: async (): Promise<ClearanceBill[]> => {
    if (shouldProbeBackend()) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FAST_TIMEOUT_MS);
        const res = await fetch(`${API_BASE_URL}/clearance`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            isBackendLive = true;
            lastReachabilityCheck = Date.now();
            return json.data;
          }
        }
      } catch {
        isBackendLive = false;
        lastReachabilityCheck = Date.now();
      }
    }
    return [...localClearances];
  },

  recordClearancePayment: async (
    clearanceId: number,
    amount: number,
    method: string,
    notes?: string
  ): Promise<{ success: boolean; updated?: ClearanceBill }> => {
    const clr = localClearances.find(c => c.id === clearanceId);
    if (clr) {
      const amt = Number(amount) || 0;
      clr.paidAmount = (clr.paidAmount || 0) + amt;
      clr.remainingDue = Math.max(0, (clr.totalAmount || 0) - clr.paidAmount);
      clr.status = clr.remainingDue <= 0 ? 'Paid' : 'Partial';

      const entry: ClearancePaymentEntry = {
        id: Date.now(),
        clearanceId: clr.id,
        amount: amt,
        paymentMethod: method || 'Cash',
        date: new Date().toISOString().split('T')[0],
        referenceNo: `CLR-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: notes || 'Clearance duty installment',
      };
      clr.payments = [entry, ...(clr.payments || [])];

      return { success: true, updated: clr };
    }
    return { success: false };
  },

  // 7. Cities & Branches
  getCities: async (): Promise<CityRecord[]> => {
    return [...localCities];
  },
};
