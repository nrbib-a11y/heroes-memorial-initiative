import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PageHeaderProps {
  authToken: string | null;
  userLogin: string | null;
  onShowLoginModal: () => void;
  onLogout: () => void;
}

export default function PageHeader({ authToken, userLogin, onShowLoginModal, onLogout }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
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
              <button onClick={() => navigate('/map')} className="text-sm font-medium hover:text-primary transition-colors">Карта памяти</button>
              <a href="#monuments" className="text-sm font-medium hover:text-primary transition-colors">Монументы</a>
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
                  onClick={onLogout}
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
                onClick={onShowLoginModal}
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
  );
}
