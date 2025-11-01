import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface AddHeroFormProps {
  onAdd: (hero: Omit<Hero, 'id'>) => void;
  onCancel: () => void;
}

const AddHeroForm = ({ onAdd, onCancel }: AddHeroFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    deathYear: '',
    rank: '',
    unit: '',
    awards: '',
    hometown: '',
    region: 'Неклиновский район',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newHero = {
      name: formData.name,
      birthYear: parseInt(formData.birthYear),
      deathYear: formData.deathYear ? parseInt(formData.deathYear) : undefined,
      rank: formData.rank,
      unit: formData.unit,
      awards: formData.awards.split('\n').filter(a => a.trim()),
      hometown: formData.hometown,
      region: formData.region,
    };

    onAdd(newHero);
  };

  const isValid = formData.name && formData.birthYear && formData.rank && 
                  formData.unit && formData.hometown;

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">Добавить героя</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Заполните информацию о защитнике Отечества
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={!isValid} size="sm" variant="default">
              <Icon name="Plus" size={16} className="mr-1" />
              Добавить
            </Button>
            <Button type="button" onClick={onCancel} size="sm" variant="outline">
              <Icon name="X" size={16} className="mr-1" />
              Отмена
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              ФИО <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-primary/30"
              placeholder="Иванов Иван Иванович"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Год рождения <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                className="bg-background border-primary/30"
                placeholder="1920"
                min="1900"
                max="1930"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Год смерти
              </label>
              <Input
                type="number"
                value={formData.deathYear}
                onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
                className="bg-background border-primary/30"
                placeholder="1943"
                min="1941"
                max="1945"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Звание <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-primary/30 rounded-md text-sm focus:outline-none focus:border-primary"
              required
            >
              <option value="">Выберите звание</option>
              <option value="Рядовой">Рядовой</option>
              <option value="Ефрейтор">Ефрейтор</option>
              <option value="Младший сержант">Младший сержант</option>
              <option value="Сержант">Сержант</option>
              <option value="Старший сержант">Старший сержант</option>
              <option value="Старшина">Старшина</option>
              <option value="Младший лейтенант">Младший лейтенант</option>
              <option value="Лейтенант">Лейтенант</option>
              <option value="Старший лейтенант">Старший лейтенант</option>
              <option value="Капитан">Капитан</option>
              <option value="Майор">Майор</option>
              <option value="Подполковник">Подполковник</option>
              <option value="Полковник">Полковник</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Воинская часть <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="bg-background border-primary/30"
              placeholder="5-я гвардейская танковая армия"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Населенный пункт <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.hometown}
              onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
              className="bg-background border-primary/30"
              placeholder="с. Покровское"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Регион
            </label>
            <Input
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="bg-background border-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Награды
              <span className="text-xs text-muted-foreground ml-2">(каждая с новой строки)</span>
            </label>
            <Textarea
              value={formData.awards}
              onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
              className="bg-background border-primary/30 min-h-[120px]"
              placeholder="Орден Красной Звезды&#10;Медаль За отвагу&#10;Орден Отечественной войны II степени"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-primary/10">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Поля, отмеченные звездочкой <span className="text-destructive">*</span>, обязательны для заполнения.
              Введенные данные помогут сохранить память о героях Неклиновского района.
            </p>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default AddHeroForm;