import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MonumentCard from '@/components/MonumentCard';
import { Monument } from '@/lib/api';

interface MonumentsSectionProps {
  monuments: Monument[];
  authToken: string | null;
  selectedMonumentImage: string | null;
  onSelectMonumentImage: (imageUrl: string | null) => void;
}

export default function MonumentsSection({
  monuments,
  authToken,
  selectedMonumentImage,
  onSelectMonumentImage,
}: MonumentsSectionProps) {
  const navigate = useNavigate();

  return (
    <section id="monuments" className="py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-primary mb-2">Монументы и памятники</h3>
            <p className="text-muted-foreground">Места памяти защитников Отечества</p>
          </div>
          {authToken && (
            <Button onClick={() => navigate('/monuments/admin')} variant="outline" className="gap-2">
              <Icon name="Settings" size={16} />
              Управление
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {monuments.slice(0, 6).map((monument) => (
            <MonumentCard
              key={monument.id}
              monument={monument}
            />
          ))}
        </div>

        {monuments.length > 6 && (
          <div className="text-center">
            <Button onClick={() => navigate('/monuments/admin')} variant="outline" size="lg" className="gap-2">
              Показать все монументы
              <Icon name="ArrowRight" size={16} />
            </Button>
          </div>
        )}
      </div>

      {selectedMonumentImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => onSelectMonumentImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => onSelectMonumentImage(null)}
            >
              <Icon name="X" size={24} />
            </Button>
            <img
              src={selectedMonumentImage}
              alt="Monument"
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
}
