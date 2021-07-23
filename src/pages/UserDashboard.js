import React from 'react';
import Footer from './Footer';
import Header from './Header';
import UserDashboardContent from './UserDashboardContent';
import UserMenu from './UserMenu';

const UserDashboard = () => {

  return (
    <div>
      {/* <h1>User Dashboard</h1> */}
      <Header />
      <UserMenu />
      <UserDashboardContent />
      <Footer />
    </div>
  );

}

export default UserDashboard;
