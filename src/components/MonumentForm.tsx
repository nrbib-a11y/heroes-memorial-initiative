import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Monument } from '@/lib/api';

interface MonumentFormProps {
  monument?: Monument | null;
  onSave: (monument: Omit<Monument, 'id'> | Monument) => void;
  onCancel: () => void;
}

export default function MonumentForm({ monument, onSave, onCancel }: MonumentFormProps) {
  const [formData, setFormData] = useState({
    name: monument?.name || '',
    type: monument?.type || 'памятник',
    description: monument?.description || '',
    location: monument?.location || '',
    settlement: monument?.settlement || '',
    address: monument?.address || '',
    coordinates: monument?.coordinates || '',
    establishmentYear: monument?.establishmentYear || undefined,
    architect: monument?.architect || '',
    imageUrl: monument?.imageUrl || '',
    history: monument?.history || '',
  });

  useEffect(() => {
    if (monument) {
      setFormData({
        name: monument.name || '',
        type: monument.type || 'памятник',
        description: monument.description || '',
        location: monument.location || '',
        settlement: monument.settlement || '',
        address: monument.address || '',
        coordinates: monument.coordinates || '',
        establishmentYear: monument.establishmentYear || undefined,
        architect: monument.architect || '',
        imageUrl: monument.imageUrl || '',
        history: monument.history || '',
      });
    }
  }, [monument]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const monumentData = {
      ...formData,
      ...(monument ? { id: monument.id } : {}),
    };
    
    onSave(monumentData as Monument);
  };

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-primary">
          {monument ? 'Редактировать монумент' : 'Добавить монумент'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <Icon name="X" size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Название *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Мемориальный комплекс..."
            />
          </div>

          <div>
            <Label htmlFor="type">Тип *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="памятник">Памятник</option>
              <option value="обелиск">Обелиск</option>
              <option value="мемориал">Мемориал</option>
              <option value="братская могила">Братская могила</option>
              <option value="стела">Стела</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Описание *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            placeholder="Краткое описание монумента..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="settlement">Населенный пункт *</Label>
            <Input
              id="settlement"
              value={formData.settlement}
              onChange={(e) => setFormData({ ...formData, settlement: e.target.value })}
              required
              placeholder="с. Покровское"
            />
          </div>

          <div>
            <Label htmlFor="address">Адрес</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Центральная площадь"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Полное местоположение *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            placeholder="Неклиновский район, с. Покровское"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="establishmentYear">Год установки</Label>
            <Input
              id="establishmentYear"
              type="number"
              value={formData.establishmentYear || ''}
              onChange={(e) => setFormData({ ...formData, establishmentYear: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="1975"
            />
          </div>

          <div>
            <Label htmlFor="architect">Архитектор</Label>
            <Input
              id="architect"
              value={formData.architect}
              onChange={(e) => setFormData({ ...formData, architect: e.target.value })}
              placeholder="Имя архитектора"
            />
          </div>

          <div>
            <Label htmlFor="coordinates">Координаты</Label>
            <Input
              id="coordinates"
              value={formData.coordinates}
              onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
              placeholder="47.0897,38.2345"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="imageUrl">URL изображения</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div>
          <Label htmlFor="history">История</Label>
          <Textarea
            id="history"
            value={formData.history}
            onChange={(e) => setFormData({ ...formData, history: e.target.value })}
            rows={5}
            placeholder="Подробная история создания монумента..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            <Icon name="X" size={16} className="mr-2" />
            Отмена
          </Button>
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
            <Icon name="Save" size={16} className="mr-2" />
            {monument ? 'Сохранить' : 'Добавить'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
