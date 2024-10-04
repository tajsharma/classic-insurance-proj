import React from 'react';
import bgimage from '../Assets/family-matters.jpg'

const LandingPage: React.FC = () => {
  return (
    <section style={{
      backgroundImage: `url(${bgimage})`,
      backgroundSize: 'cover',       // Ensures the image covers the entire div
      backgroundPosition: 'center',  // Centers the image
      height: '100vh',               // Full screen height
    }} className="relative flex flex-col items-start justify-start text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-10 p-10">
        <h1 className="text-4xl font-bold">Welcome to Classic Insurance</h1>
        <p className="mt-4 text-lg">We offer the best insurance services for your auto, home, life, and business needs.</p>
      </div>
      
    </section>

  );
};

export default LandingPage;