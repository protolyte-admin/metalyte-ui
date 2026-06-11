import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from "@mui/material";

import './index.css';

import App from './App.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import marqTheme from './theme/marqTheme.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={marqTheme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);

// bfcache protection: when the user navigates Back and the browser restores
// the page from in-memory snapshot, React state is stale and ProtectedRoute
// may briefly show authenticated content even though storage is empty.
// Force a full reload so AuthProvider re-reads localStorage.
if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
}
