import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import FileUpload from '@/components/FileUpload';

interface Document {
  url: string;
  name: string;
  type: string;
  uploadedAt: string;
}

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
  documents?: Document[];
}

interface HeroCardProps {
  hero: Hero;
  onUpdate: (updatedHero: Hero) => void;
  onDelete?: (id: number) => void;
  isAuthenticated?: boolean;
}

const HeroCard = ({ hero, onUpdate, onDelete, isAuthenticated = false }: HeroCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHero, setEditedHero] = useState<Hero>(hero);

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

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Фотография</label>
              {editedHero.photo && (
                <div className="mb-2 relative group/img">
                  <img src={editedHero.photo} alt={editedHero.name} className="w-full h-48 object-cover rounded-md" />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity"
                    onClick={() => setEditedHero({ ...editedHero, photo: undefined })}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              )}
              <FileUpload
                accept="image/*"
                folder="photos"
                onUpload={(url) => setEditedHero({ ...editedHero, photo: url })}
                label="Загрузить фото"
                icon="Image"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Документы</label>
              {editedHero.documents && editedHero.documents.length > 0 && (
                <div className="space-y-2 mb-2">
                  {editedHero.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded border border-primary/10">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2">
                        <Icon name="FileText" size={14} />
                        {doc.name}
                      </a>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newDocs = editedHero.documents?.filter((_, i) => i !== idx) || [];
                          setEditedHero({ ...editedHero, documents: newDocs });
                        }}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <FileUpload
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                folder="documents"
                onUpload={(url) => {
                  const newDoc = {
                    url,
                    name: url.split('/').pop() || 'Документ',
                    type: 'document',
                    uploadedAt: new Date().toISOString(),
                  };
                  setEditedHero({ ...editedHero, documents: [...(editedHero.documents || []), newDoc] });
                }}
                label="Добавить документ"
                icon="FileUp"
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all group">
      <div className="flex gap-4 mb-4">
        {hero.photo && (
          <img 
            src={hero.photo} 
            alt={hero.name} 
            className="w-24 h-24 object-cover rounded-md border-2 border-primary/20"
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
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
            {isAuthenticated && (
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
        </div>
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

        {hero.documents && hero.documents.length > 0 && (
          <div>
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Документы архива:</span>
            <div className="space-y-1">
              {hero.documents.map((doc, idx) => (
                <a 
                  key={idx}
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Icon name="FileText" size={14} />
                  {doc.name}
                </a>
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