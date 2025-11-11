import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { monumentsAPI, Monument } from '@/lib/api';

export function useMonuments() {
  return useQuery({
    queryKey: ['monuments'],
    queryFn: () => monumentsAPI.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonument(id: number) {
  return useQuery({
    queryKey: ['monument', id],
    queryFn: () => monumentsAPI.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCreateMonument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (monument: Omit<Monument, 'id'>) => monumentsAPI.create(monument),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monuments'] });
    },
  });
}

export function useUpdateMonument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (monument: Monument) => monumentsAPI.update(monument),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['monuments'] });
      queryClient.invalidateQueries({ queryKey: ['monument', variables.id] });
    },
  });
}

export function useDeleteMonument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => monumentsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monuments'] });
    },
  });
}
