import React, {useState} from "react";
import axios from 'axios';

const HomeForm: React.FC = () =>{
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      propertyAddress: '',
      homeType: '',
      homeValue: '',
      coverageAmount: '',
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      try {
        const response = await axios.post('http://localhost:5000/submit-home', formData);
        
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
      <div className="p-10 pt-24 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-10">
        <h2 className="text-4xl font-bold text-orange-400 text-center mb-6">Home Insurance Form</h2>
        
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
            <label className="block text-gray-700 text-lg mb-2" htmlFor="propertyAddress">Property Address</label>
            <input 
              type="text" 
              name="propertyAddress" 
              value={formData.propertyAddress} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the property address"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="homeType">Type of Home</label>
            <input 
              type="text" 
              name="homeType" 
              value={formData.homeType} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the type of home"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="homeValue">Home Value</label>
            <input 
              type="text" 
              name="homeValue" 
              value={formData.homeValue} 
              onChange={handleChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the home value"
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
  
          <button type="submit" className="w-full bg-orange-400 text-white p-3 rounded-lg font-semibold hover:bg-orange-500 transition duration-300">
            Submit
          </button>
        </form>
      </div>
    );
};
export default HomeForm;