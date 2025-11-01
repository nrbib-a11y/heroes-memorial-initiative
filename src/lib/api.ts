const API_URL = 'https://functions.poehali.dev/1c7b2c09-4c55-4269-9476-1a0477fdfc6d';
const AUTH_URL = 'https://functions.poehali.dev/e4d620ba-23c6-492f-814f-b06208b57405';
const UPLOAD_URL = 'https://functions.poehali.dev/b076a2f8-a2c0-45ae-ad4b-74958a2cf7de';

export interface Document {
  url: string;
  name: string;
  type: string;
  uploadedAt: string;
}

export interface Hero {
  id: number;
  name: string;
  birthYear: number;
  deathYear?: number;
  rank: string;
  unit: string;
  awards: string[];
  hometown: string;
  region: string;
  photo?: string;
  documents?: Document[];
  biography?: string;
  birthPlace?: string;
  deathPlace?: string;
}

export const heroesAPI = {
  async getAll(): Promise<Hero[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch heroes');
    const data = await response.json();
    return data.heroes || [];
  },

  async getById(id: number): Promise<Hero> {
    const response = await fetch(`${API_URL}?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch hero');
    return response.json();
  },

  async create(hero: Omit<Hero, 'id'>): Promise<{ id: number; message: string }> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    });
    if (!response.ok) throw new Error('Failed to create hero');
    return response.json();
  },

  async update(hero: Hero): Promise<{ message: string }> {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    });
    if (!response.ok) throw new Error('Failed to update hero');
    return response.json();
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete hero');
    return response.json();
  },
};

export const authAPI = {
  async login(login: string, password: string): Promise<{ success: boolean; token: string; message: string }> {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Authentication failed');
    }
    return response.json();
  },
};

export const uploadAPI = {
  async uploadFile(file: File, folder: string = 'general'): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64,
              filename: file.name,
              contentType: file.type,
              folder,
            }),
          });
          if (!response.ok) throw new Error('Upload failed');
          const data = await response.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },
};