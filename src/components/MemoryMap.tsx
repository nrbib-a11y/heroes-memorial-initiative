import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Region {
  id: number;
  name: string;
  heroes: number;
  found: number;
  missing: number;
  coordinates: { x: number; y: number };
}

const regions: Region[] = [
  {
    id: 1,
    name: "с. Покровское",
    heroes: 1245,
    found: 834,
    missing: 411,
    coordinates: { x: 50, y: 50 },
  },
  {
    id: 2,
    name: "с. Николаевка",
    heroes: 987,
    found: 623,
    missing: 364,
    coordinates: { x: 45, y: 48 },
  },
  {
    id: 3,
    name: "с. Веселое",
    heroes: 756,
    found: 512,
    missing: 244,
    coordinates: { x: 55, y: 52 },
  },
  {
    id: 5,
    name: "с. Вареновка",
    heroes: 543,
    found: 367,
    missing: 176,
    coordinates: { x: 52, y: 55 },
  },
  {
    id: 6,
    name: "п. Приморка",
    heroes: 667,
    found: 488,
    missing: 179,
    coordinates: { x: 58, y: 48 },
  },
];

const MemoryMap = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);

  return (
    <section id="map" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="text-4xl font-bold text-primary mb-4">
              Карта памяти
            </h3>
            <p className="text-lg text-muted-foreground">
              Интерактивная карта населенных пунктов Неклиновского района
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-scale-in">
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <pattern
                        id="grid"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 10 0 L 0 0 0 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.2"
                          className="text-primary/10"
                        />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />

                    {regions.map((region) => (
                      <g key={region.id}>
                        <circle
                          cx={region.coordinates.x}
                          cy={region.coordinates.y}
                          r={hoveredRegion === region.id ? 4 : 3}
                          className={`transition-all cursor-pointer ${
                            hoveredRegion === region.id ||
                            selectedRegion?.id === region.id
                              ? "fill-secondary stroke-secondary"
                              : "fill-primary stroke-primary"
                          }`}
                          strokeWidth="0.5"
                          opacity={
                            hoveredRegion === region.id ||
                            selectedRegion?.id === region.id
                              ? 1
                              : 0.7
                          }
                          onClick={() => setSelectedRegion(region)}
                          onMouseEnter={() => setHoveredRegion(region.id)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        />

                        <circle
                          cx={region.coordinates.x}
                          cy={region.coordinates.y}
                          r={
                            hoveredRegion === region.id ||
                            selectedRegion?.id === region.id
                              ? 6
                              : 5
                          }
                          className={`transition-all ${
                            hoveredRegion === region.id ||
                            selectedRegion?.id === region.id
                              ? "stroke-secondary"
                              : "stroke-primary"
                          }`}
                          strokeWidth="0.3"
                          fill="none"
                          opacity="0.3"
                          pointerEvents="none"
                        />

                        {(hoveredRegion === region.id ||
                          selectedRegion?.id === region.id) && (
                          <text
                            x={region.coordinates.x}
                            y={region.coordinates.y - 6}
                            textAnchor="middle"
                            className="text-[3px] fill-primary font-medium"
                            style={{ pointerEvents: "none" }}
                          >
                            {region.name.split(" ")[0]}
                          </text>
                        )}
                      </g>
                    ))}
                  </svg>

                  <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span>Регионы</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span>Выбран</span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Нажмите на регион для просмотра подробной информации
              </div>
            </div>

            <div className="space-y-4">
              {selectedRegion ? (
                <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20 animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-primary mb-1">
                        {selectedRegion.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="border-secondary text-secondary-foreground"
                      >
                        <Icon name="MapPin" size={12} className="mr-1" />
                        Федеральный округ
                      </Badge>
                    </div>
                    <button
                      onClick={() => setSelectedRegion(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon name="X" size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border-t border-primary/10 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Всего героев
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          {selectedRegion.heroes.toLocaleString("ru-RU")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="CheckCircle2"
                            className="text-green-600"
                            size={16}
                          />
                          <span className="text-sm">Установлены</span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {selectedRegion.found.toLocaleString("ru-RU")}
                        </span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(selectedRegion.found / selectedRegion.heroes) * 100}%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon
                            name="Search"
                            className="text-primary"
                            size={16}
                          />
                          <span className="text-sm">Ищем</span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {selectedRegion.missing.toLocaleString("ru-RU")}
                        </span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(selectedRegion.missing / selectedRegion.heroes) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="border-t border-primary/10 pt-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-3xl font-bold text-secondary mb-1">
                          {Math.round(
                            (selectedRegion.found / selectedRegion.heroes) *
                              100,
                          )}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Процент установленных
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20">
                  <div className="text-center py-8">
                    <Icon
                      name="MapPin"
                      className="text-muted-foreground mx-auto mb-4"
                      size={48}
                    />
                    <p className="text-muted-foreground">
                      Выберите регион на карте для просмотра статистики
                    </p>
                  </div>
                </Card>
              )}

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm border-primary/20">
                <h5 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Топ-3 региона
                </h5>
                <div className="space-y-3">
                  {[...regions]
                    .sort((a, b) => b.found / b.heroes - a.found / a.heroes)
                    .slice(0, 3)
                    .map((region, index) => (
                      <div
                        key={region.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-background/50 p-2 rounded-lg transition-colors"
                        onClick={() => setSelectedRegion(region)}
                      >
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {region.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((region.found / region.heroes) * 100)}%
                            установлено
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoryMap;
