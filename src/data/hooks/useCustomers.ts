import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer } from '../../domain/models';
import { useEffect } from 'react';
import { db } from '../../firebase';
import { collection, doc, onSnapshot, query, updateDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../../AuthProvider';

export const queryKeys = {
  customers: {
    all: ['customers'] as const,
    list: () => [...queryKeys.customers.all, 'list'] as const,
  },
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, user: any) {
  const errInfo = {
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

export function useCustomers() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'customers'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      
      queryClient.setQueryData(queryKeys.customers.list(), customers);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'customers', user);
    });

    return () => unsubscribe();
  }, [queryClient, user]);

  return useQuery({
    queryKey: queryKeys.customers.list(),
    queryFn: () => queryClient.getQueryData(queryKeys.customers.list()) as Customer[] || [],
    staleTime: Infinity,
    enabled: !!user,
  });
}

export function useCreateCustomer() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'totalOrders' | 'loyaltyPoints' | 'createdAt' | 'updatedAt'>) => {
      try {
        const now = new Date().toISOString();
        const newCustomer = {
          ...customer,
          totalOrders: 0,
          loyaltyPoints: 0,
          createdAt: now,
          updatedAt: now
        };
        
        const docRef = await addDoc(collection(db, 'customers'), newCustomer);
        return { id: docRef.id, ...newCustomer } as Customer;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'customers', user);
        throw error;
      }
    }
  });
}

export function useUpdateCustomer() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ customerId, updates }: { customerId: string, updates: Partial<Customer> }) => {
      try {
        const customerRef = doc(db, 'customers', customerId);
        await updateDoc(customerRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `customers/${customerId}`, user);
      }
    }
  });
}
