import React from "react";
import { createRoot } from 'react-dom/client';
import App from "@pages/App";
import '@assets/styles/reset.css';
const container = document.getElementById("app-container");
const root = createRoot(container);
root.render(<App />);