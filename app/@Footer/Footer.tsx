import "./footer.css";

type FooterProps = {
  myName?: string;
  projectName?: string;
};

export default function Footer({ myName = "Maria Pinto", projectName = "League of Heroes" }: FooterProps) {
  return (
    <footer className="footer-container">
      {projectName} - Copyright © 2025 by {myName}
    </footer>
  );
}