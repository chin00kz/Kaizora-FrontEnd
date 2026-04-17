import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SystemStatusProvider } from './context/SystemStatusContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SystemStatusProvider>
        <App />
      </SystemStatusProvider>
    </AuthProvider>
  </React.StrictMode>,
);
