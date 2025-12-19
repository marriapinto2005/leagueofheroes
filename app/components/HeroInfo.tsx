import "../globals.css";

type HeroProps = {
  name: string;
  image: string;
};

export default function HeroInfo({ name, image }: HeroProps) {
  return (
    <div className="hero-card">
      <img src={image} alt={name} className="hero-image" />
      <p className="hero-name">{name}</p>
    </div>
  );
}