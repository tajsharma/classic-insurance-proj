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
      <div className="pt-28 p-5">
        <h1 className="text-4xl font-bold text-center mb-6">Admin Dashboard</h1>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Vehicle Make</th>
              <th className="border border-gray-300 px-4 py-2">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {autoInsuranceData.map((item: any) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                <td className="border border-gray-300 px-4 py-2">{item.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{item.vehicle_make}</td>
                <td className="border border-gray-300 px-4 py-2">{item.coverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default AdminPage;