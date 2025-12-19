"use client";

import { useState } from "react";
import Header from "./@header/Header"; 
import Content from "./components/Content";
import Footer from "./@Footer/Footer";

export default function Page() {
  const [data] = useState({
    my_name: "Maria Pinto",
    project_name: "League of Heroes",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "white" }}>
      <div style={{ flex: 1 }}>
        <Content />
      </div>
    </div>
  );
}

