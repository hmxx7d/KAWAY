export type OrderStatus = 'RECEIVED' | 'SORTED' | 'IN_PROGRESS' | 'QC_REVIEW' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type Priority = 'NORMAL' | 'URGENT';

export interface Service {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  tagCode: string;
  serviceId: string;
  serviceName: string;
  status: 'PENDING' | 'IRONING' | 'QC_PENDING' | 'QC_PASSED' | 'QC_FAILED' | 'READY';
  price: number;
}

export interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  priority: Priority;
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paid: number;
    balance: number;
  };
  itemCount: number;
  items: OrderItem[];
  dueAt: string; // ISO string for simplicity
  createdAt: string; // ISO string for simplicity
  updatedAt: string; // ISO string for simplicity
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  totalOrders: number;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}
