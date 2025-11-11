import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import MonumentCard from '@/components/MonumentCard';
import { Monument, monumentsAPI } from '@/lib/api';

export default function Monuments() {
  const navigate = useNavigate();
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    loadMonuments();
  }, []);

  const loadMonuments = async () => {
    try {
      setLoading(true);
      const data = await monumentsAPI.getAll();
      setMonuments(data);
    } catch (error) {
      console.error('Failed to load monuments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMonuments = monuments.filter((monument) => {
    const matchesSearch = monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monument.settlement.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !filterType || monument.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(monuments.map(m => m.type))).filter(Boolean);

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
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                На главную
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-primary">Монументы и памятники</h1>
                <p className="text-sm text-muted-foreground">Места памяти защитников Отечества</p>
              </div>
            </div>
            {authToken && (
              <Button onClick={() => navigate('/monuments/admin')} className="gap-2">Редактирование</Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Поиск по названию или населенному пункту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Все типы</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {(searchQuery || filterType) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Найдено: {filteredMonuments.length}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('');
                }}
              >
                <Icon name="X" size={16} className="mr-1" />
                Сбросить
              </Button>
            </div>
          )}
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredMonuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Монументы не найдены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMonuments.map((monument) => (
              <MonumentCard
                key={monument.id}
                monument={monument}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}