import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BookingProvider } from './state/BookingContext.jsx';
import { StorageProvider } from './state/StorageContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StorageProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </StorageProvider>
  </StrictMode>
);
