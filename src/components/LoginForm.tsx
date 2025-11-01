import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { authAPI } from '@/lib/api';

interface LoginFormProps {
  onSuccess: (token: string) => void;
  onCancel: () => void;
}

const LoginForm = ({ onSuccess, onCancel }: LoginFormProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authAPI.login(login, password);
      localStorage.setItem('admin_token', result.token);
      onSuccess(result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-primary/20">
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" className="text-primary-foreground" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-primary">Вход в редактор</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Введите логин и пароль администратора
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Логин
              </label>
              <Input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="bg-background border-primary/30"
                placeholder="Введите логин"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Пароль
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-primary/30"
                placeholder="Введите пароль"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              disabled={loading || !login || !password}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Войти
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={loading}
            >
              Отмена
            </Button>
          </div>

          <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-primary/10">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
              Доступ к редактору предоставляется только администраторам проекта
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
