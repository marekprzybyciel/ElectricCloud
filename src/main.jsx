import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';
import './src/index.scss';
import * as bootstrap from 'bootstrap';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);