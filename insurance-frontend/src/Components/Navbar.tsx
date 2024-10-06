import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/cropped-classic-logo-1-768x117.png'; 

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const goToServices = (e: React.MouseEvent) =>{
      e.preventDefault();
      navigate('/');

      setTimeout(()=>{
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });  // Scroll to services
        }},100);
    };

    return (
      <nav className="bg-yellow-50 p-6 fixed top-0 z-50 flex w-full ">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl">
              <img src={logo} alt='Classic Insurance Agency logo' className='w-80'></img>
          </Link>
          <div>
            <a href="#services" onClick={goToServices} className="text-black-300 hover:text-orange-400 mx-4 text-xl">Services</a>
            <Link to="/auto" className="text-black-300 hover:text-orange-400 mx-4 text-xl">Auto</Link>
            <Link to="/home" className="text-black-300 hover:text-orange-400 mx-4 text-xl">Home</Link>
            <Link to="/life" className="text-black-300 hover:text-orange-400 mx-4 text-xl">Life</Link>
            <Link to="/business" className="text-black-300 hover:text-orange-400 mx-4 text-xl">Business</Link>
            <Link to="/admin" className="text-black-300 hover:text-orange-400 mx-4 text-xl">Admin</Link>
          </div>

          <div>
            <Link to="/contact" className="text-orange-400 hover:text-black-300 border rounded-lg border-orange-400 p-2">Contact Us!</Link>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;