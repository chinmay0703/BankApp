import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from'axios';
function Nav() {
    const [formdata, setFormadata] = useState({});
    const [token, setToken] = useState('');
    const [tokenpresent,setTokenpresent]=useState(false);

    const handlelogout = () => {
        localStorage.removeItem('Token');
    };

    useEffect(() => {
        setToken(localStorage.getItem('Token'));
    }, []);



    useEffect(() => {
        refreshuser();
    }, []);

    const refreshuser = () => {
        const token = localStorage.getItem('Token');
        if (token) {
            setTokenpresent(true);
        }
        axios
            .post('http://localhost:3001/validateToken', { token })
            .then((response) => {
                setFormadata(response.data.user);
                console.log('Response:', response.data);
            })
            .catch((error) => {
                console.error(error);
            });

    };


    return (
        <div>
            <nav class="navbar navbar-expand-lg bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand text-white" href="#">CTCBANK</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                            <li class="nav-item">
                                <a class="nav-link active text-white" aria-current="page" href="/">Home</a>
                            </li>
                            
                            <li class="nav-item">
                                <a class="nav-link active text-white" aria-current="page" href="/dashboard">Menu</a>
                            </li>
                        </ul>
                        <form class="d-flex" role="search">
                            {token ? (
                                <>
                                <p className='text-white my-1'><b>Account No:</b>{formdata.accountno}</p>
                                    <Link to="/">
                                        <button className="btn btn-danger mx-2" type="button" onClick={handlelogout}>
                                            Logout
                                        </button>
                                    </Link>
                                    <Link to="/transactions" style={{ textDecoration: "none" }}>
                                        <button className='btn btn-success'>Transactions</button>
                                    </Link>
                                </>

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