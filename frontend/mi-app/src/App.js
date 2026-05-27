import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutAdmin from './layouts/LayoutAdmin';
import LayoutUser from './layouts/LayoutUser';
import AdminDashboard from './pages/admin/AdminDashboard';
import AccessLogs from './pages/admin/AccessLogs';
import ManageContent from './pages/admin/ManageContent';
import ManageEmails from './pages/admin/ManageEmails';
import ManageNotifications from './pages/admin/ManageNotifications';
import ManagePaymentCards from './pages/admin/ManagePaymentCards';
import ManageSubscriptions from './pages/admin/ManageSubscriptions';
import ManageUsers from './pages/admin/ManageUsers';
import Home from './pages/users/Home';
import Acerca from './pages/users/acerca';
import Blog from './pages/users/Blog';
import Contacto from './pages/users/contacto';
import Movies from './pages/users/Movies';
import MoviePlayer from './pages/users/MoviePlayer';
import Notifications from './pages/users/Notifications';
import Profile from './pages/users/Profile';
import Search from './pages/users/Search';
import Subscription from './pages/users/Subscription';
import Login from './pages/users/auth/Login';
import Register from './pages/users/auth/Register';
import Termino from './pages/users/Termino';
import './App.css';

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser || rawUser === 'undefined') {
      return null;
    }
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const AdminRoute = ({ children }) => {
  const user = getStoredUser();
  const token = localStorage.getItem('token');

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/users/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutUser><Home /></LayoutUser>} />
        <Route path="/admin/*" element={
          <AdminRoute>
            <LayoutAdmin>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="access" element={<AccessLogs />} />
                <Route path="content" element={<ManageContent />} />
                <Route path="emails" element={<ManageEmails />} />
                <Route path="notifications" element={<ManageNotifications />} />
                <Route path="payment-cards" element={<ManagePaymentCards />} />
                <Route path="subscriptions" element={<ManageSubscriptions />} />
                <Route path="users" element={<ManageUsers />} />
              </Routes>
            </LayoutAdmin>
          </AdminRoute>
        } />
        <Route path="/users/*" element={
          <LayoutUser>
            <Routes>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="movies" element={<Movies />} />
              <Route path="movies/:id" element={<MoviePlayer />} />
              <Route path="blog" element={<Blog />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="acerca" element={<Acerca />} />
              <Route path="about" element={<Acerca />} />
              <Route path="contact" element={<Contacto />} />
              <Route path="search" element={<Search />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="terminos" element={<Termino />} />
            </Routes>
          </LayoutUser>
        } />
      </Routes>
    </Router>
  );
}

export default App;
