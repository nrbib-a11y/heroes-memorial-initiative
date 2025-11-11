import { useState } from 'react';
import PageHeader from '@/components/index/PageHeader';
import HeroSection from '@/components/index/HeroSection';
import HeroesDatabase from '@/components/index/HeroesDatabase';
import LoginModal from '@/components/LoginModal';
import HeroDetailModal from '@/components/HeroDetailModal';
import Icon from '@/components/ui/icon';
import { Hero as APIHero } from '@/lib/api';
import { useHeroes, useCreateHero, useUpdateHero, useDeleteHero } from '@/hooks/useHeroes';
import { useToast } from '@/hooks/use-toast';

type Hero = APIHero;

const Index = () => {
  const { data: heroes = [], isLoading: loading } = useHeroes();
  const createHeroMutation = useCreateHero();
  const updateHeroMutation = useUpdateHero();
  const deleteHeroMutation = useDeleteHero();
  const { toast } = useToast();
  
  const [isAddingHero, setIsAddingHero] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [userLogin, setUserLogin] = useState<string | null>(localStorage.getItem('userLogin'));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [showHeroDetail, setShowHeroDetail] = useState(false);



  const handleUpdateHero = async (updatedHero: Hero) => {
    try {
      await updateHeroMutation.mutateAsync(updatedHero);
      toast({
        title: 'Данные обновлены',
        description: 'Информация о герое успешно обновлена',
      });
    } catch (error) {
      console.error('Failed to update hero:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteHero = async (id: number) => {
    try {
      await deleteHeroMutation.mutateAsync(id);
      toast({
        title: 'Герой удалён',
        description: 'Запись успешно удалена',
      });
    } catch (error) {
      console.error('Failed to delete hero:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить героя',
        variant: 'destructive',
      });
    }
  };

  const handleAddHero = async (newHero: Omit<Hero, 'id'>) => {
    try {
      await createHeroMutation.mutateAsync(newHero);
      setIsAddingHero(false);
      toast({
        title: 'Герой добавлен',
        description: 'Новая запись успешно создана',
      });
    } catch (error) {
      console.error('Failed to add hero:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить героя',
        variant: 'destructive',
      });
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

  const stats = {
    total: heroes.length,
    found: heroes.filter(h => h.deathYear).length,
    missing: heroes.filter(h => !h.deathYear).length,
    regions: 58,
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        authToken={authToken}
        userLogin={userLogin}
        onShowLoginModal={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      <HeroSection stats={stats} />

      <HeroesDatabase
        heroes={heroes}
        authToken={authToken}
        isAddingHero={isAddingHero}
        loading={loading}
        onSetIsAddingHero={setIsAddingHero}
        onAddHero={handleAddHero}
        onUpdateHero={handleUpdateHero}
        onDeleteHero={handleDeleteHero}
        onHeroClick={handleHeroClick}
      />

      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-4xl font-bold text-primary">О проекте</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Проект «Память Неклиновского района» создан для сохранения памяти о героях Великой Отечественной войны. 
              Наша цель — собрать и систематизировать информацию о каждом защитнике Отечества, установить судьбы пропавших без вести, 
              обеспечить доступ к архивным данным для потомков и всех заинтересованных лиц.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Mail" size={16} className="text-primary" />
                <span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Phone" size={16} className="text-primary" />
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-primary/20 py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Память Неклиновского района. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <HeroDetailModal
        hero={selectedHero}
        open={showHeroDetail}
        onClose={() => {
          setShowHeroDetail(false);
          setSelectedHero(null);
        }}
        isEditable={!!authToken}
        authToken={authToken}
        onUpdate={handleUpdateHero}
      />
    </div>
  );
};

export default Index;