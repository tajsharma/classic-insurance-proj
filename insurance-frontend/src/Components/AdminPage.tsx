import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PassThrough } from 'stream';

const AdminPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [endpoint, setEndpoint] = useState('');
    const [headers, setHeaders] = useState<string[]>([]);
    const [contactInfo, setContactInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
    const [flaggedClients, setFlaggedClients] = useState<{ [key: string]: number[] }>({}); // Track flagged clients by ID
  
    // Updated headerMappings for all endpoints
    const headerMappings: { [key: string]: string[] } = {
      '/admin/auto-data': ['Unique ID', 'Name', 'Email', 'Phone', 'Vehicle Make', 'Vehicle Model', 'VIN', 'License Number', 'Insurance Company', 'Coverage', 'Assigned To'],
      '/admin/home-data': ['Unique ID', 'Name', 'Email', 'Phone', 'Property Address', 'Home Type', 'Property Value', 'Coverage Amount', 'Assigned To'],
      '/admin/business-data': ['Unique ID', 'Name', 'Email', 'Phone', 'Business Name', 'Business Type', 'Coverage Amount', 'Assigned To'],
      '/admin/life-data': ['Unique ID', 'Name', 'Email', 'Phone', 'Coverage Type', 'Coverage Amount', 'Beneficiary', 'Assigned To'],
      '/admin/flagged-clients': ['ID', 'Name', 'Email', 'Phone', 'Insurance Type', 'Assigned To'], // Headers updated for flagged clients
    };
    

    useEffect(() => {
        const fetchData = async () => {
            if (endpoint) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.get(`http://localhost:5000${endpoint}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setData(response.data);
                    setHeaders(headerMappings[endpoint] || []); // Set the headers based on the selected endpoint
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [endpoint]);

    // Flag a client
    const tableMappings: { [key: string]: string } = {
        '/admin/auto-data': 'auto_insurance',
        '/admin/home-data': 'home_insurance',
        '/admin/business-data': 'business_insurance',
        '/admin/life-data': 'life_insurance',
    };

    const handleDeleteClick = async (uniqueId: number) => {
      if (window.confirm('Are you sure you want to delete this client? This action is irreversible.')) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.delete(
            `http://localhost:5000/admin/delete-client`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: {
                uniqueId, // Pass the unique_id of the customer
              },
            }
          );
    
          alert(response.data.message);
    
          // Update the table data after deletion
          setData((prevData) => prevData.filter((client) => client.unique_id !== uniqueId));
        } catch (error) {
          console.error('Error deleting client:', error);
          alert('An error occurred while deleting the client.');
        }
      }
    };
    
      
  
  
    
    const handleFlagClient = async (uniqueId: number, isFlagged: boolean) => {
      try {
        const token = localStorage.getItem('authToken');
        const actionEndpoint = isFlagged ? '/unassign-client' : '/assign-client';
    
        const payload = { clientId: uniqueId };
        const response = await axios.post(`http://localhost:5000${actionEndpoint}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        alert(response.data.message);
    
        // Update the data with the new assigned state
        const updatedData = data.map((client) =>
          client.unique_id === uniqueId
            ? { ...client, assigned_to: isFlagged ? null : response.data.employeeName }
            : client
        );
        setData(updatedData);
      } catch (error) {
        console.error('Error updating client:', error);
        alert('An error occurred while flagging/unflagging the client.');
      }
    };
  
  


    // Show contact info in a modal or pop-up
    const handleContactClick = (name: string, email: string, phone: string) => {
        setContactInfo({ name, email, phone });
    };

    // Close the contact info modal
    const closeContactModal = () => {
        setContactInfo(null);
    };

    return (
      <div className="bg-orange-200 min-h-screen flex flex-col">
        <div className="pt-28 px-5 gap-5 flex justify-end items-center">
          <button className="bg-orange-400 text-blue-900 font-bold py-2 px-4 rounded-lg hover:text-white transition duration-200">Employee Profile</button>
          <button
            className="bg-orange-400 text-blue-900 font-bold py-2 px-4 rounded-lg hover:text-white transition duration-200"
            onClick={() => {
              localStorage.removeItem('authToken');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
        <div className="pt-3 p-5 flex-grow">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-center mb-4">
            <i>*Click an option below to start query*</i>
          </p>
          <div id="buttons" className="py-4 pb-5 flex justify-around">
            <button
              onClick={() => setEndpoint('/admin/auto-data')}
              className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition-all duration-200"
            >
              Auto Insurance
            </button>
            <button
              onClick={() => setEndpoint('/admin/home-data')}
              className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition-all duration-200"
            >
              Home Insurance
            </button>
            <button
              onClick={() => setEndpoint('/admin/life-data')}
              className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition-all duration-200"
            >
              Life Insurance
            </button>
            <button
              onClick={() => setEndpoint('/admin/business-data')}
              className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition-all duration-200"
            >
              Business Insurance
            </button>
            <button
              onClick={() => setEndpoint('/admin/flagged-clients')}
              className="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition-all duration-200"
            >
              View Flagged Clients
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg p-4">
            <table className="table-auto w-full border-separate border-spacing-2 border-collapse">
              <thead>
                <tr className="bg-orange-400">
                  {headers.map((header, index) => (
                    <th key={index} className="px-4 py-2 rounded-lg">
                      {header}
                    </th>
                  ))}
                  <th className="px-4 py-2 rounded-lg">Assignee</th>
                  <th className="px-4 py-2 rounded-lg bg">Actions</th>
                </tr>
              </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.unique_id}>
                      {headers.map((header, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 bg-white px-4 py-2 rounded-lg">
                          {item[Object.keys(item)[colIndex]] || 'N/A'}
                        </td>
                      ))}
                      <td className="border border-gray-300 bg-white px-4 py-2 rounded-lg">
                        {item.assigned_to || 'Unassigned'}
                      </td>
                      <td className="border border-gray-300 bg-transparent justify-between px-4 py-2 rounded-lg flex gap-2">
                        <button
                          onClick={() => handleFlagClient(item.unique_id, !!item.assigned_to)}
                          className={`text-white text-sm px-3 py-1 rounded-lg ${
                            item.assigned_to ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                        >
                          {item.assigned_to ? 'Unflag' : 'Flag'}
                        </button>
                        <button
                          onClick={() => handleContactClick(item.name, item.email, item.phone)}
                          className="bg-green-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600"
                        >
                          Contact
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.unique_id)}
                          className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
          <div className="py-10"></div> {/* Add padding at the bottom */}
        </div>
      </div>
    );
  };    

export default AdminPage;
