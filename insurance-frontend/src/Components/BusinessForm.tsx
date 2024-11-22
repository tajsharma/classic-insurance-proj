import React, {useState} from 'react';
import axios from 'axios';
import bgimage from '../Assets/benjamin-child-GWe0dlVD9e0-unsplash.jpg';

const BusinessForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    coverageAmount: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5001/submit-business', formData);
      
      if (response.status === 200) {
        alert('Form submitted successfully!');
      } else {
        alert('Failed to submit the form');
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (

    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className="p-10 bg-white bg-opacity-90 rounded-lg shadow-md max-w-7xl mx-auto mt-28 h-2/4">
        <h2 className="text-4xl font-bold text-orange-400 text-center mb-6">Business Insurance Form</h2>
        
        <form className="flex flex-row gap-10 flex-wrap justify-between" onSubmit={handleSubmit}>
          <div className="flex-grow" id="left-column-items">
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
          </div>

          <div className="flex-grow" id="right-column-items">
            <div className="mb-4">
              <label className="block text-gray-700 text-lg mb-2" htmlFor="businessName">Business Name</label>
              <input 
                type="text" 
                name="businessName" 
                value={formData.businessName} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your business name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-lg mb-2" htmlFor="businessType">Type of Business</label>
              <input 
                type="text" 
                name="businessType" 
                value={formData.businessType} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter the type of business"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-lg mb-2" htmlFor="coverageAmount">Coverage Amount</label>
              <input 
                type="text" 
                name="coverageAmount" 
                value={formData.coverageAmount} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter the coverage amount"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="w-full bg-orange-400 text-white p-3 rounded-lg font-semibold hover:bg-orange-500 transition duration-300">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;