import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { supabase } from './supabase.js';
import NavBar from './components/NavBar.jsx';
import AuthPage from './components/AuthPage.jsx';
const App = () => {
    const [user, setUser] = useState(null);
    return (
        <Router>
            <NavBar />
            <Route path="/auth" element={<AuthPage />} />
        </Router>
    );
};

export default App;