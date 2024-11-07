import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');

  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;