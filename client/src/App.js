import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPortal from './pages/AdminPortal';
import EmployeePortal from './pages/EmployeePortal';
import ClientPortal from './pages/ClientPortal';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/employee/*" element={<EmployeePortal />} />
          <Route path="/client/*" element={<ClientPortal />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;
