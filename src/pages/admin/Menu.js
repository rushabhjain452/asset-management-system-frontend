import React from 'react';
import { NavLink } from 'react-router-dom';
import avatar from 'admin-lte/dist/img/avatar5.png';

function Menu() {
  const name = sessionStorage.getItem('name');

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
              <img src={avatar} className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              {/* <a href="#" className="d-block">{name}</a> */}
              <NavLink to="/profile" className="d-block">{name}</NavLink>
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
              <li class="nav-item menu-open">
                <a href="#" class="nav-link">
                  <i class="nav-icon fas fa-user-tie"></i>
                  <p className="menu-link-style">
                    Employee
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <NavLink exact to="/admin/add-employee" class="nav-link">
                      <i class="fas fa-user-plus nav-icon"></i>
                      <p className="menu-link-style">Add Employees</p>
                    </NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink exact to="/admin/view-employees" class="nav-link">
                      <i class="fas fa-users-cog nav-icon"></i>
                      <p className="menu-link-style">View Employees</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/gender" className="nav-link" activeClassName="active">
                  <i className=" nav-icon fas fa-venus-mars" />
                  <p className="menu-link-style">Gender</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/role" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-user-tag"></i>
                  <p className="menu-link-style">Role</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/asset-type" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-headset"></i>
                  <p className="menu-link-style">Asset Type</p>
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
                <NavLink exact to="/admin/asset" className="nav-link" activeClassName="active">
                  <i className="nav-icon fas fa-laptop"></i>
                  <p className="menu-link-style">Asset</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/asset-properties" className="nav-link" activeClassName="active">
                  <i class=" nav-icon fas fa-laptop"></i>
                  <p className="menu-link-style">Asset Properties</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/assign-asset" className="nav-link" activeClassName="active">
                  <i class="nav-icon fas fa-laptop-code"></i>
                  <p className="menu-link-style">Assign Asset</p>
                </NavLink>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/auction" className="nav-link" activeClassName="active">
                  <i class="nav-icon fas fa-gavel"></i>
                  <p className="menu-link-style">Auction</p>
                </NavLink>
              </li>
              <li class="nav-item menu-open">
                <a href="#" class="nav-link">
                  <i class="nav-icon fas fa-user-tie"></i>
                  <p className="menu-link-style">
                    Bid
                    <i class="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul class="nav nav-treeview">
                  <li class="nav-item">
                    <NavLink exact to="/bids" class="nav-link">
                      <i class="fas fa-gavel nav-icon"></i>
                      <p className="menu-link-style">Bid On Asset</p>
                    </NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink exact to="/admin/view-bids" class="nav-link">
                      <i class="fas fa-gavel nav-icon"></i>
                      <p className="menu-link-style">View Bid's</p>
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <NavLink exact to="/admin/sale-asset" className="nav-link" activeClassName="active">
                  <i class="nav-icon fas money-bill-alt"></i>
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
