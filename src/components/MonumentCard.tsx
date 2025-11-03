import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Monument } from '@/lib/api';

interface MonumentCardProps {
  monument: Monument;
  onEdit?: (monument: Monument) => void;
  onDelete?: (id: number) => void;
  isEditable?: boolean;
}

export default function MonumentCard({ monument, onEdit, onDelete, isEditable }: MonumentCardProps) {
  const [showFullInfo, setShowFullInfo] = useState(false);

  return (
    <Card className="overflow-hidden bg-card/90 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={monument.imageUrl || 'https://cdn.poehali.dev/projects/a878be49-c92f-49fe-82c3-94c8b2b2a18a/files/fadd452a-fccd-4b16-9ffa-4c038632544a.jpg'} 
          alt={monument.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/40 backdrop-blur-sm text-white border-white/20">
            {monument.type}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">{monument.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Icon name="MapPin" size={16} />
            <span>{monument.settlement}</span>
          </div>
          {monument.establishmentYear && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Calendar" size={16} />
              <span>Установлен в {monument.establishmentYear} году</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {monument.description}
        </p>

        {showFullInfo && monument.history && (
          <div className="pt-4 border-t border-primary/10">
            <h4 className="font-semibold text-sm mb-2">История:</h4>
            <p className="text-sm text-muted-foreground">{monument.history}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullInfo(!showFullInfo)}
            className="flex-1"
          >
            <Icon name={showFullInfo ? "ChevronUp" : "ChevronDown"} size={16} className="mr-2" />
            {showFullInfo ? 'Скрыть' : 'Подробнее'}
          </Button>
          
          {isEditable && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(monument)}
              >
                <Icon name="Edit" size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(monument.id)}
                className="text-destructive hover:text-destructive"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
