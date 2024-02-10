import React, { useEffect, useState } from 'react';
import Nav from '../routes/Nav';
import Footer from '../routes/Footer'; // Uncomment if Footer is required
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [formdata, setFormadata] = useState({});
  const [showform, setShowform] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('Token');

    axios
      .post('http://localhost:3001/validateToken', { token })
      .then((response) => {
        setFormadata(response.data.user);
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleEmailVerification = () => {
    axios.post('http://localhost:3001/verifyemail', { email: emailInput })
      .then(response => {
        console.log(response.data.message);
        setIsEmailVerified(true);
      })
      .catch(error => {
        console.error('Email verification failed:', error.message);
      });
  };

  const handleMakePayment = () => {

    console.log('Payment made!');
  };

  return (
    <div>
      <Nav />
      <h1 className='text-center my-5'>User Details</h1>
      <div className='container'>
        <div className='row'>
          <table className='table table-hover'>
            <thead>
              <tr className='table-primary'>
                <th className='text-start'>Name</th>
                <th className='text-start'>Email</th>
                <th className='text-start'>PAN</th>
                <th className='text-start'>Address</th>
                <th className='text-start'>Account Balance</th>
                <th className='text-start'>Account Number</th>
                <th className='text-start'>Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='text-start'>{formdata.name}</td>
                <td className='text-start'>{formdata.email}</td>
                <td className='text-start'>{formdata.pan}</td>
                <td className='text-start'>{formdata.address}</td>
                <td className='text-start'>{formdata.money}</td>
                <td className='text-start'>{formdata.accountno}</td>
                <td className='text-start'>{formdata.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {!isEmailVerified && showform && (
          <div className='row'>
            <div className='col-md-6 offset-md-3'>
              <div className='input-group mb-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter Email'
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <button
                  className='btn btn-outline-secondary'
                  type='button'
                  id='button-addon2'
                  onClick={handleEmailVerification}
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        )}
        {isEmailVerified && (
          <div className='row'>
            <div className='col-md-6 offset-md-3'>
              <button
                className='btn btn-primary my-3'
                onClick={handleMakePayment}
              >
                Make Payment
              </button>
            </div>
          </div>
        )}
        <button
          className='btn btn-primary my-3'
          onClick={() => setShowform(true)}
        >
          Make Payment
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
