"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeroesContext, HeroType } from "../Context/HeroesContext";
import Link from "next/link";
import "./heroForm.css";

export default function HeroForm() {
  const context = useContext(HeroesContext);
  if (!context) throw new Error("HeroesContext must be used");

  const { heroes, addHero, updateHero } = context;
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [hero, setHero] = useState<HeroType>({
    name: "",
    image: "",
    superpower: "",
  });

  useEffect(() => {
    if (editId) {
      const existingHero = heroes.find((h) => h.id === Number(editId));
      if (existingHero) {
        setHero(existingHero);
      }
    }
  }, [editId, heroes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHero((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editId) {
 
      updateHero({ ...hero, id: Number(editId) });
    } else {
      // Modo adição
      addHero(hero);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {editId ? "Editar Super-Herói" : "Adicionar Novo Super-Herói"}
      </h2>

      <form onSubmit={handleSubmit} className="hero-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nome do Super-Herói *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Ex: Homem-Aranha"
            value={hero.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            URL da Imagem *
          </label>
          <input
            type="text"
            id="image"
            name="image"
            className="form-input"
            placeholder="https://exemplo.com/imagem.jpg"
            value={hero.image}
            onChange={handleChange}
            required
          />
          {hero.image && (
            <div className="image-preview">
              <p>Pré-visualização:</p>
              <img
                src={hero.image}
                alt="Pré-visualização"
                className="preview-image"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/200x200/1e3a8a/ffffff?text=Imagem+Inválida";
                }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="superpower" className="form-label">
            Superpoder
          </label>
          <input
            type="text"
            id="superpower"
            name="superpower"
            className="form-input"
            placeholder="Ex: Lançar teias, Força sobre-humana"
            value={hero.superpower}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editId ? "Atualizar Herói" : "Adicionar Herói"}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Voltar para Dashboard
          </button>
          
          <Link href="/dashboard" className="btn btn-link">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}