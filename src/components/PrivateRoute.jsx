/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Firebase/AuthContext";

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
