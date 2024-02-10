import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Logins';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/Signup' element={<Signup></Signup>}></Route>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        </Routes>
      </Router>
     
    </div>
  );
}

export default App;
