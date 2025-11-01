CREATE TABLE IF NOT EXISTS hero_files (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_data TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hero_id) REFERENCES heroes(id)
);

CREATE INDEX idx_hero_files_hero_id ON hero_files(hero_id);
