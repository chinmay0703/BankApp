import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
function Nav() {
  const [formdata, setFormadata] = useState({});
  const [token, setToken] = useState('');
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
const navigate=useNavigate();
  const handleNavbarToggle = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleNavbarClose = () => {
    if (isNavbarOpen) {
      setIsNavbarOpen(false);
    }
  };

  const handleLogout = () => {

    localStorage.removeItem('Token');
    navigate("/");
  
  };

  useEffect(() => {
    setToken(localStorage.getItem('Token'));
  }, []);

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = () => {
    const token = localStorage.getItem('Token');
    if (token) {
      axios
        .post('http://localhost:3001/validateToken', { token })
        .then((response) => {
          setFormadata(response.data.user);
          console.log('Response:', response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand text-white" onClick={handleNavbarClose}>
            CTCBANK
          </Link>
          <button
            className={`navbar-toggler ${isNavbarOpen ? 'navbar-toggler-open' : ''}`}
            type="button"
            data-bs-target="#navbarSupportedContent"
            style={{ color: 'white', backgroundColor: 'orange' }}
            onClick={handleNavbarToggle}
            aria-controls="navbarSupportedContent"
            aria-expanded={isNavbarOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link active text-white" onClick={handleNavbarClose}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link active text-white" onClick={handleNavbarClose}>
                  Menu
                </Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              {token ? (
                <>
                  <p className="text-white my-1">
                    <b>Account No:</b>
                    {formdata.accountno}
                  </p>
                  <button className="btn btn-danger mx-2" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                  <Link to="/transactions" style={{ textDecoration: 'none' }} onClick={handleNavbarClose}>
                    <button className="btn btn-success">Transactions</button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={handleNavbarClose}>
                    <button className="btn btn-primary" type="submit">
                      Sign in
                    </button>
                  </Link>
                  <Link to="/Signup" onClick={handleNavbarClose}>
                    <button className="btn btn-warning mx-2" type="submit">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
