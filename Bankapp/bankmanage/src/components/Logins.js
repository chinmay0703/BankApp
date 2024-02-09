import React from 'react'
import '../components/login.css';
import Nav from '../routes/Nav';
import Footer from '../routes/Footer';
function Login() {
    return (
        <div>
            <Nav></Nav>
            <div className='container container-fluid'>
                <div className='row'>
                    <div className='col-lg-6 col-sm-6 '>
                        <img src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png" width={'100%'} height={'100%'} class="image" alt="" />
                    </div>
                    <div className='col-lg-6 col-sm-6 my-5 card'>
                        <h1 className='text-center my-3'> Sign in Form</h1>
                        <form className='mx-3 my-3 '>
                            <div class="form-group my-4">
                                <label for="exampleInputEmail1">Email address</label>
                                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                            </div>
                            <p className='my-2'>Please <a href='/signup' style={{ textDecoration: 'none' }}> Register!! </a>If not register yet </p>
                            <button type="submit" class="btn btn-primary w-100 my-2">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <Footer></Footer>
        </div>
    )
}

export default Login