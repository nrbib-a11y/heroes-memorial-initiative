import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import FileUploadSection from './FileUploadSection';

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
  isEditable?: boolean;
  authToken?: string | null;
  onUpdate?: (hero: Hero) => void;
}

export default function HeroDetailModal({ hero, open, onClose, isEditable = false, authToken, onUpdate }: HeroDetailModalProps) {
  const [heroPhotos, setHeroPhotos] = useState<any[]>([]);
  const [heroDocuments, setHeroDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHero, setEditedHero] = useState<Hero | null>(hero);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (hero && open) {
      setEditedHero(hero);
      loadHeroFiles();
    }
  }, [hero, open]);

  const loadHeroFiles = async () => {
    if (!hero) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://functions.poehali.dev/b076a2f8-a2c0-45ae-ad4b-74958a2cf7de?hero_id=${hero.id}`
      );
      const files = await response.json();
      const photos = files.filter((f: any) => f.file_type === 'photo');
      setHeroPhotos(photos);
      const documents = files.filter((f: any) => f.file_type === 'document');
      setHeroDocuments(documents);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hero || !editedHero) return null;

  const handleSave = async () => {
    if (!authToken || !onUpdate) return;
    
    try {
      const response = await fetch(
        `https://functions.poehali.dev/20c21f09-cd9b-4f71-9f25-5c50e9c53ad4`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': authToken,
          },
          body: JSON.stringify(editedHero),
        }
      );
      
      if (response.ok) {
        onUpdate(editedHero);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update hero:', error);
    }
  };

  const handleAwardsChange = (value: string) => {
    const awardsArray = value.split('\n').filter(a => a.trim());
    setEditedHero({ ...editedHero, awards: awardsArray });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center gap-3">
              <Icon name="Star" size={24} className="text-primary" />
              {isEditing ? 'Редактирование героя' : hero.name}
            </div>
            {isEditable && authToken && !isEditing && (
              <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" variant="default">
                  <Icon name="Check" size={16} className="mr-1" />
                  Сохранить
                </Button>
                <Button onClick={() => { setIsEditing(false); setEditedHero(hero); }} size="sm" variant="outline">
                  <Icon name="X" size={16} className="mr-1" />
                  Отмена
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {heroPhotos.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-center">
                <img
                  src={heroPhotos[selectedPhotoIndex].file_data}
                  alt={hero.name}
                  className="w-64 h-64 rounded-lg object-cover border-4 border-primary/30 shadow-lg"
                />
              </div>
              {heroPhotos.length > 1 && (
                <div className="flex justify-center gap-2">
                  {heroPhotos.map((photo, idx) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                        idx === selectedPhotoIndex 
                          ? 'border-primary ring-2 ring-primary/50' 
                          : 'border-primary/30 hover:border-primary/60'
                      }`}
                    >
                      <img
                        src={photo.file_data}
                        alt={`${hero.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">ФИО</label>
                <Input
                  value={editedHero.name}
                  onChange={(e) => setEditedHero({ ...editedHero, name: e.target.value })}
                  className="bg-background border-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Год рождения</label>
                  <Input
                    type="number"
                    value={editedHero.birthYear}
                    onChange={(e) => setEditedHero({ ...editedHero, birthYear: parseInt(e.target.value) })}
                    className="bg-background border-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Год смерти</label>
                  <Input
                    type="number"
                    value={editedHero.deathYear || ''}
                    onChange={(e) => setEditedHero({ ...editedHero, deathYear: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="bg-background border-primary/30"
                    placeholder="Не указан"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Звание</label>
                <Input
                  value={editedHero.rank}
                  onChange={(e) => setEditedHero({ ...editedHero, rank: e.target.value })}
                  className="bg-background border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Воинская часть</label>
                <Input
                  value={editedHero.unit}
                  onChange={(e) => setEditedHero({ ...editedHero, unit: e.target.value })}
                  className="bg-background border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Населенный пункт</label>
                <Input
                  value={editedHero.hometown}
                  onChange={(e) => setEditedHero({ ...editedHero, hometown: e.target.value })}
                  className="bg-background border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Регион</label>
                <Input
                  value={editedHero.region}
                  onChange={(e) => setEditedHero({ ...editedHero, region: e.target.value })}
                  className="bg-background border-primary/30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Награды (каждая с новой строки)</label>
                <Textarea
                  value={editedHero.awards.join('\n')}
                  onChange={(e) => handleAwardsChange(e.target.value)}
                  className="bg-background border-primary/30 min-h-[100px]"
                  placeholder="Орден Красной Звезды&#10;Медаль За отвагу"
                />
              </div>

              {authToken && (
                <FileUploadSection 
                  heroId={hero.id} 
                  authToken={authToken}
                  onPhotoUploaded={loadHeroFiles}
                />
              )}
            </>
          ) : (
            <>
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
            </>
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