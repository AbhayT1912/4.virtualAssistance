import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'
import { userDataContext } from './context/userContext'
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  const { userData, loading, isProfileComplete } = useContext(userDataContext);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            {isProfileComplete ? <Home /> : <Navigate to="/customize" />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signin" 
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } 
      />
      <Route 
        path="/customize" 
        element={
          <ProtectedRoute>
            <Customize />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customize2" 
        element={
          <ProtectedRoute>
            <Customize2 />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App
