"use client";

import { useContext, useEffect, useState } from "react";
import HeroInfo from "./HeroInfo";
import Loader from "./Loader";
import { HeroesContext } from "../Context/HeroesContext";
import "../globals.css";

export default function Content() {
  const [loading, setLoading] = useState(true);
  const context = useContext(HeroesContext);

  if (!context) {
    throw new Error("Content must be used within HeroesProvider");
  }

  const { heroes, favorites } = context;

  const favoriteHeroesList = heroes.filter((hero) => 
    hero.id !== undefined && favorites.includes(hero.id)
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="content">
      {loading ? <Loader /> : null}

      <h1 className="content-title">Top Heróis Favoritos</h1>

      <div className="content-button-wrapper">
        <button onClick={() => {}} className="content-button">
        </button>
        <div className="favorites-count">
          <span className="count-badge">{favorites.length} favoritos</span>
        </div>
      </div>

      {favoriteHeroesList.length === 0 ? (
        <div className="no-favorites">
          <p>Nenhum herói marcado como favorito.</p>
          <p>Vai ao Dashboard para adicionar heróis aos favoritos!</p>
        </div>
      ) : (
        <div className="content-heroes">
          {favoriteHeroesList.map((hero) => (
            <HeroInfo key={hero.id} name={hero.name} image={hero.image} />
          ))}
        </div>
      )}
    </div>
  );
}