import React from 'react';
import AdminDashboardContent from './AdminDashboardContent';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';

function AdminDashboard() {
  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <AdminDashboardContent />
      <Footer />
    </div>
  )
}

export default AdminDashboard;
