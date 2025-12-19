"use client";

import { useContext } from "react";
import "./dashboard.css";
import Link from "next/link";
import { HeroesContext } from ".././Context/HeroesContext";

export default function DashboardPage() {
  const context = useContext(HeroesContext);

  if (!context) {
    throw new Error("DashboardPage must be used within HeroesProvider");
  }

  const { heroes, favorites, toggleFavorite, removeHero } = context;

  const handleDeleteHero = (id: number) => {
    if (window.confirm(`Tem certeza que deseja excluir este super-herói?`)) {
      removeHero(id);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard de Super-Heróis</h1>
        <p className="dashboard-subtitle">Controla a tua lista de super-heróis</p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link href="/dashboard/form" className="add-hero-btn">
          + Adicionar Novo Herói
        </Link>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total de Heróis</span>
          <span className="stat-value">{heroes.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Favoritos</span>
          <span className="stat-value">{favorites.length}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="heroes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Superpoder</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {heroes.map((hero) => (
              <tr key={hero.id}>
                <td className="id-cell">
                  <span className="id-badge">#{hero.id}</span>
                </td>
                <td className="image-cell">
                  <img 
                    src={hero.image} 
                    alt={hero.name} 
                    className="hero-avatar"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/60x60/1e3a8a/ffffff?text=Hero";
                    }}
                  />
                </td>
                <td className="name-cell">
                  <strong>{hero.name}</strong>
                </td>
                <td className="power-cell">
                  <span className={`power-badge ${hero.superpower ? '' : 'no-power'}`}>
                    {hero.superpower || "N/D"}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="actions-container">
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteHero(hero.id!)}
                      title="Eliminar super-herói"
                    >
                       Apagar
                    </button>
                    <button 
                      className={`action-btn favorite-btn ${favorites.includes(hero.id!) ? 'is-favorite' : ''}`}
                      onClick={() => toggleFavorite(hero.id!)}
                      title={favorites.includes(hero.id!) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      {favorites.includes(hero.id!) ? " Remover" : "☆ Adicionar"}
                    </button>
                    <Link 
                      href={`/dashboard/form?id=${hero.id}`}
                      className="action-btn edit-btn"
                      title="Editar super-herói"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {heroes.length === 0 && (
          <div className="empty-state">
            <h3>Nenhum super-herói encontrado</h3>
            <p>Adicione novos super-heróis para começar!</p>
          </div>
        )}
      </div>

      <div className="dashboard-footer">
        <p>
          Mostrando <strong>{heroes.length}</strong> super-heróis
          {favorites.length > 0 && (
            <> (<strong>{favorites.length}</strong> favoritos)</>
          )}
        </p>
      </div>
    </div>
  );
}