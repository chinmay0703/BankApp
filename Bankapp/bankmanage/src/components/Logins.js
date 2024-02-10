import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../components/login.css';
import Nav from '../routes/Nav';
import Footer from '../routes/Footer';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const toast = useRef(null);


    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Login Successfully', detail: 'Welcome', life: 3000 });
    }

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
    }

    const showWarn = () => {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Message Content', life: 3000 });
    }

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Try again', detail: 'Icorrect Credentials', life: 3000 });
    }
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/getalluser', {
                email: formData.email,
                password: formData.password,
            });
            console.log('Response:', response.data);
            if (response) {
                showSuccess()
                setTimeout(function () {
                    navigate("/dashboard");
                }, 1000);
            }
            else {
                showError()
            }
        } catch (error) {
            showError()
            console.error('Error:', error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    return (
        <div>
            <Nav />
            <Toast ref={toast} />
            <div className='container container-fluid'>
                <div className='row'>
                    <div className='col-lg-6 col-sm-6 '>
                        <img src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" width={'100%'} height={'100%'} class="image" alt="" />
                    </div>
                    <div className='col-lg-6 col-sm-6 my-5 card'>
                        <h1 className='text-center my-3'> Sign in Form</h1>
                        <form className='mx-3 my-3' onSubmit={handleSubmit}>
                            <div className="form-group my-4">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />

                            </div>

                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <p className='my-2'>
                                Please <a href='/signup' style={{ textDecoration: 'none' }}>Register!!</a> if not registered yet
                            </p>
                            <button type="submit" className="btn btn-primary w-100 my-2">Submit</button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login;
