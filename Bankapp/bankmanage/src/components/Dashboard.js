import React, { useRef, useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Nav from '../routes/Nav';
import Footer from '../routes/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [formdata, setFormadata] = useState({});
  const [tokenpresent, setTokenpresent] = useState(false);
  const [otp, setotp] = useState('');
  const [showform, setShowform] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [recieveremail, setRecieveremail] = useState('');
  const [moneyvalue, setMoneyvalue] = useState('');
  const [otpform, setOtpform] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);
  const showSuccess = (errorDetail) => {
    toast.current.show({ severity: 'success', summary: 'Transaction Done', detail: errorDetail, life: 3000 });
  }

  const showInfo = (errorDetail) => {
    toast.current.show({ severity: 'info', summary: 'Info', detail: errorDetail, life: 3000 });
  }

  const showWarn = (errorDetail) => {
    toast.current.show({ severity: 'warn', summary: 'Warning', detail: errorDetail, life: 3000 });
  }

  const showError = (errorDetail) => {
    toast.current.show({ severity: 'error', summary: 'Try again', detail: errorDetail, life: 3000 });
  }

  useEffect(() => {
    refreshuser();
  }, [otp]);
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
  const handlesubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: formdata.email,
      recieve: recieveremail,
      amount: moneyvalue,
    };
    axios.post('http://localhost:3001/verifyemail', formData)
      .then(response => {
        console.log(`Status code: ${response.status}`);
        console.log(response.data);
        if (response.status === 200) {
          showInfo('Check your email!!!');
          setShowform(false);
          setOtpform(true);

        } else if (response.status === 404) {
          showError('Error: User not found');
        } else if (response.status === 400) {
          showError(`${response.data.error}`);
        } else {
          showError(`${response.status}`);
        }
      })
      .catch(error => {
        try {
          if (error.response) {
            showError(`${error.response.data.error}`);
          } else if (error.request) {
            showError('No response received');
          } else {
            showError(error.message);
          }
        } catch (error) {
          showError(error.message);
        }
      }
      )
  };
  const handleMakePayment = () => {
    if (showform === true) {
      setShowform(false)
    }
    else {
      setShowform(true);
    }
  };
  const handlesub = (e) => {
    e.preventDefault();
    const formData = {
      email: formdata.email,
      recieve: recieveremail,
      amount: moneyvalue,
      otp: otp,
    };
    axios.post('http://localhost:3001/checktop', formData)
      .then(response => {
        console.log(response.data);
        if (response.data && response.data.message === 'Transaction successful') {
          setOtpform(false);
          refreshuser();
          showSuccess("Transaction successful");
        } else {
          showError("Enter correct OTP");
        }
      })
      .catch(error => {
        showError("Invalid OTP");
      });
  };

  return (
    <div>
      <Nav  />
      <Toast ref={toast} />

      {tokenpresent ? (
        <>
          <h1 className='text-center my-5'>Account Details</h1>
          <div className='container'>
            <div class='table-responsive'>
              <table className='table table-hover table-bordered'>
                <thead>
                  <tr className='table-success'>
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
            <div className='conatiner'>
              <button className='btn btn-primary my-2' onClick={handleMakePayment}
              >Make Payment</button>
            </div>
            {showform ? (
              <div className='col-lg-6 col-sm-6 my-5 card'>
                <h1 className='text-center my-3'>Make Payment</h1>
                <form className='mx-3 my-3' onSubmit={handlesubmit}>
                  <div className="form-group my-4">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Enter email"
                      name="email"
                      value={formdata.email}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Reciever's Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email2"
                      placeholder="Enter receiver's email"
                      name="password"
                      value={recieveremail}
                      onChange={(e) => setRecieveremail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      placeholder="Enter Amount"
                      name="amount"
                      step="1"
                      value={moneyvalue}
                      onChange={(e) => setMoneyvalue(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 my-4">Submit</button>
                </form>
              </div>
            ) : (<p></p>)}


            {otpform ? (
              <div>
                <form className='mx-3 my-3' onSubmit={handlesub}>
                  <div className="form-group my-4">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      aria-describedby="otp"
                      placeholder="Enter OTP"
                      name="email"
                      value={otp}
                      onChange={(e) => setotp(e.target.value)}
                    />
                  </div>
                  <button type="submit" className='btn btn-primary my-2'>submit</button>
                </form>

              </div>

            ) : (
              <p></p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className='container container-fluid my-5 py-5'>
            <p className='text-center my-5'>Please <a href='/login'>Login</a></p>  
          </div>
        </>
      )}
      <Footer />
    </div >
  );
}
export default Dashboard;
