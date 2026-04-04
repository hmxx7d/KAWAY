import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Order, OrderStatus } from '../../domain/models';
import { db } from '../../firebase';
import { collection, doc, onSnapshot, query, where, orderBy, updateDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useAuth } from '../../AuthProvider';

export const queryKeys = {
  orders: {
    all: ['orders'] as const,
    active: ['orders', 'active'] as const,
    list: ['orders', 'list'] as const,
  }
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, user: any) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user?.uid,
      email: user?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useActiveOrdersRealtime() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('status', 'in', ['RECEIVED', 'IN_PROGRESS', 'READY', 'QC_REVIEW'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      activeOrders.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
      queryClient.setQueryData(queryKeys.orders.active, activeOrders);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders', user);
    });

    return () => unsubscribe();
  }, [queryClient, user]);

  return useQuery({
    queryKey: queryKeys.orders.active,
    queryFn: () => queryClient.getQueryData(queryKeys.orders.active) as Order[] || [],
    staleTime: Infinity,
    enabled: !!user,
  });
}

export function useDeliveredOrders() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'DELIVERED')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deliveredOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      deliveredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      queryClient.setQueryData(queryKeys.orders.list, deliveredOrders);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders', user);
    });

    return () => unsubscribe();
  }, [queryClient, user]);

  return useQuery({
    queryKey: queryKeys.orders.list,
    queryFn: () => queryClient.getQueryData(queryKeys.orders.list) as Order[] || [],
    staleTime: Infinity,
    enabled: !!user,
  });
}

export function useAllOrders() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'orders'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      queryClient.setQueryData(queryKeys.orders.all, allOrders);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders', user);
    });

    return () => unsubscribe();
  }, [queryClient, user]);

  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: () => queryClient.getQueryData(queryKeys.orders.all) as Order[] || [],
    staleTime: Infinity,
    enabled: !!user,
  });
}

export function useUpdateOrderStatus() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: OrderStatus }) => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { 
          status,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`, user);
      }
    }
  });
}

export function useUpdateOrder() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ orderId, updates }: { orderId: string, updates: Partial<Order> }) => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`, user);
      }
    }
  });
}

export function useCreateOrder() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'orderNo' | 'createdAt' | 'updatedAt'>) => {
      try {
        // Generate a simple order number
        const orderNo = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        const now = new Date().toISOString();
        
        const newOrder = {
          ...order,
          orderNo,
          createdAt: now,
          updatedAt: now
        };
        
        const docRef = await addDoc(collection(db, 'orders'), newOrder);
        return { id: docRef.id, ...newOrder } as Order;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'orders', user);
        throw error;
      }
    }
  });
}
