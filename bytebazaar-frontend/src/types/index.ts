export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  files: string[];
  createdBy: User;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  images: string[];
  rating: number;
  author: User;
}

export interface Review {
  user: User;
  rating: number;
  comment: string;
  _id: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Order {
  _id: string;
  user: User;
  project: Project;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  data: {
    label: string;
    value: number;
  }[];
}

export interface TimeframeOption {
  value: string;
  label: string;
}

export const timeframeOptions: TimeframeOption[] = [
  { value: 'day', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'halfyear', label: '6 Months' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' }
]; 