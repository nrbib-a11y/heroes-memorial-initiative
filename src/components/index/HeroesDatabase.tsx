import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import HeroCard from '@/components/HeroCard';
import AddHeroForm from '@/components/AddHeroForm';
import { Hero } from '@/lib/api';

interface HeroesDatabaseProps {
  heroes: Hero[];
  authToken: string | null;
  isAddingHero: boolean;
  loading: boolean;
  onSetIsAddingHero: (value: boolean) => void;
  onAddHero: (newHero: Omit<Hero, 'id'>) => Promise<void>;
  onUpdateHero: (updatedHero: Hero) => Promise<void>;
  onDeleteHero: (id: number) => Promise<void>;
  onHeroClick: (hero: Hero) => void;
}

export default function HeroesDatabase({
  heroes,
  authToken,
  isAddingHero,
  loading,
  onSetIsAddingHero,
  onAddHero,
  onUpdateHero,
  onDeleteHero,
  onHeroClick,
}: HeroesDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const filteredHeroes = heroes.filter((hero) => {
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.hometown.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRank = !filterRank || hero.rank === filterRank;
    const matchesRegion = !filterRegion || hero.region === filterRegion;
    
    return matchesSearch && matchesRank && matchesRegion;
  });

  const uniqueRanks = Array.from(new Set(heroes.map(h => h.rank))).filter(Boolean);
  const uniqueRegions = Array.from(new Set(heroes.map(h => h.region))).filter(Boolean);

  return (
    <section id="database" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-bold text-primary mb-2">База данных героев</h3>
            <p className="text-muted-foreground">Найдено записей: {filteredHeroes.length}</p>
          </div>
          {authToken && !isAddingHero && (
            <Button onClick={() => onSetIsAddingHero(true)} className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить героя
            </Button>
          )}
        </div>

        {isAddingHero && (
          <Card className="p-6 mb-6">
            <AddHeroForm
              onSubmit={onAddHero}
              onCancel={() => onSetIsAddingHero(false)}
            />
          </Card>
        )}

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="found">Установлены</TabsTrigger>
            <TabsTrigger value="missing">Ищем</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Поиск по имени, части, городу..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterRank}
                  onChange={(e) => setFilterRank(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Все звания</option>
                  {uniqueRanks.map(rank => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </select>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Все регионы</option>
                  {uniqueRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </Card>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHeroes.map((hero) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    onUpdate={authToken ? onUpdateHero : undefined}
                    onDelete={authToken ? onDeleteHero : undefined}
                    onClick={() => onHeroClick(hero)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="found">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHeroes
                .filter(h => h.deathYear)
                .map((hero) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    onUpdate={authToken ? onUpdateHero : undefined}
                    onDelete={authToken ? onDeleteHero : undefined}
                    onClick={() => onHeroClick(hero)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="missing">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHeroes
                .filter(h => !h.deathYear)
                .map((hero) => (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    onUpdate={authToken ? onUpdateHero : undefined}
                    onDelete={authToken ? onDeleteHero : undefined}
                    onClick={() => onHeroClick(hero)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
