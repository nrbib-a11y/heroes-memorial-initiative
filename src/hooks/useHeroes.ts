import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { heroesAPI, Hero } from '@/lib/api';

export function useHeroes() {
  return useQuery({
    queryKey: ['heroes'],
    queryFn: () => heroesAPI.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHero(id: number) {
  return useQuery({
    queryKey: ['hero', id],
    queryFn: () => heroesAPI.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCreateHero() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (hero: Omit<Hero, 'id'>) => heroesAPI.create(hero),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });
}

export function useUpdateHero() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (hero: Hero) => heroesAPI.update(hero),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
      queryClient.invalidateQueries({ queryKey: ['hero', variables.id] });
    },
  });
}

export function useDeleteHero() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => heroesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroes'] });
    },
  });
}
