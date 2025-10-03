import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userDataContext } from '../context/userContext';

const PublicRoute = ({ children }) => {
  const { userData } = useContext(userDataContext);
  const location = useLocation();

  if (userData && location.pathname !== '/signin' && location.pathname !== '/signup') {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
