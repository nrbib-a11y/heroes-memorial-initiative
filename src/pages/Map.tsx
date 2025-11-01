import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Region {
  id: number;
  name: string;
  heroes: number;
  found: number;
  missing: number;
  coordinates: { x: number; y: number };
}

const regions: Region[] = [
  { id: 1, name: 'с. Покровское', heroes: 1245, found: 834, missing: 411, coordinates: { x: 50, y: 50 } },
  { id: 2, name: 'с. Неклиновское', heroes: 987, found: 623, missing: 364, coordinates: { x: 45, y: 48 } },
  { id: 3, name: 'с. Веселое', heroes: 756, found: 512, missing: 244, coordinates: { x: 55, y: 52 } },
  { id: 4, name: 'с. Рождественка', heroes: 623, found: 421, missing: 202, coordinates: { x: 48, y: 45 } },
  { id: 5, name: 'с. Вареновка', heroes: 543, found: 367, missing: 176, coordinates: { x: 52, y: 55 } },
  { id: 6, name: 'п. Приморка', heroes: 667, found: 488, missing: 179, coordinates: { x: 58, y: 48 } },
];

const Map = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);

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
                Назад
              </Button>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Map" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Карта памяти</h1>
                <p className="text-sm text-muted-foreground">Неклиновский район</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl font-bold text-primary mb-4">Интерактивная карта населенных пунктов</h2>
              <p className="text-lg text-muted-foreground">
                Выберите населенный пункт на карте для просмотра статистики
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-scale-in">
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-primary/10" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />

                      {regions.map((region) => (
                        <g
                          key={region.id}
                          onMouseEnter={() => setHoveredRegion(region.id)}
                          onMouseLeave={() => setHoveredRegion(null)}
                          onClick={() => setSelectedRegion(region)}
                          className="cursor-pointer transition-all"
                        >
                          <circle
                            cx={region.coordinates.x}
                            cy={region.coordinates.y}
                            r={hoveredRegion === region.id ? "3" : "2.5"}
                            className={`transition-all ${
                              selectedRegion?.id === region.id
                                ? 'fill-primary stroke-primary-foreground'
                                : hoveredRegion === region.id
                                ? 'fill-secondary stroke-secondary-foreground'
                                : 'fill-primary/50 stroke-primary'
                            }`}
                            strokeWidth="0.5"
                          />
                          <circle
                            cx={region.coordinates.x}
                            cy={region.coordinates.y}
                            r={hoveredRegion === region.id ? "5" : "4"}
                            className="fill-primary/20 stroke-primary/40"
                            strokeWidth="0.3"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {selectedRegion ? (
                  <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20 animate-scale-in">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-primary">{selectedRegion.name}</h4>
                      <Badge variant="secondary" className="bg-secondary/20">
                        <Icon name="MapPin" size={12} className="mr-1" />
                        Регион
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/30 border border-primary/10">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {selectedRegion.heroes.toLocaleString('ru-RU')}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Icon name="Users" size={14} />
                          Всего героев
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                            {selectedRegion.found.toLocaleString('ru-RU')}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="CheckCircle2" size={12} />
                            Установлены
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                            {selectedRegion.missing.toLocaleString('ru-RU')}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Icon name="Search" size={12} />
                            Ищем
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-primary/10">
                        <div className="text-sm text-muted-foreground mb-2">Процент установленных:</div>
                        <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 rounded-full"
                            style={{ width: `${(selectedRegion.found / selectedRegion.heroes) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-sm font-semibold text-primary mt-1">
                          {Math.round((selectedRegion.found / selectedRegion.heroes) * 100)}%
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20">
                    <div className="text-center py-8">
                      <Icon name="MapPin" className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-muted-foreground">
                        Выберите населенный пункт на карте для просмотра статистики
                      </p>
                    </div>
                  </Card>
                )}

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {regions.map((region) => (
                    <div
                      key={region.id}
                      onClick={() => setSelectedRegion(region)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedRegion?.id === region.id
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-card/50 border border-primary/10 hover:bg-card/80 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {region.heroes}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Map;
