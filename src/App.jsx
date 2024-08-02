import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabase.js';

const App = () => {
    return (
        <Router>
            <div className="container">
                <h1>Welcome to ElectricCloud</h1>
                {/* Możesz dodać tutaj inne komponenty, jak np. <NavBar /> */}
            </div>
        </Router>
    );
};

export default App;