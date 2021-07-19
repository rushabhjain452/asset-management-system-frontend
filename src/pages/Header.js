import React, { useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';

function Header() {

  const { logout } = useContext(AuthContext);

  // const [logout, setLogout] = useState(false);

  // const handleLogout = () => {
  //   // logout();
  //   sessionStorage.removeItem('employeeId');
  //   sessionStorage.removeItem('name');
  //   sessionStorage.removeItem('emailId');
  //   sessionStorage.removeItem('role');
  //   sessionStorage.removeItem('token');
  //   setLogout(true);
  // };

  const handleLogout = () => {
    logout();
  }

  // if(logout) {
  //   return <Redirect to="/login" />;
  // }

  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            {/* <a href="index.html" className="nav-link">Home</a> */}
            <Link to="/admin/dashboard" className="nav-link">Home</Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <span className="nav-link logout-link" title="Logout" onClick={ handleLogout }>
              <i className="fas fa-sign-out-alt"></i>
            </span>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-widget="fullscreen" href="#" role="button">
              <i className="fas fa-expand-arrows-alt"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Header;
