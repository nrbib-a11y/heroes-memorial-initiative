const HEROES_API_URL = 'https://functions.poehali.dev/1c7b2c09-4c55-4269-9476-1a0477fdfc6d';
const MONUMENTS_API_URL = 'https://functions.poehali.dev/bf2e58b3-4260-40d2-a08e-9b97ce17b190';
const UPLOAD_API_URL = 'https://functions.poehali.dev/b076a2f8-a2c0-45ae-ad4b-74958a2cf7de';

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
  documents?: any[];
}

export const heroesAPI = {
  async getAll(): Promise<Hero[]> {
    const response = await fetch(HEROES_API_URL);
    if (!response.ok) throw new Error('Failed to fetch heroes');
    const data = await response.json();
    return data.heroes || [];
  },

  async getById(id: number): Promise<Hero> {
    const response = await fetch(`${HEROES_API_URL}?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch hero');
    return response.json();
  },

  async create(hero: Omit<Hero, 'id'>): Promise<{ id: number; message: string }> {
    const response = await fetch(HEROES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    });
    if (!response.ok) throw new Error('Failed to create hero');
    return response.json();
  },

  async update(hero: Hero): Promise<{ message: string }> {
    const response = await fetch(HEROES_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    });
    if (!response.ok) throw new Error('Failed to update hero');
    return response.json();
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await fetch(`${HEROES_API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete hero');
    return response.json();
  },
};

export interface Monument {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  settlement: string;
  address: string;
  coordinates?: string;
  establishmentYear?: number;
  architect?: string;
  imageUrl?: string;
  history?: string;
  photos?: MonumentPhoto[];
}

export interface MonumentPhoto {
  id: number;
  title: string;
  photoUrl: string;
  description?: string;
  photoYear?: number;
}

export const monumentsAPI = {
  async getAll(): Promise<Monument[]> {
    const response = await fetch(MONUMENTS_API_URL);
    if (!response.ok) throw new Error('Failed to fetch monuments');
    const data = await response.json();
    return data.monuments || [];
  },

  async getById(id: number): Promise<Monument> {
    const response = await fetch(`${MONUMENTS_API_URL}?id=${id}`);
    if (!response.ok) throw new Error('Failed to fetch monument');
    return response.json();
  },

  async create(monument: Omit<Monument, 'id'>): Promise<{ id: number; message: string }> {
    const response = await fetch(MONUMENTS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(monument),
    });
    if (!response.ok) throw new Error('Failed to create monument');
    return response.json();
  },

  async update(monument: Monument): Promise<{ message: string }> {
    const response = await fetch(MONUMENTS_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(monument),
    });
    if (!response.ok) throw new Error('Failed to update monument');
    return response.json();
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await fetch(`${MONUMENTS_API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete monument');
    return response.json();
  },
};

export const uploadAPI = {
  async uploadFile(file: File, folder: string = 'monuments'): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
          const response = await fetch(UPLOAD_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64Data,
              filename: file.name,
              contentType: file.type,
              folder: folder,
            }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload file');
          }
          
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