import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';
import { AuthContext } from '../context/AuthContext';

const UserMenu = () => {
  const { state, updateContextState } = useContext(AuthContext);
  let username = state.username;
  let profilePicture = state.profilePicture;
  let gender = state.gender;

  if (!username) {
    username = sessionStorage.getItem('username');
    gender = sessionStorage.getItem('gender');
    profilePicture = sessionStorage.getItem('profilePicture');
    updateContextState();
  }

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="index.html" className="brand-link">
          <img src={require('../images/AdminLTELogo.png').default} alt="Asset Management Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">Asset Management</span>
        </a>
        <div className="sidebar">
          <NavLink to="/profile/update" className="d-block" activeClassName="active">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
              <div className="image">
                <img src={profilePicture != '' ? profilePicture : gender === 'Female' ? femaleAvatar : maleAvatar} className="img-circle elevation-2" />
              </div>
              <div className="info">
                {username}
              </div>
            </div>
          </NavLink>
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {/* <li className="nav-item menu-open">
                <a href="./index.html" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </a>
              </li> */}
              <li className="nav-item menu-open">
                <NavLink exact to="/dashboard" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                <NavLink exact to="/view-assign-asset" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-laptop"></i>
                  <p>View Assign Asset</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                <NavLink exact to="/view-returned-asset" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-laptop"></i>
                  <p>View Returned Asset</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                <NavLink exact to="/view-asset-purchase" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-laptop"></i>
                  <p>View Asset Purchase</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                <NavLink exact to="/auctions" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-gavel"></i>
                  <p>Auctions</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default UserMenu;
