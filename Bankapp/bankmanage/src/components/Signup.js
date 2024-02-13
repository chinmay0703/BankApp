import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import Nav from '../routes/Nav'
import Footer from '../routes/Footer'
import { Password } from 'primereact/password';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from 'primereact/divider';
function Signup() {
    const header = <div className="font-bold mb-3">Pick a password</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </>
    );
    const toast = useRef(null);
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Signup Successfully', detail: 'Please login Now', life: 3000 });
    }
    const showError = (er) => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: er, life: 3000 });
    }
    const [password, setPassword] = useState('');
    const [value1, setValue1] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [accountno] = useState('');
    const navigate = useNavigate();
    const handlesubmit = async (e) => {
        e.preventDefault();
        if (!password || !name || !email || !pan || !address || !phone) {
            showError("Please fill out all  fields.");
            return;
        }
        if (pan.length !== 10) {
            showError("Please Enter Valid Pan No.")
            console.log(password.feedback);
            return;
        }
        var token = localStorage.getItem('Token');
        if (token) {
            showError("Unable to Sign Up: You are currently logged in. Please log out before creating a new account.");
            return;
        }
        if (password === value1) {
            const formdata = {
                password,
                name,
                email,
                pan,
                address,
                phone,
                money: 1000,
                accountno,
            };
            try {
                const response = await axios.post('http://localhost:3001/postdata', formdata);
                console.log(response.data);
                showSuccess();
                setTimeout(function () {
                    navigate("/login");
                }, 1000);
            } catch (error) {
                if (error.response) {
                    showError(`${error.response.data.error}`);
                } else if (error.request) {
                    showError('No response received');
                } else {
                    showError(error.message);
                }
            }
        } else {
            showError("Password Doesn't Match");
        }
    };
    return (
        <div>
            <Nav></Nav>
            <Toast ref={toast} />
            <div className='container container-fluid'>
                <div className='row'>
                    <div className='col-lg-6 col-sm-12'>
                        <img src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png" className="image image-fluid" width={'100%'} height={'100%'} alt="" />
                    </div>
                    <div className='col-lg-6 col-sm-6 my-5 card px-3 '>
                        <h1 className='text-center my-3'>Sign Up </h1>
                        <form className='mx-3 my-3 '>
                            <div class="form-group">
                                <label for="name">Name </label>
                                <input type="text"
                                    class="form-control" id="name"
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                <input type="email" class="form-control" id="exampleInputEmail1"
                                    placeholder="Enter Valid Email Address"
                                    required
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div class="form-group">
                                <label for="pan1">PAN no.</label>
                                <input type="text"
                                    required
                                    value={pan} onChange={(e) => setPan(e.target.value)}
                                    class="form-control" id="pan" placeholder="Enter Valid PAN no." />
                            </div>
                            <div class="form-group">
                                <label for="address">Permanent Address</label>
                                <input type="text"
                                    required
                                    value={address} onChange={(e) => setAddress(e.target.value)}
                                    class="form-control" id="address" placeholder="Enter Address." />
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="phone"
                                    required
                                    max={10}
                                    min={10}
                                    maxLength={10}
                                    value={phone} onChange={(e) => setPhone(e.target.value)}
                                    class="form-control" id="phone" placeholder="Enter 10 Digit no." />
                            </div>
                            <div className="form-group">
                                <div className='row'>
                                    <div className='col-sm-12 col-lg-6'>
                                        <label htmlFor="password1">Enter Password</label>
                                        <div className="form-group">
                                            <Password
                                                id="password1"
                                                style={{ width: '100%' }}
                                                inputStyle={{ width: '100%' }}
                                                value={password} onChange={(e) => setPassword(e.target.value)}
                                                placeholder='Enter Password'
                                                required
                                                header={header}
                                                footer={footer}
                                            />
                                            <small id="emailHelp" class="form-text text-muted">We'll never share your password.</small>
                                        </div>
                                    </div>
                                    <div className='col-sm-12 col-lg-6'>
                                        <label htmlFor="password2">Confirm password</label>
                                        <div className="form-group">
                                            <Password
                                                id="password2"
                                                value={value1} onChange={(e) => setValue1(e.target.value)}
                                                style={{ width: '100%' }}
                                                inputStyle={{ width: '100%' }}
                                                feedback={false}
                                                placeholder='Re enter Password'
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <strong >Already have an account,<Link style={{ textDecoration: 'none' }} to={"/login"}> Sign In</Link></strong>
                            <button type="submit" onClick={handlesubmit} class="btn btn-primary w-100 my-3">Submit</button>
                        </form>
                    </div>
                </div>


            </div>
            <Footer></Footer>
        </div>
    )
}

export default Signup