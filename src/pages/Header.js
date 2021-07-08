import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';

function Header() {

  const [logout, setLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('employeeId');
    localStorage.removeItem('name');
    localStorage.removeItem('emailId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setLogout(true);
  };

  if(logout) {
    return <Redirect exact to="/login" />;
  }

  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            {/* <a href="index.html" className="nav-link">Home</a> */}
            <Link exact to="/admin/dashboard" className="nav-link">Home</Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <span className="nav-link logout-link" onClick={ handleLogout }><i class="fas fa-sign-out-alt"></i></span>
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
