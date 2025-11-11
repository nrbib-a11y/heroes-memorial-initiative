import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MonumentCard from '@/components/MonumentCard';
import MonumentForm from '@/components/MonumentForm';
import { Monument } from '@/lib/api';
import { useMonuments, useCreateMonument, useUpdateMonument, useDeleteMonument } from '@/hooks/useMonuments';
import { useToast } from '@/hooks/use-toast';

export default function MonumentsAdmin() {
  const navigate = useNavigate();
  const { data: monuments = [], isLoading: loading } = useMonuments();
  const createMonumentMutation = useCreateMonument();
  const updateMonumentMutation = useUpdateMonument();
  const deleteMonumentMutation = useDeleteMonument();
  const { toast } = useToast();
  
  const [editingMonument, setEditingMonument] = useState<Monument | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [authToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    if (!authToken) {
      navigate('/');
      return;
    }
  }, [authToken, navigate]);

  const handleSave = async (monument: Monument | Omit<Monument, 'id'>) => {
    try {
      if ('id' in monument) {
        await updateMonumentMutation.mutateAsync(monument);
        toast({
          title: 'Монумент обновлён',
          description: 'Изменения успешно сохранены',
        });
      } else {
        await createMonumentMutation.mutateAsync(monument);
        toast({
          title: 'Монумент добавлен',
          description: 'Новый монумент успешно создан',
        });
      }
      setEditingMonument(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save monument:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить монумент',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот монумент?')) return;
    
    try {
      await deleteMonumentMutation.mutateAsync(id);
      toast({
        title: 'Монумент удалён',
        description: 'Запись успешно удалена',
      });
    } catch (error) {
      console.error('Failed to delete monument:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить монумент',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <Icon name="ArrowLeft" size={16} />
                На главную
              </Button>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Building" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Управление монументами</h1>
                <p className="text-sm text-muted-foreground">Редактор памятников и мемориалов</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {!isAdding && !editingMonument && (
              <div className="mb-8">
                <Button
                  onClick={() => setIsAdding(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить монумент
                </Button>
              </div>
            )}

            {(isAdding || editingMonument) && (
              <div className="mb-8">
                <MonumentForm
                  monument={editingMonument}
                  onSave={handleSave}
                  onCancel={() => {
                    setIsAdding(false);
                    setEditingMonument(null);
                  }}
                />
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Загрузка...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {monuments.map((monument) => (
                  <MonumentCard
                    key={monument.id}
                    monument={monument}
                    onEdit={setEditingMonument}
                    onDelete={handleDelete}
                    isEditable={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}