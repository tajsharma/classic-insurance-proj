import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () =>{
    const [formData, setFormData] = useState({username:'', password:''});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/login', formData);
          if (response.status === 200) {
            localStorage.setItem('authToken', response.data.token); // Save token
            navigate('/admin'); // Redirect to admin page
          } else {
            setError('Invalid credentials');
          }
        } catch (error) {
          setError('Login failed');
          console.error('Error:', error);
        }
      };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-300">
          <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-lg w-1/3">
            <h2 className="text-3xl font-bold mb-4 text-center text-orange-400">Employee Portal Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="mb-4">
              <label className="block text-lg font-normal mb-2" htmlFor="username"> Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-normal mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="w-full bg-orange-400 font-medium text-2xl text-white py-2 rounded-lg hover:text-blue-900">Log In</button>
          </form>
        </div>
    );
};


export default Login;
