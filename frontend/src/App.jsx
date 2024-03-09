import React, { useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Login, Home, Calculator, Feedback, Layout, SingUp, Subscribe, Popup } from './components/Index.js'

import { LoginContext } from './context/LoginContext.js';
import { PublicRoute, ProtectedRoute, AuthenticatedRoute } from './utils/Index.js'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <SingUp />
          </PublicRoute>
        ),
      },
      {
        path: "/calculator",
        element: (
          <ProtectedRoute>
            <Calculator />
          </ProtectedRoute>
        ),
      },
      {
        path: "/feedback",
        element: (
          <AuthenticatedRoute>
            <Feedback />
          </AuthenticatedRoute>
        ),
      },

      {
        path: "/subscribe",
        element: (
          <AuthenticatedRoute>
            <Subscribe />
          </AuthenticatedRoute>
        ),
      },
    ],
  },
]);
const App = () => {


  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false);



  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <RouterProvider router={router}>
      </RouterProvider>
    </LoginContext.Provider>

  )
}

export default App