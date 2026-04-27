import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import Users from './pages/Users';
import AiAnalytics from './pages/AiAnalytics';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Infrastructure from './pages/Infrastructure';
import Scraper from './pages/Scraper';
import Login from './pages/Login';

function RequireAuth({ children }) {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="infrastructure" element={<Infrastructure />} />
        <Route path="scraper" element={<Scraper />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="users" element={<Users />} />
        <Route path="analytics" element={<AiAnalytics />} />
        <Route path="logs" element={<Logs />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
