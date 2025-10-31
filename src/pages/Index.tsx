import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import UploadForm from '@/components/UploadForm';

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

const mockHeroes: Hero[] = [
  {
    id: 1,
    name: 'Голубев Петр Иванович',
    birthYear: 1919,
    deathYear: 1943,
    rank: 'Сержант',
    unit: '51-я армия',
    awards: ['Орден Красной Звезды', 'Медаль "За отвагу"'],
    hometown: 'с. Покровское',
    region: 'Неклиновский район',
  },
  {
    id: 2,
    name: 'Кузнецов Иван Семенович',
    birthYear: 1921,
    deathYear: 1944,
    rank: 'Рядовой',
    unit: '130-я стрелковая дивизия',
    awards: ['Медаль "За отвагу"', 'Медаль "За боевые заслуги"'],
    hometown: 'с. Неклиновское',
    region: 'Неклиновский район',
  },
  {
    id: 3,
    name: 'Волков Анатолий Андреевич',
    birthYear: 1923,
    rank: 'Лейтенант',
    unit: '296-я стрелковая дивизия',
    awards: ['Орден Отечественной войны II степени'],
    hometown: 'с. Веселое',
    region: 'Неклиновский район',
  },
  {
    id: 4,
    name: 'Беляев Николай Григорьевич',
    birthYear: 1917,
    deathYear: 1945,
    rank: 'Старшина',
    unit: '230-я стрелковая дивизия',
    awards: ['Орден Красного Знамени', 'Медаль "За взятие Берлина"'],
    hometown: 'с. Рождественка',
    region: 'Неклиновский район',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const filteredHeroes = mockHeroes.filter((hero) => {
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.hometown.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRank = !filterRank || hero.rank === filterRank;
    const matchesRegion = !filterRegion || hero.region === filterRegion;
    
    return matchesSearch && matchesRank && matchesRegion;
  });

  const stats = {
    total: 4821,
    found: 2156,
    missing: 2665,
    districts: 58,
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
                <h1 className="text-3xl font-bold text-primary">Память Дона</h1>
                <p className="text-sm text-muted-foreground">Герои Неклиновского района</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#database" className="text-sm font-medium hover:text-primary transition-colors">База данных</a>
              <a href="#upload" className="text-sm font-medium hover:text-primary transition-colors">Загрузить материалы</a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">О проекте</a>
            </nav>
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
              Вечная память героям
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Проект по увековечению памяти защитников Отечества в каждом населенном пункте Неклиновского района Ростовской области
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: 'Всего записей', value: stats.total.toLocaleString('ru-RU'), icon: 'Users' },
                { label: 'Установлены', value: stats.found.toLocaleString('ru-RU'), icon: 'CheckCircle2' },
                { label: 'Ищем', value: stats.missing.toLocaleString('ru-RU'), icon: 'Search' },
                { label: 'Населенных пунктов', value: stats.districts, icon: 'Map' },
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
            <div className="text-center mb-12 animate-fade-in">
              <h3 className="text-4xl font-bold text-primary mb-4">База данных героев</h3>
              <p className="text-lg text-muted-foreground">
                Поиск по ФИО, годам службы, воинским частям, наградам и месту призыва
              </p>
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
                  <option value="Неклиновский район">с. Неклиновское</option>
                  <option value="Неклиновский район">с. Покровское</option>
                  <option value="Неклиновский район">с. Веселое</option>
                  <option value="Неклиновский район">с. Рождественка</option>
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

            <div className="grid md:grid-cols-2 gap-6">
              {filteredHeroes.map((hero, index) => (
                <Card
                  key={hero.id}
                  className="p-6 bg-card/90 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg animate-fade-in group cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => navigate(`/hero/${hero.id}`)}
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground flex-shrink-0">
                      {hero.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-primary mb-1 group-hover:text-primary/80 transition-colors">
                        {hero.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <span>{hero.birthYear}</span>
                        {hero.deathYear && (
                          <>
                            <span>—</span>
                            <span>{hero.deathYear}</span>
                            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                              Погиб
                            </Badge>
                          </>
                        )}
                      </div>
                      
                      <Tabs defaultValue="info" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                          <TabsTrigger value="info" className="text-xs">Информация</TabsTrigger>
                          <TabsTrigger value="awards" className="text-xs">Награды</TabsTrigger>
                          <TabsTrigger value="location" className="text-xs">Место призыва</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="info" className="mt-4 space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <Icon name="Shield" className="text-primary mt-0.5 flex-shrink-0" size={16} />
                            <div>
                              <div className="font-medium text-foreground">{hero.rank}</div>
                              <div className="text-muted-foreground">{hero.unit}</div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="awards" className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {hero.awards.map((award, i) => (
                              <Badge key={i} variant="outline" className="border-secondary text-secondary-foreground bg-secondary/5">
                                <Icon name="Medal" size={14} className="mr-1" />
                                {award}
                              </Badge>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="location" className="mt-4 space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <Icon name="MapPin" className="text-primary mt-0.5 flex-shrink-0" size={16} />
                            <div>
                              <div className="font-medium text-foreground">{hero.hometown}</div>
                              <div className="text-muted-foreground">{hero.region}</div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <Icon name="Heart" className="text-primary mx-auto" size={48} />
            <h3 className="text-4xl font-bold text-primary">О проекте</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Наша миссия — увековечить память о каждом защитнике Отечества Неклиновского района, 
              ушедшем на фронт в годы Великой Отечественной войны. Мы работаем над тем, чтобы имена 
              и судьбы героев нашего района стали известны их землякам и потомкам. Каждое имя — это история, 
              каждая история — это подвиг.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: 'BookOpen', title: 'Архивная работа', desc: 'Изучаем документы военных лет Неклиновского района' },
                { icon: 'Users', title: 'Народная память', desc: 'Собираем воспоминания жителей нашего района' },
                { icon: 'MapPin', title: 'Местная история', desc: 'Герои 58 населенных пунктов района' },
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

      <UploadForm />

      <footer className="border-t border-primary/20 py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Icon name="Star" className="text-primary" size={20} />
              <span className="font-bold text-primary">Память Дона</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Проект по сохранению памяти о героях Неклиновского района
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="text-primary hover:underline">Контакты</a>
              <a href="#" className="text-primary hover:underline">Как помочь</a>
              <a href="#" className="text-primary hover:underline">Документы</a>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              © 2024 Память Дона. Все герои достойны памяти.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;