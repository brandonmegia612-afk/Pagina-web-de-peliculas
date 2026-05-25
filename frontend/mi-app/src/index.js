import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const currentHost = window.location.hostname;
const isLocalHost = currentHost === 'localhost' || currentHost === '127.0.0.1';
const apiUrl = isLocalHost
  ? process.env.REACT_APP_API_URL || 'http://localhost:3001'
  : `${window.location.protocol}//${currentHost}:3001`;

axios.defaults.baseURL = apiUrl;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
