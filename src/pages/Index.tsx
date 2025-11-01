import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import MemoryMap from '@/components/MemoryMap';
import UploadForm from '@/components/UploadForm';
import HeroCard from '@/components/HeroCard';
import AddHeroForm from '@/components/AddHeroForm';
import LoginModal from '@/components/LoginModal';
import HeroDetailModal from '@/components/HeroDetailModal';
import { heroesAPI, Hero as APIHero } from '@/lib/api';

type Hero = APIHero;

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [isAddingHero, setIsAddingHero] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [userLogin, setUserLogin] = useState<string | null>(localStorage.getItem('userLogin'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [showHeroDetail, setShowHeroDetail] = useState(false);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = async () => {
    try {
      setLoading(true);
      const data = await heroesAPI.getAll();
      setHeroes(data);
    } catch (error) {
      console.error('Failed to load heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHero = async (updatedHero: Hero) => {
    try {
      await heroesAPI.update(updatedHero);
      setHeroes(heroes.map(h => h.id === updatedHero.id ? updatedHero : h));
    } catch (error) {
      console.error('Failed to update hero:', error);
      alert('Не удалось обновить данные');
    }
  };

  const handleDeleteHero = async (id: number) => {
    try {
      await heroesAPI.delete(id);
      setHeroes(heroes.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete hero:', error);
      alert('Не удалось удалить героя');
    }
  };

  const handleAddHero = async (newHero: Omit<Hero, 'id'>) => {
    try {
      await heroesAPI.create(newHero);
      await loadHeroes();
      setIsAddingHero(false);
    } catch (error) {
      console.error('Failed to add hero:', error);
      alert('Не удалось добавить героя');
    }
  };

  const handleLogin = (token: string, login: string) => {
    setAuthToken(token);
    setUserLogin(login);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userLogin', login);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUserLogin(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userLogin');
  };

  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(hero);
    setShowHeroDetail(true);
  };

  const filteredHeroes = heroes.filter((hero) => {
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.hometown.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRank = !filterRank || hero.rank === filterRank;
    const matchesRegion = !filterRegion || hero.region === filterRegion;
    
    return matchesSearch && matchesRank && matchesRegion;
  });

  const stats = {
    total: heroes.length,
    found: heroes.filter(h => h.deathYear).length,
    missing: heroes.filter(h => !h.deathYear).length,
    regions: 58,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Star" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary">Герои Неклиновского района</h1>
                <p className="text-sm text-muted-foreground">Память о защитниках Отечества</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-6">
                <a href="#database" className="text-sm font-medium hover:text-primary transition-colors">База данных</a>
                <a href="#map" className="text-sm font-medium hover:text-primary transition-colors">Карта памяти</a>
                <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">О проекте</a>
              </nav>
              
              {authToken ? (
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="gap-2">
                    <Icon name="User" size={14} />
                    {userLogin}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <Icon name="LogOut" size={16} />
                    Выйти
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginModal(true)}
                  className="gap-2"
                >
                  <Icon name="Shield" size={16} />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
              Вечная память героям Неклиновского района
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мемориализация защитников Отечества Неклиновского района, Ростовской области, ушедших на фронт в годы Великой Отечественной войны
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: 'Всего записей', value: stats.total.toLocaleString('ru-RU'), icon: 'Users' },
                { label: 'Установлены', value: stats.found.toLocaleString('ru-RU'), icon: 'CheckCircle2' },
                { label: 'Ищем', value: stats.missing.toLocaleString('ru-RU'), icon: 'Search' },
                { label: 'Населенных пунктов', value: stats.regions, icon: 'Map' },
              ].map((stat, i) => (
                <Card key={i} className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all animate-scale-in hover:scale-105" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Icon name={stat.icon as any} className="text-secondary mx-auto mb-2" size={32} />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="database" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-4xl font-bold text-primary mb-2">База данных героев</h3>
                  <p className="text-lg text-muted-foreground">
                    Поиск по ФИО, годам службы, воинским частям, наградам и месту призыва
                  </p>
                </div>
                {!isAddingHero && authToken && (
                  <Button
                    onClick={() => setIsAddingHero(true)}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить героя
                  </Button>
                )}
              </div>
            </div>

            <Card className="p-6 mb-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-scale-in">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      placeholder="Поиск по ФИО, части, населенному пункту..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <select
                  value={filterRank}
                  onChange={(e) => setFilterRank(e.target.value)}
                  className="px-4 py-2 bg-background border border-primary/30 rounded-md text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Все звания</option>
                  <option value="Рядовой">Рядовой</option>
                  <option value="Сержант">Сержант</option>
                  <option value="Лейтенант">Лейтенант</option>
                  <option value="Старшина">Старшина</option>
                </select>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="px-4 py-2 bg-background border border-primary/30 rounded-md text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Все населенные пункты</option>
                  <option value="Неклиновский район">Неклиновский район</option>
                  <option value="с. Покровское">с. Покровское</option>
                  <option value="с. Неклиновское">с. Неклиновское</option>
                  <option value="с. Веселое">с. Веселое</option>
                  <option value="с. Рождественка">с. Рождественка</option>
                </select>
              </div>
              
              {(searchQuery || filterRank || filterRegion) && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Найдено: {filteredHeroes.length}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterRank('');
                      setFilterRegion('');
                    }}
                    className="text-primary hover:text-primary/80"
                  >
                    <Icon name="X" size={16} className="mr-1" />
                    Сбросить
                  </Button>
                </div>
              )}
            </Card>

            {isAddingHero && (
              <div className="mb-8 animate-scale-in">
                <AddHeroForm
                  onAdd={handleAddHero}
                  onCancel={() => setIsAddingHero(false)}
                />
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Загрузка данных...</p>
              </div>
            ) : filteredHeroes.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-xl text-muted-foreground">Герои не найдены</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredHeroes.map((hero, index) => (
                  <div
                    key={hero.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <HeroCard
                      hero={hero}
                      onUpdate={handleUpdateHero}
                      onDelete={handleDeleteHero}
                      isEditable={!!authToken}
                      authToken={authToken}
                      onNameClick={() => handleHeroClick(hero)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <Icon name="Heart" className="text-primary mx-auto" size={48} />
            <h3 className="text-4xl font-bold text-primary">О проекте</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Наша миссия — увековечить память о каждом защитнике Отечества, ушедшем на фронт в годы 
              Великой Отечественной войны. Мы работаем над тем, чтобы имена и судьбы героев стали 
              известны их землякам и потомкам. Каждое имя — это история, каждая история — это подвиг.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: 'BookOpen', title: 'Архивная работа', desc: 'Изучаем документы военных лет' },
                { icon: 'Users', title: 'Народная память', desc: 'Собираем воспоминания и свидетельства' },
                { icon: 'Globe', title: 'Доступность', desc: 'Открытая база для всех регионов России' },
              ].map((item, i) => (
                <Card key={i} className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all hover:scale-105 animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Icon name={item.icon as any} className="text-secondary mx-auto mb-4" size={40} />
                  <h4 className="text-lg font-bold text-primary mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MemoryMap />

      <UploadForm />

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <HeroDetailModal
        hero={selectedHero}
        open={showHeroDetail}
        onClose={() => setShowHeroDetail(false)}
      />

      <footer className="border-t border-primary/20 py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Icon name="Star" className="text-primary" size={20} />
              <span className="font-bold text-primary">Память Народа</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Проект по сохранению памяти о героях Великой Отечественной войны
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="text-primary hover:underline">Контакты</a>
              <a href="#" className="text-primary hover:underline">Как помочь</a>
              <a href="#" className="text-primary hover:underline">Документы</a>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              © 2024 Память Народа. Все герои достойны памяти.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;