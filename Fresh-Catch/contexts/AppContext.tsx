
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Fish {
  id: string;
  name: string;
  species: string;
  weight?: number;
  length?: number;
  location: string;
  date: string;
  image?: string;
  rarity: number; // 1-5 stars
}

interface AppContextType {
  catches: Fish[];
  addCatch: (fish: Fish) => void;
  deleteCatch: (id: string) => void;
  totalCatches: number;
  speciesUnlocked: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [catches, setCatches] = useState<Fish[]>([]);

  const addCatch = (fish: Fish) => {
    setCatches(prev => [...prev, fish]);
  };

  const deleteCatch = (id: string) => {
    setCatches(prev => prev.filter(fish => fish.id !== id));
  };

  const totalCatches = catches.length;
  const speciesUnlocked = new Set(catches.map(fish => fish.species)).size;

  return (
    <AppContext.Provider value={{
      catches,
      addCatch,
      deleteCatch,
      totalCatches,
      speciesUnlocked,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
