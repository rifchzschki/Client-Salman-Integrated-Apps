import { createContext, useContext } from 'react';

interface User {
  id: number;
  role: 'user' | 'admin';
  name: string;
}

export const UserContext = createContext<{ user: User | null }>({ user: null });

export const useUser = () => useContext(UserContext);