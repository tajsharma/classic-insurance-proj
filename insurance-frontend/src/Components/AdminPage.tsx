import React, {useEffect, useState} from 'react';
import axios from 'axios';

const AdminPage: React.FC = () => {
    const [autoInsuranceData, setAutoInsuranceData] = useState([]);
  
    useEffect(() => {
      // Fetch the data from the backend
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/admin/auto-data');
          setAutoInsuranceData(response.data); // Store data in state
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className='bg-orange-200 h-screen'> 
      <div className="pt-28 p-5">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Admin Dashboard</h1>
        <p className='text-xl text-center mb-4'><i>*Click an option below to start query*</i></p>
        <div id="buttons" className='py-4 pb-5 flex justify-around'>
            <button id='get_auto' className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Auto Insurance</button>
            <button id='get_home' className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Home Insurance</button>
            <button id='get_life' className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Life Insurance</button>
            <button id='get_business' className='text-white  hover:text-orange-400 bg-blue-900  rounded-lg mx-4 text-sm p-1 px-5'>View Business Insurance</button>
        </div>
        <table className="table-auto w-full border-separate border-spacing-2 border-collapse">
          <thead>
            <tr className="bg-orange-400">
              <th className="px-4 py-2 rounded-lg">ID</th>
              <th className="px-4 py-2 rounded-lg">Name</th>
              <th className="px-4 py-2 rounded-lg">Email</th>
              <th className="px-4 py-2 rounded-lg">Phone</th>
              <th className="px-4 py-2 rounded-lg">Vehicle Make</th>
              <th className="px-4 py-2 rounded-lg">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {autoInsuranceData.map((item: any) => (
              <tr key={item.id}>
                <td className="border border-black bg-white px-4 py-2 rounded-lg">{item.id}</td>
                <td className="border border-black bg-white px-4 py-2 rounded-lg">{item.name}</td>
                <td className="border border-black bg-white px-4 py-2 rounded-lg">{item.email}</td>
                <td className="border border-black bg-white px-4 py-2 rounded-lg">{item.phone}</td>
                <td className="border border-black bg-white px-4 py-2 rounded-lg">{item.vehicle_make}</td>
                <td className="border border-black bg-white px-4 py-2 rounded-lg">{item.coverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
  };

  export default AdminPage;