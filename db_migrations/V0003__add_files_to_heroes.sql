ALTER TABLE heroes ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE heroes ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN heroes.photo_url IS 'URL фотографии героя в S3 хранилище';
COMMENT ON COLUMN heroes.documents IS 'Массив документов с полями: {url, name, type, uploaded_at}';
