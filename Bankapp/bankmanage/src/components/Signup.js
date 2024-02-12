import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Nav from '../routes/Nav'
import Footer from '../routes/Footer'
import { Password } from 'primereact/password';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Signup() {
    const toast = useRef(null);

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Signup Successfully', detail: 'Please login Now', life: 3000 });
    }

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
    }

    const showWarn = () => {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Message Content', life: 3000 });
    }

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email allready in use', life: 3000 });
    }
    const [password, setPassword] = useState('');
    const [value1, setValue1] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pan, setPan] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [money, setMoney] = useState('');
    const [accountno, setAccountno] = useState('');
    const navigate = useNavigate();
    const handlesubmit = async (e) => {
        e.preventDefault();
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
                showError();
                console.error('Error sending data:', error);
            }
        } else {
            alert("Password Doesn't Match");
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
                    <div className='col-lg-6 col-sm-6 my-5 card'>
                        <h1 className='text-center my-3'>Register</h1>
                        <form className='mx-3 my-3 '>
                            <div class="form-group">
                                <label for="name">Name </label>
                                <input type="text"
                                    class="form-control" id="name"
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name" />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter Valid Email Address"
                                    value={email} onChange={(e) => setEmail(e.target.value)} />
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div class="form-group">
                                <label for="pan1">PAN no.</label>
                                <input type="text"
                                    value={pan} onChange={(e) => setPan(e.target.value)}
                                    class="form-control" id="pan" placeholder="Enter Valid PAN no." />
                            </div>
                            <div class="form-group">
                                <label for="address">Permanent Address</label>
                                <input type="text"
                                    value={address} onChange={(e) => setAddress(e.target.value)}
                                    class="form-control" id="address" placeholder="Enter Address." />
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="number"
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
                                            />
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
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" onClick={handlesubmit} class="btn btn-primary w-100 my-4">Submit</button>
                        </form>
                    </div>
                </div>


            </div>
            <Footer></Footer>
        </div>
    )
}

export default Signup