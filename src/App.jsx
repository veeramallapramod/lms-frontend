import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

import Landing from './components/Landing';
import Login from './components/Login';
import { Register, VerifyOtp, ForgotPassword, ProtectedRoute } from './components/AuthPages';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import AddBook from './components/AddBook';
import AddStaff from './components/AddStaff';
import BookShelf from './components/BookShelf';
import Users from './components/Users';
import Approvals from './components/Approvals';
import BorrowManagement from './components/BorrowManagement';
import Reservations from './components/Reservations';
import Profile from './components/Profile';
import Subscriptions from './components/Subscriptions';
import MyBorrows from './components/MyBorrows';
import MemberPlans from './components/MemberPlans';

function AppRoutes() {
  const { token, theme } = useAuthStore();
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* All authenticated roles */}
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/books"        element={<ProtectedRoute><Books /></ProtectedRoute>} />
      <Route path="/bookshelf"    element={<ProtectedRoute><BookShelf /></ProtectedRoute>} />
      <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
      <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/my-borrows"   element={<ProtectedRoute roles={['MEMBER']}><MyBorrows /></ProtectedRoute>} />
      <Route path="/plans"        element={<ProtectedRoute roles={['MEMBER']}><MemberPlans /></ProtectedRoute>} />

      {/* Admin + Librarian */}
      <Route path="/add-book"     element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><AddBook /></ProtectedRoute>} />
      <Route path="/edit-book/:id" element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><AddBook /></ProtectedRoute>} />
      <Route path="/borrow"       element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><BorrowManagement /></ProtectedRoute>} />
      <Route path="/users"        element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><Users /></ProtectedRoute>} />
      <Route path="/approvals"    element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><Approvals /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/add-staff" element={<ProtectedRoute roles={['ADMIN']}><AddStaff /></ProtectedRoute>} />
      <Route path="/subscriptions"  element={<ProtectedRoute roles={['ADMIN']}><Subscriptions /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
