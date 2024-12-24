import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Adjust this if you don’t have a CSS file
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
