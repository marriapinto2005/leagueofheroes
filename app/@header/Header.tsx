"use client";

import "./header.css";
import Link from "next/link";

type Props = {
  projectName: string;
  myName: string;
};

export default function Header({ projectName, myName }: Props) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-container">
          <img
            src="https://th.bing.com/th/id/R.a2d40db9d1210226c498f5b1509cde6e?rik=ma5KkrUVkEIJCA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2favengers-logo-png-avengers-logo-png-1376.png&ehk=QIh5NB68jzeYVSYdZU1e%2fYCDhPILUGOlaR%2fsdtLziQI%3d&risl=&pid=ImgRaw&r=0"
            alt="Avengers Logo"
            className="header-logo"
          />
          <div className="header-text">
            <h1>{projectName}</h1>
            <h3>Desenvolvido por {myName}</h3>
          </div>
        </div>
      </div>
      
      {}
      <nav className="header-nav">
        <Link href="/" className="nav-link">
          Home
        </Link>
        <Link href="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </nav>
    </header>
  );
}