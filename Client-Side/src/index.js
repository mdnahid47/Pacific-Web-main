import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Adjust this if you don’t have a CSS file
import App from './App.jsx';
console.log('🔍 Environment Check:');
console.log('Mode:', import.meta.env.MODE);
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('All env:', import.meta.env);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
