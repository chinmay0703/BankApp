import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom if using React Router
import Nav from '../routes/Nav';
import Footer from '../routes/Footer';

function Transactions() {
    const [formdata, setFormadata] = useState([]);
    const [tokenPresent, setTokenPresent] = useState(false);
    const [totaltransaction, setTotaltransaction] = useState(false);
    useEffect(() => {
        refreshUser();
    }, []);

    const refreshUser = () => {
        const token = localStorage.getItem('Token');
        if (token) {
            setTokenPresent(true);
        }
        axios
            .post('http://localhost:3001/validateToken', { token })
            .then((response) => {
                setFormadata(response.data.user.transactions);
                setTotaltransaction(response.data.user.transactions.length);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <div>
            <Nav />

            {totaltransaction ? (

                <div>
                    {tokenPresent ? (
                        <div className='container'>
                            <h1 className='text-center my-5'>Transaction Details</h1>
                            <div className='table-responsive'>
                                <table className='table table-hover table-bordered'>
                                    <thead className='table-warning'>
                                        <tr>
                                            <th>Date</th>
                                            <th>Sender Email</th>
                                            <th>Receiver Email</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formdata.map((transaction) => (
                                            <tr key={transaction._id}>
                                                <td>{new Date(transaction.date).toLocaleString()}</td>
                                                <td>{transaction.senderemail}</td>
                                                <td>{transaction.receivermail}</td>
                                                <td>{transaction.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className='container container-fluid my-5 py-5'>
                            <p className='text-center my-5'>
                                Please <Link to='/login'>Login</Link>
                            </p>
                        </div>
                    )}

                </div>


            ) : (
                <>
                    <div className='container my-5'>
                        <h1 className='text-center my-5'>Transaction Details</h1>
                        <p className=' text-center my-5'>No Transactions to show</p>
                    </div>
                </>
            )
            };
            <Footer />
        </div >
    );
}

export default Transactions;
