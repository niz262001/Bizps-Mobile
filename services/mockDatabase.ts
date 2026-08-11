import { useEffect, useState } from 'react';

export type ProductStatus = 'ready' | 'preorder';
export type ProductSize = 'S' | 'M' | 'L' | 'XL';
export type OrderStatus = 'pending' | 'packing' | 'ready' | 'shipped' | 'delivered';
export type PaymentMethod = 'cash' | 'bank' | 'qr';
export type PaymentStatus = 'pending' | 'paid' | 'partial';

export interface Product {
  id: string;
  tripId: string;
  name: string;
  image: string;
  costPrice: number;
  sellingPrice: number;
  status: ProductStatus;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: ProductSize;
  stock: number;
}

export interface Order {
  id: string;
  tripId: string;
  customerName: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingFee: number;
  total: number;
  status: OrderStatus;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
}

export interface BuyListItem {
  id: string;
  tripId: string;
  productVariantId: string;
  quantity: number;
  purchased: boolean;
}

export interface TripRecord {
  id: string;
  name: string;
  status: 'active' | 'completed';
  createdAt: string;
}

export interface MockDatabaseSnapshot {
  trips: TripRecord[];
  products: Product[];
  productVariants: ProductVariant[];
  orders: Order[];
  orderItems: OrderItem[];
  buyListItems: BuyListItem[];
}

const LOW_STOCK_THRESHOLD = 5;

const initialProducts: Product[] = [
  {
    id: 'product-1',
    tripId: 'trip-1',
    name: 'Basic Tee',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    costPrice: 16,
    sellingPrice: 35,
    status: 'ready',
  },
  {
    id: 'product-2',
    tripId: 'trip-1',
    name: 'Classic Denim',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    costPrice: 24,
    sellingPrice: 48,
    status: 'ready',
  },
  {
    id: 'product-3',
    tripId: 'trip-2',
    name: 'Travel Tote',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    costPrice: 20,
    sellingPrice: 42,
    status: 'preorder',
  },
];

const initialVariants: ProductVariant[] = [
  { id: 'variant-1', productId: 'product-1', size: 'S', stock: 2 },
  { id: 'variant-2', productId: 'product-1', size: 'M', stock: 2 },
  { id: 'variant-3', productId: 'product-1', size: 'L', stock: 3 },
  { id: 'variant-4', productId: 'product-2', size: 'M', stock: 4 },
  { id: 'variant-5', productId: 'product-2', size: 'L', stock: 1 },
  { id: 'variant-6', productId: 'product-3', size: 'S', stock: 1 },
  { id: 'variant-7', productId: 'product-3', size: 'M', stock: 0 },
];

const initialOrders: Order[] = [
  {
    id: 'order-1',
    tripId: 'trip-1',
    customerName: 'Aisha Rahman',
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    shippingFee: 8,
    total: 118,
    status: 'packing',
  },
  {
    id: 'order-2',
    tripId: 'trip-1',
    customerName: 'Daniel Low',
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    shippingFee: 0,
    total: 70,
    status: 'pending',
  },
  {
    id: 'order-3',
    tripId: 'trip-2',
    customerName: 'Mina Chen',
    paymentMethod: 'qr',
    paymentStatus: 'paid',
    shippingFee: 5,
    total: 94,
    status: 'ready',
  },
  {
    id: 'order-4',
    tripId: 'trip-3',
    customerName: 'Ravi Kumar',
    paymentMethod: 'bank',
    paymentStatus: 'paid',
    shippingFee: 6,
    total: 90,
    status: 'shipped',
  },
];

const initialOrderItems: OrderItem[] = [
  { id: 'order-item-1', orderId: 'order-1', productVariantId: 'variant-2', quantity: 2 },
  { id: 'order-item-2', orderId: 'order-2', productVariantId: 'variant-2', quantity: 5 },
  { id: 'order-item-3', orderId: 'order-3', productVariantId: 'variant-6', quantity: 2 },
  { id: 'order-item-4', orderId: 'order-4', productVariantId: 'variant-4', quantity: 2 },
];

const initialBuyList: BuyListItem[] = [
  { id: 'buy-list-1', tripId: 'trip-1', productVariantId: 'variant-2', quantity: 3, purchased: false },
];

const initialTrips: TripRecord[] = [
  { id: 'trip-1', name: 'Trip to Bangkok', status: 'active', createdAt: '2024-08-01' },
  { id: 'trip-2', name: 'Trip to Vietnam', status: 'active', createdAt: '2024-07-20' },
  { id: 'trip-3', name: 'Trip to Singapore', status: 'completed', createdAt: '2024-07-01' },
];

let state: MockDatabaseSnapshot = {
  trips: initialTrips,
  products: initialProducts,
  productVariants: initialVariants,
  orders: initialOrders,
  orderItems: initialOrderItems,
  buyListItems: initialBuyList,
};

const listeners = new Set<() => void>();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getMockDatabaseSnapshot(): MockDatabaseSnapshot {
  return clone(state);
}

export function subscribeMockDatabase(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMockDatabase() {
  const [snapshot, setSnapshot] = useState<MockDatabaseSnapshot>(getMockDatabaseSnapshot);

  useEffect(() => {
    const unsubscribe = subscribeMockDatabase(() => {
      setSnapshot(getMockDatabaseSnapshot());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return snapshot;
}

export function getTripProducts(tripId: string, snapshot = state) {
  return snapshot.products.filter((product) => product.tripId === tripId);
}

export function getTripOrders(tripId: string, snapshot = state) {
  return snapshot.orders.filter((order) => order.tripId === tripId);
}

export function getTripBuyListItems(tripId: string, snapshot = state) {
  return snapshot.buyListItems.filter((item) => item.tripId === tripId && !item.purchased);
}

export function getProductVariant(productVariantId: string, snapshot = state) {
  return snapshot.productVariants.find((variant) => variant.id === productVariantId);
}

export function getProduct(productId: string, snapshot = state) {
  return snapshot.products.find((product) => product.id === productId);
}

export function getProductVariantByProduct(productId: string, snapshot = state) {
  return snapshot.productVariants.filter((variant) => variant.productId === productId);
}

export function createOrder(input: {
  tripId: string;
  productVariantId: string;
  quantity: number;
  customerName?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  shippingFee?: number;
}) {
  const productVariant = getProductVariant(input.productVariantId, state);
  const product = productVariant ? getProduct(productVariant.productId, state) : undefined;

  if (!productVariant || !product) {
    return null;
  }

  const reservedAmount = Math.min(productVariant.stock, input.quantity);
  const shortage = input.quantity - reservedAmount;
  const nextStock = productVariant.stock - reservedAmount;

  state.productVariants = state.productVariants.map((variant) =>
    variant.id === productVariant.id
      ? { ...variant, stock: nextStock }
      : variant
  );

  const orderId = `order-${Date.now()}`;
  const orderItemId = `order-item-${Date.now()}`;
  const orderTotal = product.sellingPrice * input.quantity + (input.shippingFee ?? 0);

  const order: Order = {
    id: orderId,
    tripId: input.tripId,
    customerName: input.customerName ?? 'New Customer',
    paymentMethod: input.paymentMethod ?? 'cash',
    paymentStatus: input.paymentStatus ?? 'paid',
    shippingFee: input.shippingFee ?? 0,
    total: orderTotal,
    status: shortage > 0 ? 'pending' : 'packing',
  };

  state.orders = [...state.orders, order];
  state.orderItems = [
    ...state.orderItems,
    {
      id: orderItemId,
      orderId,
      productVariantId: input.productVariantId,
      quantity: input.quantity,
    },
  ];

  if (shortage > 0) {
    const existingItem = state.buyListItems.find(
      (item) => item.tripId === input.tripId && item.productVariantId === input.productVariantId && !item.purchased
    );

    if (existingItem) {
      state.buyListItems = state.buyListItems.map((item) =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + shortage }
          : item
      );
    } else {
      state.buyListItems = [
        ...state.buyListItems,
        {
          id: `buy-list-${Date.now()}`,
          tripId: input.tripId,
          productVariantId: input.productVariantId,
          quantity: shortage,
          purchased: false,
        },
      ];
    }
  }

  emit();
  return order;
}

export function markBuyListItemBought(itemId: string) {
  const item = state.buyListItems.find((buyItem) => buyItem.id === itemId);
  if (!item) return null;

  const productVariant = getProductVariant(item.productVariantId, state);
  if (!productVariant) return null;

  state.productVariants = state.productVariants.map((variant) =>
    variant.id === item.productVariantId ? { ...variant, stock: variant.stock + item.quantity } : variant
  );

  state.buyListItems = state.buyListItems.filter((buyItem) => buyItem.id !== itemId);

  const linkedOrder = state.orders.find((order) => {
    if (order.tripId !== item.tripId || order.status !== 'pending') {
      return false;
    }

    return state.orderItems.some((orderItem) => orderItem.orderId === order.id && orderItem.productVariantId === item.productVariantId);
  });

  if (linkedOrder) {
    state.orders = state.orders.map((order) =>
      order.id === linkedOrder.id ? { ...order, status: 'packing' } : order
    );
  }

  emit();
  return true;
}

export function updateBuyListItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    state.buyListItems = state.buyListItems.filter((item) => item.id !== itemId);
    emit();
    return true;
  }

  state.buyListItems = state.buyListItems.map((item) =>
    item.id === itemId ? { ...item, quantity } : item
  );

  emit();
  return true;
}

export function addStock(productVariantId: string, amount: number) {
  state.productVariants = state.productVariants.map((variant) =>
    variant.id === productVariantId ? { ...variant, stock: variant.stock + amount } : variant
  );
  emit();
  return true;
}

export function reduceStock(productVariantId: string, amount: number) {
  state.productVariants = state.productVariants.map((variant) =>
    variant.id === productVariantId
      ? { ...variant, stock: Math.max(0, variant.stock - amount) }
      : variant
  );
  emit();
  return true;
}

export function getDashboardCounts(snapshot = state) {
  const grouped = snapshot.orders.reduce(
    (acc, order) => {
      acc[order.status] += 1;
      return acc;
    },
    {
      pending: 0,
      packing: 0,
      ready: 0,
      shipped: 0,
      delivered: 0,
    } as Record<OrderStatus, number>
  );

  return {
    totalOrders: snapshot.orders.length,
    pendingPurchase: grouped.pending,
    packing: grouped.packing,
    readyToShip: grouped.ready,
    shipped: grouped.shipped,
    delivered: grouped.delivered,
  };
}

export function getInventorySummary(snapshot = state) {
  const products = snapshot.products;
  const variants = snapshot.productVariants;
  const lowStock = variants.filter((variant) => variant.stock > 0 && variant.stock <= LOW_STOCK_THRESHOLD).length;
  const outOfStock = variants.filter((variant) => variant.stock === 0).length;

  return {
    totalProducts: products.length,
    lowStock,
    outOfStock,
  };
}

export function getVariantDisplayInfo(variantId: string, snapshot = state) {
  const variant = getProductVariant(variantId, snapshot);
  const product = variant ? getProduct(variant.productId, snapshot) : undefined;

  return variant && product ? { variant, product } : null;
}
