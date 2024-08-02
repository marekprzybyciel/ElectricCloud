import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabase.js';
import NavBar from './components/NavBar.jsx';
const App = () => {
    const [user, setUser] = useState(null);
    return (
        <Router>
            <NavBar user={user} handleLogout={clearUserState} />
        </Router>
    );
};

export default App;