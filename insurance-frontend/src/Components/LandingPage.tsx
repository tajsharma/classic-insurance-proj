import React from 'react';
import bgimage from '../Assets/family-matters.jpg';
import car_icon from '../Assets/Icons/Car.png';
import home_icon from '../Assets/Icons/Home.png';
import business_icon from '../Assets/Icons/Business.png';
import life_icon from '../Assets/Icons/LifeInsurance.png';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div>
      <section style={{
        backgroundImage: `url(${bgimage})`,
        backgroundSize: 'cover',       // Ensures the image covers the entire div
        backgroundPosition: 'center top',  // Centers the image
        height: '100vh',               // Full screen height
      }} className="relative flex flex-col items-start justify-start text-white pt-32">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <div className="flex-col relative z-10 py-40 px-40 w-2/3">
          <h1 className="text-6xl font-bold">
            Welcome to the <span className="block text-orange-400 py-4 text-7xl">Classic Insurance Agency!</span>
          </h1>
          <p className="mt-4 text-3xl py-2 w-9/12">Insurance shouldn't be difficult, click below get to a quote today to protect your assets with us.</p>

          <div className='flex gap-12 w-9/12 pt-10 py-10'>
            <button className='text-white border text-2xl rounded-lg border-orange-400 py-3 px-10 bg-orange-400'>Get a quote</button>
            <button className='text-white border text-2xl rounded-lg border-orange-400 py-3 px-10 bg-orange-400'>Tag & Title</button>
          </div>
        </div>
        
      </section>

      <section id="services" className="p-10 pt-28 bg-yellow-50">
          <h2 className="text-6xl font-bold mb-6 text-center text-orange-400">Our Services</h2>
          <p className="text-xl text-center mb-4 "><i>Explore our wide range of insurance and tag services below!</i></p>

          <h3 className='text-4xl pt-14 text-center pb-5'>Need <span className='text-orange-400 font-bold'>Insurance?</span> Check out what we offer!</h3>
          
          <div className='flex p-10 justify-between'>
            {/* insurance cards below here */}

            {/* Auto insurance card*/}
            <div className='flex-col bg-orange-400 text-white p-10 rounded-lg w-96 text-center'>
              <img src={car_icon} alt='Auto icon' className='mx-auto'></img>
              <h3 className='py-3 text-3xl font-bold'>Auto Insurance</h3>
              <p className='text-xl pb-7'>
                Get the coverage you need to stay protected on the road, 
                no matter where life takes you.
              </p>
              <Link to="/auto" className="text-black hover:text-orange-400 bg-white italic rounded-lg mx-4 text-xl p-4">Get a Quote!</Link>
            </div>

            {/* Home insurance card*/}
            <div className='flex-col bg-orange-400 text-white p-10 rounded-lg w-96 text-center'>
              <img src={home_icon} alt='Auto icon' className='mx-auto'></img>
              <h3 className='py-3 text-3xl font-bold'>Home Insurance</h3>
              <p className='text-xl pb-7'>
                Protect your home and everything in it with comprehensive 
                coverage you can trust.
              </p>
              <Link to="/home" className="text-black hover:text-orange-400 bg-white italic rounded-lg mx-4 text-xl p-4">Get a Quote!</Link>
            </div>

            {/* Business insurance card*/}
            <div className='flex-col bg-orange-400 text-white p-10 rounded-lg w-96 text-center'>
              <img src={business_icon} alt='Auto icon' className='mx-auto'></img>
              <h3 className='py-3 text-3xl font-bold'>Business Insurance</h3>
              <p className='text-xl pb-7'>
                Protect your business from unexpected risks with tailored 
                insurance solutions.
              </p>
              <Link to="/business" className="text-black hover:text-orange-400 bg-white italic rounded-lg mx-4 text-xl p-4">Get a Quote!</Link>
            </div>

            {/* Life insurance card*/}
            <div className='flex-col bg-orange-400 text-white p-10 rounded-lg w-96 text-center'>
              <img src={life_icon} alt='Auto icon' className='mx-auto'></img>
              <h3 className='py-3 text-3xl font-bold'>Life Insurance</h3>
              <p className='text-xl pb-7'>
                Ensure your loved ones are secure with a life 
                insurance plan that meets your needs.
              </p>
              <Link to="/life" className="text-black hover:text-orange-400 bg-white italic rounded-lg mx-4 text-xl p-4">Get a Quote!</Link>
            </div>

          </div>
      </section>

      <section className='pt-28 p-10 bg-orange-200 flex flex-col items-center justify-center'>
        <h2 className="text-6xl  font-bold mb-6 text-center text-blue-900">Tag & Title</h2>
        <p className="text-xl text-blue-900 text-center mb-4 w-4/12 py-5"><i>
          Behind on your <span className='text-orange-400 font-bold'>Tags?</span> Explore our full suite of <span className='text-orange-400 font-bold'>tag, title,</span> 
          and <span className='text-orange-400 font-bold'>insurance</span> services—your one-stop solution for fast, 
          convenient vehicle and insurance management in Maryland.
        </i></p>

        <div id="tag-title-card" className='flex flex-row gap-20 '>
          <div className='flex-col bg-blue-900 text-white p-5 rounded-lg w-96 pb-10 text-center'>
            <h3 className='py-3 text-3xl font-bold'>Vehicle Registration</h3>
            <p className='text-l pb-7'>New or Salvaged, we got you covered!</p>
            <Link to="/admin" className="text-blue-900 hover:text-orange-400 bg-white italic rounded-lg mx-4 text-xl p-4">Register Here!</Link>
          </div>

          <div className='flex-col bg-blue-900 text-white p-5 rounded-lg w-96 text-center'>
            <h3 className='py-3 text-3xl font-bold'>Duplicate Title</h3>
            <p className='text-l pb-10'>Maryland Duplicate Title Request Form.</p>
            <Link to="/admin" className="text-blue-900  hover:text-orange-400 bg-white italic rounded-lg mx-4 text-xl p-4">Request Here!</Link>
          </div>

          <div className='flex-col bg-blue-900 text-white p-5 rounded-lg w-96 text-center'>
            <h3 className='py-3 text-3xl font-bold'>Title Registration </h3>
            <p className='text-l pb-7'>Maryland Title registration form.</p>
            <Link to="/admin" className="text-blue-900 hover:text-orange-400 bg-white italic rounded-lg mx-4 text-xl p-4">Register Here!</Link>
          </div>
        </div>

        <h3 className='text-4xl text-blue-900 pt-14 text-center pb-10'>Don't see what you need? Click below to see all of our Tag & Title Services!</h3>
        <Link to="/admin" className="text-white font-bold hover:text-orange-400 bg-blue-900 italic rounded-lg mx-4 text-2xl p-4 px-10">Click here!</Link>

      </section>

      <section id='about' className='p-10 flex justify-center'>
          <h1 className='text-2xl'> about picture bg </h1>
      </section>
    
      <section id='contact' className='p-10 bg-red-200  flex justify-center'>
          <h1 className='text-2xl'> Contact US! </h1>
      </section>

      <section id='footer' className='p-10 bg-blue-200  flex justify-center'>
          <h1 className='text-2xl'> footer here </h1>
      </section>

    </div>

  );
};

export default LandingPage;