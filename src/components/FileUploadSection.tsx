import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface FileItem {
  id: number;
  file_name: string;
  file_type: string;
  file_url: string;
  uploaded_at: string;
}

interface FileUploadSectionProps {
  heroId: number;
  authToken: string;
  onFileUploaded?: () => void;
  onPhotoUploaded?: () => void;
}

export default function FileUploadSection({ heroId, authToken, onFileUploaded, onPhotoUploaded }: FileUploadSectionProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://functions.poehali.dev/5b374262-df50-4d0c-a58d-7670e30be3c1?hero_id=${heroId}`
      );
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        const response = await fetch('https://functions.poehali.dev/5b374262-df50-4d0c-a58d-7670e30be3c1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': authToken,
          },
          body: JSON.stringify({
            hero_id: heroId,
            file_name: file.name,
            file_type: fileType,
            file_data: base64Data,
          }),
        });

        if (response.ok) {
          await loadFiles();
          onFileUploaded?.();
          if (fileType === 'photo') {
            onPhotoUploaded?.();
          }
        } else {
          const error = await response.json();
          alert(`Ошибка загрузки: ${error.error}`);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Не удалось загрузить файл');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Удалить файл?')) return;

    try {
      const response = await fetch(
        `https://functions.poehali.dev/5b374262-df50-4d0c-a58d-7670e30be3c1?id=${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'X-Auth-Token': authToken,
          },
        }
      );

      if (response.ok) {
        const deletedFile = files.find(f => f.id === fileId);
        await loadFiles();
        onFileUploaded?.();
        if (deletedFile?.file_type === 'photo') {
          onPhotoUploaded?.();
        }
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Не удалось удалить файл');
    }
  };

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <h4 className="text-sm font-semibold text-muted-foreground">Файлы героя</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block">
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={uploading}
              onClick={() => document.getElementById(`photo-${heroId}`)?.click()}
            >
              <Icon name="Image" size={16} />
              {uploading ? 'Загрузка...' : 'Фото'}
            </Button>
            <input
              id={`photo-${heroId}`}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'photo')}
            />
          </label>
        </div>
        
        <div>
          <label className="block">
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={uploading}
              onClick={() => document.getElementById(`doc-${heroId}`)?.click()}
            >
              <Icon name="FileText" size={16} />
              {uploading ? 'Загрузка...' : 'Документ'}
            </Button>
            <input
              id={`doc-${heroId}`}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'document')}
            />
          </label>
        </div>
      </div>

      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 rounded border border-primary/20 bg-muted/30"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon
                  name={file.file_type === 'photo' ? 'Image' : 'FileText'}
                  size={16}
                  className="text-primary shrink-0"
                />
                <span className="text-sm truncate">{file.file_name}</span>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {file.file_type}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFile(file.id)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-3">
          Файлы не загружены
        </p>
      )}

      {files.length === 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={loadFiles}
          disabled={loading}
          className="w-full text-xs"
        >
          <Icon name="RefreshCw" size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Загрузка...' : 'Проверить файлы'}
        </Button>
      )}
    </div>
  );
}