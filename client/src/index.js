import React from 'react';
import { createRoot } from 'react-dom/client'; // New root API
import './index.css';
import App from './App';
import Test from './Test';

const container = document.getElementById('root'); // Ensure this matches your index.html
const root = createRoot(container); // Create the root

// Render the application inside the root
root.render(
    <React.StrictMode>
        <App />
        {/* <Test /> */}
    </React.StrictMode>
);
