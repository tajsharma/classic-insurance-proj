import React, {useState} from "react";

const AutoForm: React.FC = () =>{
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      vehicleMake: '',
      vehicleModel: '',
      vin: '',
      licenseNumber: '',
      insuranceCompany: '',
      coverage: '',
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      try {
        const response = await fetch('http://localhost:5000/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          alert('Form submitted successfully!');
        } else {
          alert('Failed to submit the form');
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
      }
    };
  
    return (
      <div className="p-10 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-10 pt-24">
        <h2 className="text-4xl font-bold text-orange-400 text-center mb-6">Auto Insurance Form</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="name">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your full name"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your email"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your phone number"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="vehicleMake">Vehicle Make</label>
            <input 
              type="text" 
              name="vehicleMake" 
              value={formData.vehicleMake} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the vehicle make"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="vehicleModel">Vehicle Model</label>
            <input 
              type="text" 
              name="vehicleModel" 
              value={formData.vehicleModel} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the vehicle model"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="vin">Vehicle VIN</label>
            <input 
              type="text" 
              name="vin" 
              value={formData.vin} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the vehicle VIN"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="licenseNumber">Driver's License Number</label>
            <input 
              type="text" 
              name="licenseNumber" 
              value={formData.licenseNumber} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the driver's license number"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="insuranceCompany">Current Insurance Company</label>
            <input 
              type="text" 
              name="insuranceCompany" 
              value={formData.insuranceCompany} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the current insurance company"
              required
            />
          </div>
  
          <div className="mb-6">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="coverage">Coverage Amount</label>
            <input 
              type="text" 
              name="coverage" 
              value={formData.coverage} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the coverage amount"
              required
            />
          </div>
  
          <button type="submit" className="w-full bg-orange-400 text-white p-3 rounded-lg font-semibold hover:bg-orange-500 transition duration-300">
            Submit
          </button>
        </form>
      </div>
    );
};

export default AutoForm;