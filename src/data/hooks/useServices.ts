import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Service } from '../../domain/models';
import { useEffect } from 'react';
import { db } from '../../firebase';
import { collection, doc, onSnapshot, query, updateDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../../AuthProvider';

export const queryKeys = {
  services: {
    all: ['services'] as const,
    list: () => [...queryKeys.services.all, 'list'] as const,
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

export function useServices() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'services'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const services = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      queryClient.setQueryData(queryKeys.services.list(), services);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services', user);
    });

    return () => unsubscribe();
  }, [queryClient, user]);

  return useQuery({
    queryKey: queryKeys.services.list(),
    queryFn: () => queryClient.getQueryData(queryKeys.services.list()) as Service[] || [],
    staleTime: Infinity,
    enabled: !!user,
  });
}

export function useCreateService() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const now = new Date().toISOString();
        const newService = {
          ...service,
          createdAt: now,
          updatedAt: now
        };
        
        const docRef = await addDoc(collection(db, 'services'), newService);
        return { id: docRef.id, ...newService } as Service;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'services', user);
        throw error;
      }
    }
  });
}

export function useUpdateService() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ serviceId, updates }: { serviceId: string, updates: Partial<Service> }) => {
      try {
        const serviceRef = doc(db, 'services', serviceId);
        await updateDoc(serviceRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `services/${serviceId}`, user);
      }
    }
  });
}
