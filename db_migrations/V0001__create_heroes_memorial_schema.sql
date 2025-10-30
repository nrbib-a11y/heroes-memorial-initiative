-- Create heroes table
CREATE TABLE IF NOT EXISTS heroes (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_year INTEGER NOT NULL,
    birth_place TEXT,
    death_year INTEGER,
    death_place TEXT,
    rank VARCHAR(100),
    military_unit TEXT,
    hometown VARCHAR(255),
    district VARCHAR(255),
    biography TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create awards table
CREATE TABLE IF NOT EXISTS awards (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id),
    award_name VARCHAR(255) NOT NULL,
    award_date DATE,
    award_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create military_path table (боевой путь)
CREATE TABLE IF NOT EXISTS military_path (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id),
    event_date VARCHAR(50) NOT NULL,
    event_description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id),
    document_type VARCHAR(100) NOT NULL,
    document_description TEXT,
    document_date VARCHAR(50),
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL REFERENCES heroes(id),
    photo_url TEXT NOT NULL,
    photo_description TEXT,
    photo_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create submissions table (загрузки от пользователей)
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    hero_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    document_type VARCHAR(100),
    description TEXT,
    year VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_heroes_full_name ON heroes(full_name);
CREATE INDEX IF NOT EXISTS idx_heroes_district ON heroes(district);
CREATE INDEX IF NOT EXISTS idx_heroes_rank ON heroes(rank);
CREATE INDEX IF NOT EXISTS idx_awards_hero_id ON awards(hero_id);
CREATE INDEX IF NOT EXISTS idx_military_path_hero_id ON military_path(hero_id);
CREATE INDEX IF NOT EXISTS idx_documents_hero_id ON documents(hero_id);
CREATE INDEX IF NOT EXISTS idx_photos_hero_id ON photos(hero_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
