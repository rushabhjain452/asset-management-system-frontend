import React, { useState } from 'react';
import AdminDashboardContent from './AdminDashboardContent';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <Loader loading={loading} />
      <AdminDashboardContent setLoading={setLoading} />
      <Footer />
    </div>
  )
}

export default AdminDashboard;
