import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const { isSubscribed, isFreeTrialOver } = jwtDecode(token);
    
    if (isSubscribed || !isFreeTrialOver) {
      return children;
    } else {
      return <Navigate to="/subscribe" replace />;
    }
  } catch (error) {
    console.error("Token decoding failed", error);
    return <Navigate to="/login" replace />;
  }
};
