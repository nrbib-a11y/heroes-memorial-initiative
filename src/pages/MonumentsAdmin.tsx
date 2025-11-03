import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MonumentCard from '@/components/MonumentCard';
import MonumentForm from '@/components/MonumentForm';
import { monumentsAPI, Monument } from '@/lib/api';

export default function MonumentsAdmin() {
  const navigate = useNavigate();
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMonument, setEditingMonument] = useState<Monument | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [authToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    if (!authToken) {
      navigate('/');
      return;
    }
    loadMonuments();
  }, [authToken, navigate]);

  const loadMonuments = async () => {
    try {
      setLoading(true);
      const data = await monumentsAPI.getAll();
      setMonuments(data);
    } catch (error) {
      console.error('Failed to load monuments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (monument: Monument | Omit<Monument, 'id'>) => {
    try {
      if ('id' in monument) {
        await monumentsAPI.update(monument);
      } else {
        await monumentsAPI.create(monument);
      }
      await loadMonuments();
      setEditingMonument(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to save monument:', error);
      alert('Не удалось сохранить монумент');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот монумент?')) return;
    
    try {
      await monumentsAPI.delete(id);
      await loadMonuments();
    } catch (error) {
      console.error('Failed to delete monument:', error);
      alert('Не удалось удалить монумент');
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
