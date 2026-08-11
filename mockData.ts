export interface Product {
  id: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  image?: string;
  status: 'ready' | 'preorder';
  sizes: {
    size: 'S' | 'M' | 'L' | 'XL';
    quantity: number;
  }[];
  totalQuantity: number;
}

export interface Order {
  id: string;
  tripId: string;
  orderId: string;
  customer: string;
  total: number;
  status: 'pending' | 'packing' | 'ready' | 'shipped' | 'delivered';
  items: {
    productId: string;
    productName: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }[];
  address?: string;
  paymentMethod?: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface Trip {
  id: string;
  name: string;
  createdAt: string;
  status: 'active' | 'completed';
  products: Product[];
  orders: Order[];
  totalProducts: number;
  totalOrders: number;
}

export interface BuyListItem {
  id: string;
  tripId: string;
  productId: string;
  productName: string;
  size: string;
  requiredQuantity: number;
  currentStock: number;
  toBuy: number;
  status: 'pending' | 'bought';
}

export interface InventoryItem {
  productId: string;
  productName: string;
  totalStock: number;
  sizes: {
    size: 'S' | 'M' | 'L' | 'XL';
    quantity: number;
  }[];
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface FinanceRecord {
  id: string;
  type: 'capital' | 'cash' | 'bank' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  method?: 'cash' | 'bank' | 'qr';
}

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    costPrice: 12,
    sellingPrice: 25,
    status: 'ready',
    sizes: [
      { size: 'S', quantity: 15 },
      { size: 'M', quantity: 20 },
      { size: 'L', quantity: 18 },
      { size: 'XL', quantity: 10 },
    ],
    totalQuantity: 63,
  },
  {
    id: '2',
    name: 'Denim Jeans',
    costPrice: 28,
    sellingPrice: 55,
    status: 'ready',
    sizes: [
      { size: 'S', quantity: 8 },
      { size: 'M', quantity: 12 },
      { size: 'L', quantity: 10 },
      { size: 'XL', quantity: 6 },
    ],
    totalQuantity: 36,
  },
  {
    id: '3',
    name: 'Casual Polo Shirt',
    costPrice: 15,
    sellingPrice: 32,
    status: 'preorder',
    sizes: [
      { size: 'S', quantity: 5 },
      { size: 'M', quantity: 8 },
      { size: 'L', quantity: 7 },
      { size: 'XL', quantity: 3 },
    ],
    totalQuantity: 23,
  },
];

// Mock Orders
export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    tripId: '1',
    orderId: 'ORD-001',
    customer: 'Ahmad Hassan',
    total: 155,
    status: 'shipped',
    items: [
      {
        productId: '1',
        productName: 'Premium Cotton T-Shirt',
        size: 'M',
        quantity: 3,
        unitPrice: 25,
      },
      {
        productId: '2',
        productName: 'Denim Jeans',
        size: 'L',
        quantity: 2,
        unitPrice: 55,
      },
    ],
    address: '123 Jalan Merdeka, KL',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-08-08',
    shippedAt: '2024-08-10',
  },
  {
    id: '2',
    tripId: '1',
    orderId: 'ORD-002',
    customer: 'Siti Nurhaliza',
    total: 75,
    status: 'packing',
    items: [
      {
        productId: '1',
        productName: 'Premium Cotton T-Shirt',
        size: 'S',
        quantity: 2,
        unitPrice: 25,
      },
      {
        productId: '3',
        productName: 'Casual Polo Shirt',
        size: 'M',
        quantity: 1,
        unitPrice: 32,
      },
    ],
    address: '456 Persiaran Gurney, Penang',
    paymentMethod: 'cash',
    createdAt: '2024-08-09',
  },
  {
    id: '3',
    tripId: '1',
    orderId: 'ORD-003',
    customer: 'Muhammad Ali',
    total: 110,
    status: 'pending',
    items: [
      {
        productId: '2',
        productName: 'Denim Jeans',
        size: 'M',
        quantity: 2,
        unitPrice: 55,
      },
    ],
    address: '789 Jalan Sultan Ismail, Kuala Lumpur',
    paymentMethod: 'qr_pay',
    createdAt: '2024-08-11',
  },
  {
    id: '4',
    tripId: '1',
    orderId: 'ORD-004',
    customer: 'Fatimah Zahra',
    total: 130,
    status: 'ready',
    items: [
      {
        productId: '1',
        productName: 'Premium Cotton T-Shirt',
        size: 'L',
        quantity: 4,
        unitPrice: 25,
      },
      {
        productId: '3',
        productName: 'Casual Polo Shirt',
        size: 'XL',
        quantity: 1,
        unitPrice: 32,
      },
    ],
    address: '321 Kompleks Sentosa, Johor Bahru',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-08-08',
  },
];

// Mock Trips
export const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    name: 'Trip to Bangkok',
    status: 'active',
    createdAt: '2024-08-01',
    products: MOCK_PRODUCTS,
    orders: MOCK_ORDERS,
    totalProducts: 3,
    totalOrders: 4,
  },
  {
    id: '2',
    name: 'Trip to Vietnam',
    status: 'active',
    createdAt: '2024-07-20',
    products: MOCK_PRODUCTS.slice(0, 2),
    orders: MOCK_ORDERS.slice(0, 2),
    totalProducts: 2,
    totalOrders: 2,
  },
  {
    id: '3',
    name: 'Trip to Singapore',
    status: 'completed',
    createdAt: '2024-07-01',
    products: MOCK_PRODUCTS.slice(1),
    orders: MOCK_ORDERS.slice(1, 3),
    totalProducts: 2,
    totalOrders: 2,
  },
];

// Mock Buy List
export const MOCK_BUY_LIST: BuyListItem[] = [
  {
    id: '1',
    tripId: '1',
    productId: '1',
    productName: 'Premium Cotton T-Shirt',
    size: 'S',
    requiredQuantity: 20,
    currentStock: 5,
    toBuy: 15,
    status: 'pending',
  },
  {
    id: '2',
    tripId: '1',
    productId: '1',
    productName: 'Premium Cotton T-Shirt',
    size: 'L',
    requiredQuantity: 25,
    currentStock: 18,
    toBuy: 7,
    status: 'pending',
  },
  {
    id: '3',
    tripId: '1',
    productId: '2',
    productName: 'Denim Jeans',
    size: 'M',
    requiredQuantity: 15,
    currentStock: 12,
    toBuy: 3,
    status: 'bought',
  },
  {
    id: '4',
    tripId: '1',
    productId: '3',
    productName: 'Casual Polo Shirt',
    size: 'L',
    requiredQuantity: 10,
    currentStock: 2,
    toBuy: 8,
    status: 'pending',
  },
];

// Mock Inventory
export const MOCK_INVENTORY: InventoryItem[] = [
  {
    productId: '1',
    productName: 'Premium Cotton T-Shirt',
    totalStock: 63,
    sizes: [
      { size: 'S', quantity: 15 },
      { size: 'M', quantity: 20 },
      { size: 'L', quantity: 18 },
      { size: 'XL', quantity: 10 },
    ],
    status: 'in-stock',
  },
  {
    productId: '2',
    productName: 'Denim Jeans',
    totalStock: 5,
    sizes: [
      { size: 'S', quantity: 1 },
      { size: 'M', quantity: 2 },
      { size: 'L', quantity: 1 },
      { size: 'XL', quantity: 1 },
    ],
    status: 'low-stock',
  },
  {
    productId: '3',
    productName: 'Casual Polo Shirt',
    totalStock: 0,
    sizes: [
      { size: 'S', quantity: 0 },
      { size: 'M', quantity: 0 },
      { size: 'L', quantity: 0 },
      { size: 'XL', quantity: 0 },
    ],
    status: 'out-of-stock',
  },
];

// Mock Finance
export const MOCK_FINANCE: FinanceRecord[] = [
  {
    id: '1',
    type: 'capital',
    category: 'Initial Capital',
    amount: 5000,
    description: 'Starting capital for business',
    date: '2024-07-01',
  },
  {
    id: '2',
    type: 'cash',
    category: 'Sales',
    amount: 340,
    description: 'Cash sales from Trip 1',
    date: '2024-08-08',
    method: 'cash',
  },
  {
    id: '3',
    type: 'bank',
    category: 'Sales',
    amount: 265,
    description: 'Bank transfer from customers',
    date: '2024-08-09',
    method: 'bank',
  },
  {
    id: '4',
    type: 'cash',
    category: 'Expense',
    amount: 150,
    description: 'Transportation cost',
    date: '2024-08-10',
    method: 'cash',
  },
  {
    id: '5',
    type: 'bank',
    category: 'Expense',
    amount: 200,
    description: 'Shipping and packaging',
    date: '2024-08-11',
    method: 'bank',
  },
];
