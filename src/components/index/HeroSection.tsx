import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Stats {
  total: number;
  found: number;
  missing: number;
  regions: number;
}

interface HeroSectionProps {
  stats: Stats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
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
  );
}
