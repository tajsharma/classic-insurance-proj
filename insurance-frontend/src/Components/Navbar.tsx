import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/cropped-classic-logo-1-768x117.png'; 

const Navbar: React.FC = () => {
    return (
      <nav className="bg-blue-800 p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="text-white text-xl">
              <img src={logo} alt='Classin Insurance Agency logo' className='w-64'></img>
          </Link>
          <div>
            <Link to="/" className="text-gray-300 hover:text-white mx-2">Home</Link>
            <Link to="/admin" className="text-gray-300 hover:text-white mx-2">Admin</Link>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;