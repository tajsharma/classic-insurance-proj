import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
    const [data, setData] = useState([]);
    const [endpoint, setEndpoint] = useState('');
    const navigate = useNavigate();
    const [headers, setHeaders] = useState<string[]>([]);

    const headerMappings: { [key: string]: string[] } = {
      '/admin/auto-data': ['ID', 'Name', 'Email', 'Phone', 'Vehicle Make', 'Vehicle Model', 'VIN', 'License Number', 'Insurance Company', 'Coverage'],
      '/admin/home-data': ['ID', 'Name', 'Email', 'Phone', 'Property Address', 'Home Type', 'Home Value', 'Coverage Amount'],
      '/admin/business-data': ['ID', 'Name', 'Email', 'Phone', 'Business Name', 'Business Type', 'Coverage Amount'],
      '/admin/life-data':['ID','Name', 'Email', 'Phone', 'Coverage Type', 'Coverage Amount', 'Beneficiary']
    };
  
    useEffect(() => {
      // Fetch the data from the backend
      const fetchData = async () => {
        if (endpoint) {
          try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('authToken');
            
            // Send the token in the Authorization header
            const response = await axios.get(`http://localhost:5000${endpoint}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Add the Bearer token
              },
            });
            
            setData(response.data); // Store data in state
            setHeaders(headerMappings[endpoint] || []);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      };
  
      fetchData();
    }, [endpoint]);

    const handleLogout = () => {
      localStorage.removeItem('authToken'); // Clear the token
      navigate('/login'); // Redirect to login page
    };
    
    return (
      <div className='bg-orange-200 h-screen'> 
      <div className="pt-28 px-5 gap-5 flex justify-end items-center">
      <button
          className="bg-orange-400 text-blue-900 font-bold py-2 px-4 rounded-lg hover:text-white transition duration-200"
        > Employee Profile </button>
        <button
          onClick={handleLogout}
          className="bg-orange-400 text-blue-900 font-bold py-2 px-4 rounded-lg hover:text-white transition duration-200"
        > Logout </button>
      </div>
      <div className="pt-3 p-5">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Admin Dashboard</h1>
        <p className='text-xl text-center mb-4'><i>*Click an option below to start query*</i></p>
        <div id="buttons" className='py-4 pb-5 flex justify-around'>
            <button id='get_auto' onClick={() => setEndpoint('/admin/auto-data')} className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Auto Insurance</button>
            <button id='get_home' onClick={() => setEndpoint('/admin/home-data')} className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Home Insurance</button>
            <button id='get_life' onClick={() => setEndpoint('/admin/life-data')} className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Life Insurance</button>
            <button id='get_business' onClick={() => setEndpoint('/admin/business-data')} className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Business Insurance</button>
        </div>
        <table className="table-auto w-full border-separate border-spacing-2 border-collapse">
          <thead>
            <tr className="bg-orange-400">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2 rounded-lg">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 bg-white px-4 py-2 rounded-lg">
                    {item[Object.keys(item)[colIndex]] || 'N/A'} {/* Match keys dynamically */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
  };

  export default AdminPage;