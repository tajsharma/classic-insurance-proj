import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AdminPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [endpoint, setEndpoint] = useState('');
    const [headers, setHeaders] = useState<string[]>([]);
    const [contactInfo, setContactInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
    const [flaggedClients, setFlaggedClients] = useState<{ [key: string]: number[] }>({}); // Track flagged clients by ID
  
    const headerMappings: { [key: string]: string[] } = {
      '/admin/auto-data': ['ID', 'Name', 'Email', 'Phone', 'Vehicle Make', 'Vehicle Model', 'VIN', 'License Number', 'Insurance Company', 'Coverage'],
      '/admin/home-data': ['ID', 'Name', 'Email', 'Phone', 'Property Address', 'Home Type', 'Home Value', 'Coverage Amount'],
      '/admin/business-data': ['ID', 'Name', 'Email', 'Phone', 'Business Name', 'Business Type', 'Coverage Amount'],
      '/admin/life-data': ['ID', 'Name', 'Email', 'Phone', 'Coverage Type', 'Coverage Amount', 'Beneficiary'],
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
            setHeaders(headerMappings[endpoint] || []);
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
    
    const handleFlagClient = async (id: number, isFlagged: boolean) => {
      try {
        const token = localStorage.getItem('authToken');
        const actionEndpoint = isFlagged ? '/unassign-client' : '/assign-client'; // Decide action
    
        const tableName = tableMappings[endpoint]; // Map current endpoint to table
        if (!tableName) throw new Error('Invalid table mapping'); // Handle unknown endpoints
    
        const payload = {
          clientId: id,
          tableName,
          employeeName: 'currentEmployee', // Replace with logged-in employee's name
        };
    
        const response = await axios.post(`http://localhost:5000${actionEndpoint}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log(response.data); // Debugging
        alert(response.data.message); // Notify success
    
        // Update flagged clients for the current table
        setFlaggedClients((prev) => {
          const updatedClients = isFlagged
            ? (prev[endpoint] || []).filter((clientId) => clientId !== id)
            : [...(prev[endpoint] || []), id];
    
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
      <div className="bg-orange-200 h-screen">
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
        <div className="pt-3 p-5">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-center mb-4">
            <i>*Click an option below to start query*</i>
          </p>
          <div id="buttons" className="py-4 pb-5 flex justify-around">
            <button onClick={() => setEndpoint('/admin/auto-data')} className="text-white hover:text-orange-400 bg-blue-900 rounded-lg mx-4 text-sm p-1 px-5">
              View Auto Insurance
            </button>
            <button onClick={() => setEndpoint('/admin/home-data')} className="text-white hover:text-orange-400 bg-blue-900 rounded-lg mx-4 text-sm p-1 px-5">
              View Home Insurance
            </button>
            <button onClick={() => setEndpoint('/admin/life-data')} className="text-white hover:text-orange-400 bg-blue-900 rounded-lg mx-4 text-sm p-1 px-5">
              View Life Insurance
            </button>
            <button onClick={() => setEndpoint('/admin/business-data')} className="text-white hover:text-orange-400 bg-blue-900 rounded-lg mx-4 text-sm p-1 px-5">
              View Business Insurance
            </button>
          </div>
          <table className="table-auto w-full border-separate border-spacing-2 border-collapse">
            <thead>
              <tr className="bg-orange-400">
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-2 rounded-lg">
                    {header}
                  </th>
                ))}
                <th className="px-4 py-2 rounded-lg">Assignee</th>
                <th className="px-4 py-2 rounded-lg">Actions</th> {/* Add column for actions */}
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
                      onClick={() => handleFlagClient(item.id, (flaggedClients[endpoint] || []).includes(item.id))}
                      className={`text-white text-sm px-3 py-1 rounded-lg ${
                        (flaggedClients[endpoint] || []).includes(item.id) ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                    >
                      {(flaggedClients[endpoint] || []).includes(item.id) ? 'Unflag' : 'Flag'}
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
  
        {/* Contact Info Modal */}
        {contactInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-bold mb-4">Contact Information</h2>
              <p>
                <strong>Name:</strong> {contactInfo.name}
              </p>
              <p>
                <strong>Email:</strong> {contactInfo.email}
              </p>
              <p>
                <strong>Phone:</strong> {contactInfo.phone}
              </p>
              <button
                onClick={closeContactModal}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default AdminPage;