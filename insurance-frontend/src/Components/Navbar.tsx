import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/cropped-classic-logo-1-768x117.png'; 

const Navbar: React.FC = () => {
    return (
      <nav className="bg-yellow-50 p-6">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="text-white text-xl">
              <img src={logo} alt='Classic Insurance Agency logo' className='w-80'></img>
          </Link>
          <div>
            <Link to="/services" className="text-black-300 hover:text-orange-400 mx-2">Services</Link>
            <Link to="/auto" className="text-black-300 hover:text-orange-400 mx-2">Auto</Link>
            <Link to="/home" className="text-black-300 hover:text-orange-400 mx-2">Home</Link>
            <Link to="/life" className="text-black-300 hover:text-orange-400 mx-2">Life</Link>
            <Link to="/business" className="text-black-300 hover:text-orange-400 mx-2">Business</Link>
            <Link to="/admin" className="text-black-300 hover:text-orange-400 mx-2">Admin</Link>
          </div>

          <div>
            <Link to="/contact" className="text-orange-400 hover:text-black-300 border rounded-lg border-orange-400 p-2">Contact Us!</Link>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;