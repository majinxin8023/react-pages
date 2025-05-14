import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Render the application
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);