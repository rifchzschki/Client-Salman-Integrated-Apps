import { createContext, useContext } from 'react';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  role: 'jamaah' | 'manajemen';
}

export const UserContext = createContext<{ user: User | null }>({ user: null });

export const useUser = () => useContext(UserContext);