export interface Work {
  slug: string;
  title: string;
  category: 'restaurant' | 'hotel' | 'music' | 'vintage' | 'books';
  year: number;
  image: string;
  summary: string;
  palette?: string[];
  mechanic?: string;
  source?: string;
  real?: boolean;
  hidden?: boolean;
}

export type Theme = 'light' | 'dark';
export type Mode = 'essential' | 'brutal' | 'clay' | 'generative';
