import React from 'react'
import Nav from '../routes/Nav'
import Footer from '../routes/Footer'

function Home() {
    return (
        <div>
            <Nav></Nav>

            <div className='container container-fluid'>
                <div className='row my-5'>
                    <div className='col-lg-6 col-sm-12'>
                        <img src="https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className='image image-fluid my-4' width={'100%'} height={'100%'} ></img>
                    </div>
                    <div className='col-lg-6 col-sm-12 my-5 mx-0 text-center'>
                        <h1>Welcome to the CTO Bank</h1>
                        <ui className='my-3'>
                            <li className='text-start my-3'>A bank is a financial institution where customers can save or borrow money.</li>
                            < li className='text-start my-3'> Banks also invest money to build up their reserve of money. What they do is regulated by laws. </li>
                            <li className='text-start my-3'>Those laws differ in different countries. The people who work at a bank are called bank employees. </li>
                            <li className='text-start my-3'>Certain banks deal directly with the public and they are the only ones which an ordinary person will deal with. </li>
                            <li className='text-start my-3'>Other banks deal with investments and international currency trading.</li>
                        </ui>

                    </div>
                </div>
               

            </div>
     
            <Footer ></Footer>
        </div>
    )
}

export default Home