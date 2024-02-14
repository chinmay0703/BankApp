import React, { useRef, useState } from 'react';
import '../components/forgot.css'
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../components/login.css';
import Nav from '../routes/Nav';
import Footer from '../routes/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import 'primeicons/primeicons.css';
function Forgotpassword() {
    const [showforgotform, setShowforgotform] = useState(true);
    const [otpmatched, setotpmatched] = useState(false);
    const [afterotpform, setAfterotpform] = useState(false);


    const [otp, setOtp] = useState('');
    const [emailverify, setEmailverify] = useState('');

    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const navigate = useNavigate();

    const toast = useRef(null);

    const showSuccess = (ee) => {
        toast.current.show({ severity: 'success', summary: 'Congrats', detail: ee, life: 3000 });
    }

    const showInfo = (eer) => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: eer, life: 3000 });
    }

    const showError = (er) => {
        toast.current.show({ severity: 'error', summary: 'Try again', detail: er, life: 3000 });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailverify) {
            showError("Enter Your Email");
            return;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(emailverify)) {
            showError('Enter a valid email, please');
            return;
        }
        var token = localStorage.getItem('Token');
        if (token) {
            showError("You are Allready Loged In");
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/validateemail', {
                email: emailverify,
            });
            console.log('Response:', response.data.message);
            if (response.status === 200) {
                setotpmatched(true);
                showInfo("Check Your Email for OTP!!");
                setShowforgotform(false);
            } else {
                showError("Incorrect OTP");
            }
        } catch (error) {
            if (error.response) {
                showError(`${error.response.data.error}`);
            } else if (error.request) {
                showError('No response from the server');
            } else {
                showError('An unexpected error occurred');
            }
        }
    };

    const handleotpsubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/checkotp', {
                email: emailverify,
                otp: otp,
            });
            if (response.status === 200) {
                showInfo("You can Update Your Password Now");
                setAfterotpform(true);
                setotpmatched(false);
                setShowforgotform(false);
            } else {
                showError("Incorrect OTP");
            }
        } catch (error) {
            if (error.response) {
                showError(`${error.response.data.error}`);
                console.error('Error:', error.response.data.error);
            } else if (error.request) {
                showError('No response from the server');
                console.error('Error:', error.request);
            } else {
                showError('An unexpected error occurred');
                console.error('Error:', error.message);
            }
        }
    };

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

    const handlenewpasswordsubmit = async (e) => {
        try {
            e.preventDefault();
            if (value1 !== value2) {
                showError("Passwords don't match");
            } else {
                const response = await axios.post('http://localhost:3001/updatepass', {
                    email: emailverify,
                    password: value1,
                });
                console.log(response);
                console.log(response.message);
                console.log(response.status);

                if (response.status === 200) {
                    console.log("kaga")
                    showSuccess("Password Updated Successfully");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);

                } else {
                    showError("Failed to update password");
                }
            }
        } catch (error) {
            console.error("Error during password submission:", error);
            showError("An unexpected error occurred");
        }
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
                    <div className='col-lg-6 col-sm-6 my-5 card my-5'>

                        {showforgotform && (
                            <div className='parent-container'> <i className="pi pi-lock my-3" style={{ fontSize: '5rem' }}></i></div>
                        )}

                        {otpmatched && (
                            <div className='parent-container'> <i className="pi pi-lock my-3 " style={{ fontSize: '5rem' }}></i></div>
                        )}

                        {afterotpform && (
                            <div className='parent-container'> <i className="pi pi-lock-open my-3 " style={{ fontSize: '5rem' }}></i></div>
                        )}



                        <h1 className='text-center '>Forgot Password?
                        </h1>
                        <small id="em" class="form-text text-center text-muted">You can reset your password here</small>

                        {showforgotform && (
                            <div className='container container-fluid'>
                                <form className='form-group mx-3 my-3' onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            placeholder="Enter email"
                                            name="email"
                                            value={emailverify}
                                            onChange={(e) => setEmailverify(e.target.value)}
                                        />
                                    </div>
                                    <small className="form-text text-muted">We'll never share your Email.</small>
                                    <p className='my-2'>
                                        This is for verification
                                    </p>
                                    <p className='my-1'>
                                        login <Link style={{ textDecoration: 'none' }} to={"/login"}>now</Link>
                                    </p>
                                    <button type="submit" className="btn btn-primary w-100 my-2">Submit</button>
                                </form>
                            </div>
                        )}

                        {otpmatched && (
                            <div className='my-3'>
                                <form className='mx-3 my-3' onSubmit={handleotpsubmit}>
                                    <div className="form-group my-4">
                                        <label htmlFor="otp" className='my-2'>Enter OTP</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="otp"
                                            aria-describedby="otp"
                                            placeholder="Enter OTP"
                                            name="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        />
                                    </div>
                                    <button type="submit" className='btn btn-primary' style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#007bff', color: '#fff' }}>
                                        Submit
                                    </button>
                                </form>
                            </div>
                        )}


                        {afterotpform && (
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className='container container-fluid'>
                                            <div className="form-group">
                                                <div className='row'>
                                                    <div className='col-sm-12 col-lg-12'>
                                                        <label htmlFor="password1">Enter New Password</label>
                                                        <div className="form-group">
                                                            <Password
                                                                id="password1"
                                                                type='text'
                                                                style={{ width: '100%' }}
                                                                inputStyle={{ width: '100%' }}
                                                                value={value1} onChange={(e) => setValue1(e.target.value)}
                                                                placeholder='Enter Password'
                                                                required
                                                                header={header}
                                                                footer={footer}
                                                            />
                                                            <small id="emailHelp" className="form-text text-muted">We'll never share your password.</small>
                                                        </div>
                                                    </div>
                                                    <div className='col-sm-12 col-lg-12'>
                                                        <label htmlFor="password2">Confirm password</label>
                                                        <div className="form-group">
                                                            <Password
                                                                id="password2"
                                                                type='text'
                                                                value={value2} onChange={(e) => setValue2(e.target.value)}
                                                                style={{ width: '100%' }}
                                                                inputStyle={{ width: '100%' }}
                                                                feedback={false}
                                                                placeholder='Re enter Password'
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <button onClick={handlenewpasswordsubmit} className='btn btn-primary my-3 px-3  ' style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#007bff', color: '#fff' }}>Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Forgotpassword;
