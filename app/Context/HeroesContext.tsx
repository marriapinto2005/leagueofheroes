"use client";

import { createContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as api from "../services/api";

export type HeroType = {
  id?: number;
  name: string;
  image: string;
  superpower: string;
};

type HeroesContextType = {
  heroes: HeroType[];
  favorites: number[];
  addHero: (hero: HeroType) => Promise<void>;
  updateHero: (hero: HeroType) => Promise<void>;
  removeHero: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  loading: boolean;
};

export const HeroesContext = createContext<HeroesContextType | undefined>(undefined);

export const HeroesProvider = ({ children }: { children: ReactNode }) => {
  const [heroes, setHeroes] = useState<HeroType[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Carregar dados iniciais da API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log("Carregando dados da API...");
        
        // Carregar lista de heróis
        const heroesData = await api.getHeroes();
        console.log("Heróis carregados:", heroesData);
        setHeroes(Array.isArray(heroesData) ? heroesData : []);
        
        // Carregar favoritos
        const favoritesData = await api.getTopHeroes();
        console.log("Favoritos carregados:", favoritesData);
        
        // Converter para array de números
        let favoritesArray: number[] = [];
        if (Array.isArray(favoritesData)) {
          if (favoritesData.length > 0 && typeof favoritesData[0] === 'object') {
            // Se for array de objetos, extrair IDs
            favoritesArray = favoritesData
              .map((item: any) => item.id)
              .filter((id: any): id is number => id !== undefined);
          } else {
            // Se for array de números
            favoritesArray = favoritesData.filter((id: any): id is number => 
              typeof id === 'number'
            );
          }
        }
        
        console.log("Favoritos processados:", favoritesArray);
        setFavorites(favoritesArray);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        // Dados mock para desenvolvimento
        setHeroes([
          { id: 1, name: "Superman", image: "https://example.com/superman.jpg", superpower: "Voo" },
          { id: 2, name: "Batman", image: "https://example.com/batman.jpg", superpower: "Inteligência" }
        ]);
        setFavorites([1]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Adicionar herói
  const addHero = useCallback(async (hero: HeroType) => {
    try {
      // Gerar ID único
      const newId = Date.now();
      const newHero = { ...hero, id: newId };
      
      console.log("Adicionando herói:", newHero);
      
      // Criar nova lista
      const newHeroesList = [...heroes, newHero];
      
      // Atualizar estado local
      setHeroes(newHeroesList);
      
      // Enviar para API
      await api.postHeroes(newHeroesList);
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao adicionar herói:", error);
      throw error;
    }
  }, [heroes, router]);

  // Atualizar herói
  const updateHero = useCallback(async (hero: HeroType) => {
    try {
      if (!hero.id) throw new Error("ID do herói é necessário");
      
      console.log("Atualizando herói:", hero);
      
      // Atualizar lista
      const updatedHeroes = heroes.map(h => (h.id === hero.id ? hero : h));
      
      // Atualizar estado local
      setHeroes(updatedHeroes);
      
      // Enviar para API
      await api.postHeroes(updatedHeroes);
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar herói:", error);
      throw error;
    }
  }, [heroes, router]);

  // Remover herói
  const removeHero = useCallback(async (id: number) => {
    try {
      console.log("Removendo herói ID:", id);
      
      // Remover da lista de heróis
      const updatedHeroes = heroes.filter(h => h.id !== id);
      setHeroes(updatedHeroes);
      
      // Remover dos favoritos se estiver lá
      const updatedFavorites = favorites.filter(favId => favId !== id);
      if (updatedFavorites.length !== favorites.length) {
        setFavorites(updatedFavorites);
        
        // Enviar favoritos atualizados para API
        await api.postTopHeroes(updatedFavorites);
      }
      
      // Enviar heróis atualizados para API
      await api.postHeroes(updatedHeroes);
      
    } catch (error) {
      console.error("Erro ao remover herói:", error);
      throw error;
    }
  }, [heroes, favorites]);

  // Alternar favorito
  const toggleFavorite = useCallback(async (id: number) => {
    try {
      console.log("Alternando favorito ID:", id);
      
      let newFavorites: number[];
      
      if (favorites.includes(id)) {
        // Remover dos favoritos
        newFavorites = favorites.filter(favId => favId !== id);
        console.log(`Removendo ${id} dos favoritos`);
      } else {
        // Verificar limite
        if (favorites.length >= 3) {
          alert("Você só pode ter no máximo 3 heróis favoritos!");
          return;
        }
        // Adicionar aos favoritos
        newFavorites = [...favorites, id];
        console.log(`Adicionando ${id} aos favoritos`);
      }
      
      console.log("Novos favoritos:", newFavorites);
      
      // Atualizar estado local
      setFavorites(newFavorites);
      
      // Enviar para API
      await api.postTopHeroes(newFavorites);
      
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      // Reverter em caso de erro
      setFavorites(favorites);
      alert("Erro ao salvar favoritos. Tente novamente.");
      throw error;
    }
  }, [favorites]);

  return (
    <HeroesContext.Provider value={{ 
      heroes, 
      favorites, 
      addHero, 
      updateHero, 
      removeHero, 
      toggleFavorite,
      loading 
    }}>
      {children}
    </HeroesContext.Provider>
  );
};