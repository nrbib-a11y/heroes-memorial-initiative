import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Monument, monumentsAPI } from '@/lib/api';

export default function MonumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monument, setMonument] = useState<Monument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonument = async () => {
      try {
        const monuments = await monumentsAPI.getMonuments();
        const found = monuments.find(m => m.id === Number(id));
        setMonument(found || null);
      } catch (error) {
        console.error('Failed to load monument:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonument();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!monument) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Монумент не найден</h1>
          <Button onClick={() => navigate('/map')}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться к карте
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src={monument.imageUrl || 'https://cdn.poehali.dev/projects/a878be49-c92f-49fe-82c3-94c8b2b2a18a/files/fadd452a-fccd-4b16-9ffa-4c038632544a.jpg'} 
                alt={monument.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-black/40 backdrop-blur-sm text-white border-white/20">
                  {monument.type}
                </Badge>
              </div>
            </div>

            {monument.latitude && monument.longitude && (
              <div className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Icon name="MapPin" size={16} />
                  <span className="font-semibold">Координаты</span>
                </div>
                <p className="text-sm">
                  {monument.latitude.toFixed(6)}, {monument.longitude.toFixed(6)}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => navigate('/map')}
                >
                  <Icon name="Map" size={16} className="mr-2" />
                  Показать на карте
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4">{monument.name}</h1>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Icon name="MapPin" size={18} />
                <span className="text-lg">{monument.settlement}</span>
              </div>

              {monument.establishmentYear && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Calendar" size={18} />
                  <span>Установлен в {monument.establishmentYear} году</span>
                </div>
              )}
            </div>

            <div className="border-t border-primary/10 pt-6">
              <h2 className="text-xl font-semibold mb-3">Описание</h2>
              <p className="text-muted-foreground leading-relaxed">
                {monument.description}
              </p>
            </div>

            {monument.history && (
              <div className="border-t border-primary/10 pt-6">
                <h2 className="text-xl font-semibold mb-3">История</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {monument.history}
                </p>
              </div>
            )}

            {monument.condition && (
              <div className="border-t border-primary/10 pt-6">
                <h2 className="text-xl font-semibold mb-3">Состояние</h2>
                <p className="text-muted-foreground">
                  {monument.condition}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}