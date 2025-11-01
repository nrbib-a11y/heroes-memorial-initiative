import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { uploadAPI } from '@/lib/api';

interface FileUploadProps {
  accept?: string;
  folder: string;
  onUpload: (url: string) => void;
  label?: string;
  icon?: string;
}

const FileUpload = ({ accept, folder, onUpload, label = 'Загрузить файл', icon = 'Upload' }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const result = await uploadAPI.uploadFile(file, folder);
      onUpload(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        size="sm"
        variant="outline"
        className="w-full"
      >
        {uploading ? (
          <>
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
            Загрузка...
          </>
        ) : (
          <>
            <Icon name={icon as any} size={16} className="mr-2" />
            {label}
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <Icon name="AlertCircle" size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
