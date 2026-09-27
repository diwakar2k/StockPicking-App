/**
 * @file main.tsx
 * @description Application client entry point for AlphaSelector India.
 * Bootstraps the React 19 application tree with StrictMode and attaches to the DOM root element.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Initialize and mount root React component tree
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root DOM element with id "root".');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
