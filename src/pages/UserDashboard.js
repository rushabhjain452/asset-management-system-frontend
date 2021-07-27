import React from 'react';
import Footer from './Footer';
import Header from './Header';
import UserDashboardContent from './UserDashboardContent';
import UserMenu from './UserMenu';

const UserDashboard = () => {

  return (
    <div>
      <Header />
      <UserMenu />
      <UserDashboardContent />
      <Footer />
    </div>
  );

}

export default UserDashboard;
