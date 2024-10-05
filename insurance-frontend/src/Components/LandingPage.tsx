import React from 'react';
import bgimage from '../Assets/family-matters.jpg'

const LandingPage: React.FC = () => {
  return (
    <section style={{
      backgroundImage: `url(${bgimage})`,
      backgroundSize: 'cover',       // Ensures the image covers the entire div
      backgroundPosition: 'center',  // Centers the image
      height: '95vh',               // Full screen height
      top:'100px'
    }} className="relative flex flex-col items-start justify-start text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-10 py-40 px-40 w-2/3">
        <h1 className="text-6xl font-bold">
          Welcome to the <span className="block text-orange-400 py-4">Classic Insurance Agency!</span>
        </h1>
        <p className="mt-4 text-3xl py-2 w-9/12">Insurance shoudln't be difficult, click below get to a quote today to protect your assets with us.</p>
      </div>
      
    </section>

  );
};

export default LandingPage;