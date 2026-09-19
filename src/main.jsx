import React from 'react';
import ReactDOM from 'react-dom/client';
import './demo/backend'; // backend falso da demo: intercepta fetch() e serve dados fictícios
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
