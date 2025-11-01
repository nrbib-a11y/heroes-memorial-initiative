import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Hero {
  id: number;
  name: string;
  birthYear: number;
  deathYear?: number;
  rank: string;
  unit: string;
  awards: string[];
  hometown: string;
  region: string;
  photo?: string;
}

interface HeroDetailModalProps {
  hero: Hero | null;
  open: boolean;
  onClose: () => void;
}

export default function HeroDetailModal({ hero, open, onClose }: HeroDetailModalProps) {
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const [heroDocuments, setHeroDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hero && open) {
      loadHeroFiles();
    }
  }, [hero, open]);

  const loadHeroFiles = async () => {
    if (!hero) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://functions.poehali.dev/5b374262-df50-4d0c-a58d-7670e30be3c1?hero_id=${hero.id}`
      );
      const files = await response.json();
      const photo = files.find((f: any) => f.file_type === 'photo');
      if (photo?.file_data) {
        setHeroPhoto(photo.file_data);
      } else {
        setHeroPhoto(null);
      }
      const documents = files.filter((f: any) => f.file_type === 'document');
      setHeroDocuments(documents);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hero) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Icon name="Star" size={24} className="text-primary" />
            {hero.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {heroPhoto && (
            <div className="flex justify-center">
              <img
                src={heroPhoto}
                alt={hero.name}
                className="w-48 h-48 rounded-lg object-cover border-4 border-primary/30 shadow-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Год рождения</span>
              <p className="text-lg font-semibold">{hero.birthYear}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Год смерти</span>
              <p className="text-lg font-semibold">{hero.deathYear || 'Не указан'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Звание</span>
            <p className="text-base">{hero.rank}</p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Воинская часть</span>
            <p className="text-base">{hero.unit}</p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="MapPin" size={16} />
              Населенный пункт
            </span>
            <p className="text-base">{hero.hometown}</p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Регион</span>
            <p className="text-base">{hero.region}</p>
          </div>

          {hero.awards.length > 0 && (
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Medal" size={16} />
                Награды
              </span>
              <div className="flex flex-wrap gap-2">
                {hero.awards.map((award, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-secondary/20 text-secondary-foreground border border-secondary/30 text-sm px-3 py-1"
                  >
                    {award}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {heroDocuments.length > 0 && (
            <div className="space-y-3">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="FileText" size={16} />
                Архивные документы
              </span>
              <div className="space-y-2">
                {heroDocuments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-primary/20 hover:border-primary/40"
                  >
                    <Icon name="FileText" size={20} className="text-primary shrink-0" />
                    <span className="text-sm flex-1 truncate">{doc.file_name}</span>
                    <Icon name="ExternalLink" size={16} className="text-muted-foreground shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Загрузка файлов...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
