"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeroesContext } from "../../Context/HeroesContext";
import Link from "next/link";
import "../../globals.css"; // Usar CSS global em vez de específico

export default function HeroFormPage() {
  const context = useContext(HeroesContext);
  if (!context) throw new Error("HeroesContext must be used");

  const { heroes, addHero, updateHero } = context;
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [hero, setHero] = useState({
    name: "",
    image: "",
    superpower: "",
  });

  // Carrega dados do herói se estiver em modo edição
  useEffect(() => {
    if (editId) {
      const existingHero = heroes.find(h => h.id === parseInt(editId));
      if (existingHero) {
        setHero({
          name: existingHero.name,
          image: existingHero.image,
          superpower: existingHero.superpower,
        });
      }
    }
  }, [editId, heroes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHero(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editId) {
      // Modo edição
      updateHero({ 
        ...hero, 
        id: parseInt(editId) 
      });
    } else {
      // Modo adição
      addHero(hero);
    }
  };

  const isEditing = Boolean(editId);

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "40px auto", 
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ 
        color: "#1e3a8a", 
        textAlign: "center",
        marginBottom: "30px" 
      }}>
        {isEditing ? "Editar Super-Herói" : "Adicionar Super-Herói"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Nome *
          </label>
          <input
            type="text"
            name="name"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px"
            }}
            placeholder="Nome do super-herói"
            value={hero.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Imagem (URL) *
          </label>
          <input
            type="text"
            name="image"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px"
            }}
            placeholder="https://exemplo.com/imagem.jpg"
            value={hero.image}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Superpoder
          </label>
          <input
            type="text"
            name="superpower"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px"
            }}
            placeholder="Superpoder (opcional)"
            value={hero.superpower}
            onChange={handleChange}
          />
        </div>

        <div style={{ 
          display: "flex", 
          gap: "10px", 
          marginTop: "20px",
          justifyContent: "center"
        }}>
          <button 
            type="submit"
            style={{
              padding: "12px 24px",
              backgroundColor: "#1e3a8a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600"
            }}
          >
            {isEditing ? "Atualizar" : "Adicionar"}
          </button>
          
          <Link 
            href="/dashboard"
            style={{
              padding: "12px 24px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              textDecoration: "none",
              textAlign: "center"
            }}
          >
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}