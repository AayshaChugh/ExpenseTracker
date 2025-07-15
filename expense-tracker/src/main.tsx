

// src/main.tsx (or src/index.tsx if you use that name)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element with ID 'root' not found!");
}