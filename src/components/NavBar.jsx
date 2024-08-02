import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { supabase } from '../supabase';
import '../index.scss';

const NavBar = ({ user, handleLogout }) => {
    const navigate = useNavigate();
  return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light header-class">
          <div className="container">
              <Link className="navbar-brand d-flex align-items-center" to="/">
                  <img src="/images/Logo.png" alt="ElectricCloud Logo" className="navbar-logo" />
                  <h1 className="ms-2 logo_h1">Electric<span className="logo_span">Cloud</span></h1>
              </Link>
          </div>
      </nav>
  );
};

export default NavBar;