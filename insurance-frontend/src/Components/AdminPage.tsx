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
        '/admin/auto-data': ['ID', 'Name', 'Email', 'Phone', 'Vehicle Make', 'Vehicle Model', 'VIN', 'License Number', 'Insurance Company', 'Coverage'],
        '/admin/home-data': ['ID', 'Name', 'Email', 'Phone', 'Property Address', 'Home Type', 'Home Value', 'Coverage Amount'],
        '/admin/business-data': ['ID', 'Name', 'Email', 'Phone', 'Business Name', 'Business Type', 'Coverage Amount'],
        '/admin/life-data': ['ID', 'Name', 'Email', 'Phone', 'Coverage Type', 'Coverage Amount', 'Beneficiary'],
        '/admin/flagged-clients': ['ID', 'Name', 'Email', 'Phone', 'Insurance Type'], // Headers updated for flagged clients
    };

    useEffect(() => {
        const fetchData = async () => {
            if (endpoint) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.get(`http://localhost:5001${endpoint}`, {
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

    const handleDeleteClick = async (clientId: number, tableName: string) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this client? This action is irreversible.");
      if (!confirmDelete) return;
  
      try {
          const token = localStorage.getItem('authToken');
  
          // Send clientId and tableName in the request body
          const response = await axios.delete('http://localhost:5001/admin/delete-client', {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              data: { clientId, tableName }, // Include the necessary fields in the payload
          });
           console.log("HERES WHAT UR SENDING ---->",response.data);
          alert(response.data.message);
          

          // Update the UI after deletion
          setData(data.filter((client) => client.id !== clientId));
      } catch (error) {
          console.error('Error deleting client:', error);
          alert('Failed to delete the client.');
      }
  };
  
  
    
  const handleFlagClient = async (id: number, isFlagged: boolean) => {
    try {
        const token = localStorage.getItem('authToken');
        const actionEndpoint = isFlagged ? '/unassign-client' : '/assign-client'; // Decide action

        const tableMappings: { [key: string]: string } = {
            '/admin/auto-data': 'auto_insurance',
            '/admin/home-data': 'home_insurance',
            '/admin/business-data': 'business_insurance',
            '/admin/life-data': 'life_insurance',
        };

        const tableName = tableMappings[endpoint]; // Use the current `endpoint` to get the table name
        if (!tableName) {
            alert('Invalid table mapping. Cannot flag/unflag client.');
            return;
        }

        const payload = {
            clientId: id,
            tableName,
            employeeName: 'currentEmployee', // Replace with logged-in employee's name
        };

        const response = await axios.post(`http://localhost:5001${actionEndpoint}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data); // Debugging
        alert(response.data.message); // Notify success

        // Update flagged clients for the current table
        setFlaggedClients((prev) => {
            const updatedClients = isFlagged
                ? (prev[endpoint] || []).filter((clientId) => clientId !== id) // Remove client from flagged list
                : [...(prev[endpoint] || []), id]; // Add client to flagged list

            return { ...prev, [endpoint]: updatedClients }; // Update specific endpoint
        });

        // Update the assigned_to field dynamically in the data
        const updatedData = data.map((client) => {
            if (client.id === id) {
                return {
                    ...client,
                    assigned_to: isFlagged ? null : response.data.employeeName, // Update dynamically
                };
            }
            return client;
        });
        setData(updatedData);
    } catch (error) {
        console.error('Error updating client:', error);
        alert('An error occurred while updating the client');
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
                  <th className="px-4 py-2 rounded-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id}>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 bg-white px-4 py-2 rounded-lg">
                        {item[Object.keys(item)[colIndex]] || 'N/A'}
                      </td>
                    ))}
                    <td className="border border-gray-300 bg-white px-4 py-2 rounded-lg">
                      {item.assigned_to || 'Unassigned'}
                    </td>
                    <td className="border border-gray-300 bg-white px-4 py-2 rounded-lg flex gap-2">
                      <button
                        onClick={() => handleFlagClient(item.id, flaggedClients[endpoint]?.includes(item.id))}
                        className={`text-white text-sm px-3 py-1 rounded-lg ${
                          flaggedClients[endpoint]?.includes(item.id) ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                      >
                        {flaggedClients[endpoint]?.includes(item.id) ? 'Unflag' : 'Flag'}
                      </button>
                      <button
                        onClick={() => handleContactClick(item.name, item.email, item.phone)}
                        className="bg-green-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600"
                      >
                        Contact
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
