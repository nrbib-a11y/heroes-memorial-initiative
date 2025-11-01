const API_URL = 'https://functions.poehali.dev/1c7b2c09-4c55-4269-9476-1a0477fdfc6d';

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
