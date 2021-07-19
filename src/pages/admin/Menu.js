import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';
import { AuthContext } from '../../context/AuthContext';

function Menu() {
  // const name = sessionStorage.getItem('name');
  const { state } = useContext(AuthContext);
  const username = state.username;
  const profilePicture = state.profilePicture;
  const gender = state.gender;

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* <a href="index.html" className="brand-link"> */}
        <NavLink exact to="/admin/dashboard" className="brand-link">
          <img src={require('../../images/AdminLTELogo.png').default} alt="Asset Management Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">Asset Management</span>
          {/* </a> */}
        </NavLink>
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              {/* <img src={maleAvatar} className="img-circle elevation-2" alt="User Image" /> */}
              <img src={profilePicture != '' ? profilePicture : gender === 'Female' ? femaleAvatar : maleAvatar} className="img-circle elevation-2" width="100" height="100" />
            </div>
            <div className="info">
              {/* <a href="#" className="d-block">{name}</a> */}
              <NavLink to="/profile" className="d-block">{username}</NavLink>
            </div>
          </div>
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/dashboard" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p className="menu-link-style">Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                    <NavLink exact to="/admin/add-employee" className="nav-link" activeClassName="active">
                      <i className="fas fa-user-plus nav-icon"></i>
                      <p className="menu-link-style">Employee</p>
                    </NavLink>
              </li>
              {/* <li className="nav-item menu-open">
                <NavLink exact to="/admin/gender" className="nav-link" activeClassName="active">
                  <i className=" nav-icon fas fa-venus-mars" />
                  <p className="menu-link-style">Gender</p>
                </NavLink>
              </li> */}
              {/* <li className="nav-item menu-open">
                <NavLink exact to="/admin/role" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-user-tag"></i>
                  <p className="menu-link-style">Role</p>
                </NavLink>
              </li> */}
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/asset-types" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-headset"></i>
                  <p className="menu-link-style">Asset Types</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/properties" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-info-circle"></i>
                  <p className="menu-link-style">Properties</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/assettype-properties" className="nav-link" activeClassName="active">
                  <i className=" nav-icon fas fa-laptop"></i>
                  <p className="menu-link-style">Asset Type Properties</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/assets" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-laptop"></i>
                  <p className="menu-link-style">Assets</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/assign-asset" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-laptop-code"></i>
                  <p className="menu-link-style">Assign Asset</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/auction" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-gavel"></i>
                  <p className="menu-link-style">Auction</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-user-tie"></i>
                  <p className="menu-link-style">
                    Bid
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <NavLink exact to="/bids" className="nav-link">
                      <i className="fas fa-gavel nav-icon"></i>
                      <p className="menu-link-style">Bid On Asset</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink exact to="/admin/view-bids" className="nav-link">
                      <i className="fas fa-gavel nav-icon"></i>
                      <p className="menu-link-style">View Bid's</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/sale-asset" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas money-bill-alt"></i>
                  <p>Sale Asset</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default Menu;