import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
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

interface HeroCardProps {
  hero: Hero;
  onUpdate: (updatedHero: Hero) => void;
  onDelete?: (id: number) => void;
  isEditable?: boolean;
  authToken?: string | null;
}

const HeroCard = ({ hero, onUpdate, onDelete, isEditable = false, authToken }: HeroCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHero, setEditedHero] = useState<Hero>(hero);
  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const handleSave = () => {
    onUpdate(editedHero);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedHero(hero);
    setIsEditing(false);
  };

  const handleAwardsChange = (value: string) => {
    const awardsArray = value.split('\n').filter(a => a.trim());
    setEditedHero({ ...editedHero, awards: awardsArray });
  };

  const loadHeroPhoto = async () => {
    try {
      setLoadingPhoto(true);
      const response = await fetch(
        `https://functions.poehali.dev/5b374262-df50-4d0c-a58d-7670e30be3c1?hero_id=${hero.id}`
      );
      const files = await response.json();
      const photo = files.find((f: any) => f.file_type === 'photo');
      if (photo?.file_data) {
        setHeroPhoto(photo.file_data);
      }
    } catch (error) {
      console.error('Failed to load photo:', error);
    } finally {
      setLoadingPhoto(false);
    }
  };

  useEffect(() => {
    loadHeroPhoto();
  }, [hero.id]);

  if (isEditing) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
        <div className="space-y-4">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Редактирование карточки</h3>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" variant="default">
                <Icon name="Check" size={16} className="mr-1" />
                Сохранить
              </Button>
              <Button onClick={handleCancel} size="sm" variant="outline">
                <Icon name="X" size={16} className="mr-1" />
                Отмена
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
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
          </div>
          
          {authToken && (
            <FileUploadSection 
              heroId={hero.id} 
              authToken={authToken}
              onPhotoUploaded={loadHeroPhoto}
            />
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all group">
      <div className="flex items-start gap-4 mb-4">
        {heroPhoto ? (
          <img
            src={heroPhoto}
            alt={hero.name}
            className="w-20 h-20 rounded-lg object-cover border-2 border-primary/30"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-muted/50 flex items-center justify-center border-2 border-primary/20">
            <Icon name="User" size={32} className="text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-primary mb-2">{hero.name}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              {hero.birthYear}{hero.deathYear ? ` — ${hero.deathYear}` : ' — н.в.'}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="MapPin" size={14} />
              {hero.hometown}
            </span>
          </div>
        </div>
        {isEditable && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
              <Icon name="Edit" size={16} />
            </Button>
            {onDelete && (
              <Button onClick={() => onDelete(hero.id)} size="sm" variant="outline" className="text-destructive hover:text-destructive">
                <Icon name="Trash2" size={16} />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Звание:</span>
          <span className="ml-2">{hero.rank}</span>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground">Воинская часть:</span>
          <p className="mt-1 text-sm">{hero.unit}</p>
        </div>

        {hero.awards.length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Награды:</span>
            <div className="flex flex-wrap gap-2">
              {hero.awards.map((award, idx) => (
                <Badge key={idx} variant="secondary" className="bg-secondary/20 text-secondary-foreground border border-secondary/30">
                  <Icon name="Medal" size={12} className="mr-1" />
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-primary/10">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="MapPin" size={12} />
            {hero.region}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default HeroCard;