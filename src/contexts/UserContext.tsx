import { createContext, useContext } from 'react';

export interface User {
  id: number;
  role: 'jamaah' | 'manajemen';
  name: string;
}

export const UserContext = createContext<{ user: User | null }>({ user: null });

export const useUser = () => useContext(UserContext);