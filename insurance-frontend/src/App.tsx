import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LandingPage from './Components/LandingPage';
import BusinessForm from './Components/BusinessForm';
import AutoForm from './Components/AutoForm';
import LifeForm from './Components/LifeForm';
import HomeForm from './Components/HomeForm';
import AdminPage from './Components/AdminPage';


function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/business" element={<BusinessForm/>} />
          <Route path="/auto" element={<AutoForm/>} />
          <Route path="/life" element={<LifeForm/>} />
          <Route path="/home" element={<HomeForm/>} />
          <Route path='/admin' element={<AdminPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

