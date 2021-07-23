import React from 'react';
import { NavLink } from 'react-router-dom';
import avatar from 'admin-lte/dist/img/avatar5.png';

const UserMenu = () => {
  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="index.html" className="brand-link">
          <img src={require('../images/AdminLTELogo.png').default} alt="Asset Management Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">Asset Management</span>
        </a>
        <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src={avatar} className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              {/* <a href="#" className="d-block">{name}</a> */}
              <NavLink to="/profile" className="d-block">Asset</NavLink>
            </div>
          </div>
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item menu-open">
                <a href="./index.html" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </a>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/view-assign-asset" className="nav-link" activeClassName="active">
                  <i className=" nav-icon fas fa-gavel"></i>
                  <p>View Assign Asset</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/view-asset-sales" className="nav-link" activeClassName="active">
                  <i className=" nav-icon fas fa-gavel"></i>
                  <p>View Asset Sales</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/bids" className="nav-link" activeClassName="active">
                  <i className=" nav-icon fas fa-gavel"></i>
                  <p>Bid On Asset</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default UserMenu;
