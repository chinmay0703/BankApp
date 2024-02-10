import React, { useEffect, useState } from 'react';
import Nav from '../routes/Nav';
import Footer from '../routes/Footer'; // Uncomment if Footer is required
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [formdata, setFormadata] = useState({}); // Use the correct state hook
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("Token");

    axios.post('http://localhost:3001/validateToken', { token })
      .then(response => {
        setFormadata(response.data.user);
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <Nav />
      <h1 className='text-center my-5'>User Details</h1>
      <div className='container'>
      <button className='btn btn-primary text-start my-3'>Transaction</button>
        <div className='row text-center table-responsive-xl'>
          
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
      </div>
      <Footer />
    </div>
  );
}
export default Dashboard;
