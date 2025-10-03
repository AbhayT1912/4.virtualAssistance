import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(userDataContext);

  if (!userData) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;
