import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Hero {
  id: number;
  name: string;
  birthYear: number;
  birthPlace: string;
  deathYear?: number;
  deathPlace?: string;
  rank: string;
  unit: string;
  awards: string[];
  hometown: string;
  region: string;
  biography: string;
  militaryPath: Array<{ date: string; event: string }>;
  documents: Array<{ type: string; description: string; date: string }>;
  photos: Array<{ url: string; description: string; year: number }>;
}

const mockHeroesData: Record<number, Hero> = {
  1: {
    id: 1,
    name: 'Иванов Петр Сергеевич',
    birthYear: 1920,
    birthPlace: 'с. Красное, Курская губерния',
    deathYear: 1943,
    deathPlace: 'Курская дуга, операция "Цитадель"',
    rank: 'Сержант',
    unit: '5-я гвардейская танковая армия',
    awards: ['Орден Красной Звезды', 'Медаль "За отвагу"', 'Медаль "За оборону Москвы"'],
    hometown: 'с. Красное',
    region: 'Курская область',
    biography: 'Петр Сергеевич Иванов родился в крестьянской семье. До войны работал механизатором в колхозе. Призван в РККА в октябре 1941 года. Участвовал в обороне Москвы, где проявил мужество и отвагу. В 1943 году в составе танкового экипажа участвовал в Курской битве. Погиб героически, прикрывая отступление своего подразделения.',
    militaryPath: [
      { date: 'Октябрь 1941', event: 'Призван в РККА, направлен в танковое училище' },
      { date: 'Декабрь 1941', event: 'Участие в обороне Москвы' },
      { date: 'Январь 1942', event: 'Награжден медалью "За оборону Москвы"' },
      { date: 'Март 1943', event: 'Награжден орденом Красной Звезды' },
      { date: 'Июль 1943', event: 'Участие в Курской битве' },
      { date: '12 июля 1943', event: 'Погиб в бою под Прохоровкой' },
    ],
    documents: [
      { type: 'Учетная карточка', description: 'Военный билет с отметками о службе', date: '1941' },
      { type: 'Наградной лист', description: 'К ордену Красной Звезды', date: '1943' },
      { type: 'Извещение', description: 'О гибели на фронте', date: '1943' },
    ],
    photos: [
      { url: '/placeholder.svg', description: 'Призывное фото', year: 1941 },
      { url: '/placeholder.svg', description: 'С боевыми товарищами', year: 1942 },
    ],
  },
  2: {
    id: 2,
    name: 'Смирнов Александр Иванович',
    birthYear: 1918,
    birthPlace: 'г. Тула',
    deathYear: 1945,
    deathPlace: 'г. Берлин, Германия',
    rank: 'Лейтенант',
    unit: '150-я стрелковая дивизия',
    awards: ['Орден Отечественной войны II степени', 'Медаль "За взятие Берлина"', 'Медаль "За отвагу"'],
    hometown: 'г. Тула',
    region: 'Тульская область',
    biography: 'Александр Иванович Смирнов - офицер Красной Армии, командир стрелкового взвода. До войны работал учителем математики в тульской школе. Прошел путь от Сталинграда до Берлина. Отличился при форсировании Днепра и в боях за освобождение Польши.',
    militaryPath: [
      { date: 'Июнь 1941', event: 'Мобилизован в РККА' },
      { date: 'Сентябрь 1942', event: 'Участие в Сталинградской битве' },
      { date: 'Октябрь 1943', event: 'Форсирование Днепра' },
      { date: 'Январь 1945', event: 'Освобождение Польши' },
      { date: 'Май 1945', event: 'Штурм Берлина' },
    ],
    documents: [
      { type: 'Наградной лист', description: 'К ордену Отечественной войны', date: '1944' },
      { type: 'Боевая характеристика', description: 'От командира полка', date: '1945' },
    ],
    photos: [
      { url: '/placeholder.svg', description: 'Довоенное фото', year: 1940 },
    ],
  },
};

const HeroProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hero = mockHeroesData[Number(id)];

  if (!hero) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Icon name="AlertCircle" className="text-muted-foreground mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-foreground mb-2">Герой не найден</h2>
          <p className="text-muted-foreground mb-4">Информация об этом герое отсутствует в базе данных</p>
          <Button onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться на главную
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-primary">
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад к базе
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Star" className="text-primary-foreground" size={20} />
              </div>
              <span className="font-bold text-primary">Память Народа</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-6xl font-bold text-primary-foreground">
                  {hero.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="mt-4 space-y-2">
                  {hero.deathYear && (
                    <Badge variant="secondary" className="w-full justify-center bg-primary/10 text-primary border-primary/20">
                      <Icon name="Flame" size={14} className="mr-1" />
                      Вечная память
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-primary mb-4">{hero.name}</h1>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Icon name="Calendar" className="text-primary mt-1 flex-shrink-0" size={16} />
                      <div>
                        <div className="font-medium text-foreground">Годы жизни</div>
                        <div className="text-muted-foreground">
                          {hero.birthYear} {hero.deathYear && `— ${hero.deathYear}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm">
                      <Icon name="MapPin" className="text-primary mt-1 flex-shrink-0" size={16} />
                      <div>
                        <div className="font-medium text-foreground">Место рождения</div>
                        <div className="text-muted-foreground">{hero.birthPlace}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Icon name="Shield" className="text-primary mt-1 flex-shrink-0" size={16} />
                      <div>
                        <div className="font-medium text-foreground">Воинское звание</div>
                        <div className="text-muted-foreground">{hero.rank}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm">
                      <Icon name="Users" className="text-primary mt-1 flex-shrink-0" size={16} />
                      <div>
                        <div className="font-medium text-foreground">Воинская часть</div>
                        <div className="text-muted-foreground">{hero.unit}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                    <Icon name="Award" size={20} />
                    Награды и отличия
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hero.awards.map((award, i) => (
                      <Badge key={i} variant="outline" className="border-secondary text-secondary-foreground bg-secondary/5">
                        <Icon name="Medal" size={14} className="mr-1" />
                        {award}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <Icon name="BookOpen" size={24} />
              Биография
            </h2>
            <p className="text-foreground leading-relaxed">{hero.biography}</p>
          </Card>

          <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <Icon name="Route" size={24} />
              Боевой путь
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>
              <div className="space-y-6">
                {hero.militaryPath.map((event, i) => (
                  <div key={i} className="relative pl-12">
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary-foreground"></div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="font-semibold text-secondary mb-1">{event.date}</div>
                      <div className="text-foreground">{event.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Icon name="FileText" size={24} />
                Архивные документы
              </h2>
              <div className="space-y-4">
                {hero.documents.map((doc, i) => (
                  <div key={i} className="border border-primary/20 rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon name="File" className="text-primary" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground mb-1">{doc.type}</div>
                        <div className="text-sm text-muted-foreground mb-2">{doc.description}</div>
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Calendar" size={10} className="mr-1" />
                          {doc.date}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <Icon name="Image" size={24} />
                Фотографии
              </h2>
              <div className="space-y-4">
                {hero.photos.map((photo, i) => (
                  <div key={i} className="border border-primary/20 rounded-lg overflow-hidden hover:border-primary/40 transition-colors">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Icon name="Image" className="text-muted-foreground" size={48} />
                    </div>
                    <div className="p-4">
                      <div className="font-medium text-foreground mb-1">{photo.description}</div>
                      <Badge variant="outline" className="text-xs">
                        <Icon name="Calendar" size={10} className="mr-1" />
                        {photo.year}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {hero.deathYear && hero.deathPlace && (
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border-primary/30 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-center space-y-4">
                <Icon name="Flame" className="text-primary mx-auto" size={48} />
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">Место гибели</h3>
                  <p className="text-foreground text-lg">{hero.deathPlace}</p>
                  <p className="text-muted-foreground mt-2">{hero.deathYear} год</p>
                </div>
                <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
                  Герой погиб, защищая Родину. Вечная память павшим!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
