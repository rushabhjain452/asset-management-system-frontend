import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import UserDashboardContent from './UserDashboardContent';
import UserMenu from './UserMenu';
import Loader from '../components/Loader';

const UserDashboard = () => {

  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Header />
      <UserMenu />
      <Loader loading={loading} />
      <UserDashboardContent setLoading={setLoading} />
      <Footer />
    </div>
  );

}

export default UserDashboard;
