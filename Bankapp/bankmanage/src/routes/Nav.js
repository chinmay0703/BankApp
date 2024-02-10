import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Nav() {

    const [token, setToken] = useState('');

    const handlelogout = () => {
        localStorage.removeItem('Token');
    };

    useEffect(() => {
        setToken(localStorage.getItem('Token'));
    }, []);


    return (
        <div>
            <nav class="navbar navbar-expand-lg bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand text-white" href="#">My-Bank</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link active text-white" aria-current="page" href="/">Home</a>
                            </li>
                        </ul>
                        <form class="d-flex" role="search">
                            {token ? (
                                <Link to="/">
                                    <button className="btn btn-danger" type="button" onClick={handlelogout}>
                                        Logout
                                    </button>
                                </Link>

                            ) : (
                                <>
                                    <Link to="/login">
                                        <button className="btn btn-primary" type="submit">
                                            Sign in
                                        </button>
                                    </Link>
                                    <Link to="/Signup">
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
    )
}

export default Nav