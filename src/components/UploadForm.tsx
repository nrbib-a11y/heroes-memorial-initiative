import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const UploadForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    heroName: '',
    relationship: '',
    documentType: '',
    description: '',
    year: '',
    email: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: 'Материалы отправлены!',
        description: 'Спасибо за ваш вклад в сохранение памяти. Материалы будут проверены модераторами.',
      });
      
      setFormData({
        heroName: '',
        relationship: '',
        documentType: '',
        description: '',
        year: '',
        email: '',
      });
      setFiles([]);
      setIsSubmitting(false);
    }, 1500);
  };

  const documentTypes = [
    'Фотография',
    'Военный билет',
    'Наградной лист',
    'Извещение',
    'Письмо с фронта',
    'Свидетельство о рождении',
    'Медицинская карта',
    'Другое',
  ];

  return (
    <section id="upload" className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Icon name="Upload" className="text-primary mx-auto mb-4" size={48} />
            <h3 className="text-4xl font-bold text-primary mb-4">Загрузить материалы</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Помогите нам сохранить память о героях. Если у вас есть фотографии, документы или информация о ваших родственниках — поделитесь с нами
            </p>
          </div>

          <Card className="p-8 bg-card/90 backdrop-blur-sm border-primary/20 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="heroName" className="text-foreground flex items-center gap-2">
                    <Icon name="User" size={16} className="text-primary" />
                    ФИО героя *
                  </Label>
                  <Input
                    id="heroName"
                    placeholder="Иванов Петр Сергеевич"
                    value={formData.heroName}
                    onChange={(e) => setFormData({ ...formData, heroName: e.target.value })}
                    required
                    className="bg-background border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-foreground flex items-center gap-2">
                    <Icon name="Heart" size={16} className="text-primary" />
                    Степень родства
                  </Label>
                  <Input
                    id="relationship"
                    placeholder="Дед, прадед, родственник..."
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="bg-background border-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="documentType" className="text-foreground flex items-center gap-2">
                    <Icon name="FileText" size={16} className="text-primary" />
                    Тип документа *
                  </Label>
                  <select
                    id="documentType"
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-background border border-primary/30 rounded-md text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Выберите тип</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-foreground flex items-center gap-2">
                    <Icon name="Calendar" size={16} className="text-primary" />
                    Год документа
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="1941"
                    min="1900"
                    max="1945"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="bg-background border-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground flex items-center gap-2">
                  <Icon name="MessageSquare" size={16} className="text-primary" />
                  Описание и история
                </Label>
                <Textarea
                  id="description"
                  placeholder="Расскажите историю героя, опишите документы, добавьте любую информацию, которая может быть полезна..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="bg-background border-primary/30 focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                  <Icon name="Mail" size={16} className="text-primary" />
                  Ваш email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background border-primary/30 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Мы свяжемся с вами для уточнения деталей
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="files" className="text-foreground flex items-center gap-2">
                  <Icon name="Paperclip" size={16} className="text-primary" />
                  Файлы документов (фото, сканы)
                </Label>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="files"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Icon name="Upload" className="text-muted-foreground" size={32} />
                    <div className="text-sm text-foreground font-medium">
                      Нажмите для выбора файлов
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Поддерживаются JPG, PNG, PDF до 10 МБ
                    </div>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium text-foreground mb-2">
                      Выбрано файлов: {files.length}
                    </div>
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <Icon name="FileImage" className="text-primary flex-shrink-0" size={20} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} КБ
                          </div>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          {file.type.split('/')[1]?.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                <div className="flex gap-3">
                  <Icon name="Info" className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Важная информация:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Все материалы будут проверены модераторами перед публикацией</li>
                      <li>Мы бережно относимся к предоставленным документам</li>
                      <li>При публикации будет указано ваше авторство</li>
                      <li>Вы можете запросить удаление материалов в любое время</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" className="mr-2" size={20} />
                    Отправить материалы
                  </>
                )}
              </Button>
            </form>
          </Card>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: 'Shield',
                title: 'Безопасность',
                desc: 'Ваши данные защищены и не передаются третьим лицам',
              },
              {
                icon: 'Clock',
                title: 'Быстрая проверка',
                desc: 'Модерация материалов занимает 2-3 рабочих дня',
              },
              {
                icon: 'Users',
                title: 'Благодарность',
                desc: 'Ваш вклад помогает сохранить память о героях',
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 bg-card/80 backdrop-blur-sm border-primary/20 text-center animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon name={item.icon as any} className="text-secondary mx-auto mb-3" size={32} />
                <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadForm;
