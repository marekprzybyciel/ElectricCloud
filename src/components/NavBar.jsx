import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'; // Import Bootstrap Button
import { supabase } from '../supabase';
import '../index.scss'; // Import globalnych stylów

const NavBar = ({ user, handleLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Błąd wylogowania:', error.message);
            alert('Błąd wylogowania: ' + error.message);
        } else {
            handleLogout();
            navigate('/');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light header-class">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/images/Logo.png" alt="ElectricCloud Logo" className="navbar-logo" />
                    <h1 className="ms-2 logo_h1">Electric<span className="logo_span">Cloud</span></h1>
                </Link>
                <div className="d-flex">
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">Witaj, {user.email}</span>
                                </li>
                                <li className="nav-item">
                                    <Button variant="outline-danger" onClick={handleLogoutClick}>Wyloguj się</Button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/auth">Zaloguj się/Zarejestruj</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;