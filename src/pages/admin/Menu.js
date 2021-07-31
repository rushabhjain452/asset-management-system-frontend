import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';
import { AuthContext } from '../../context/AuthContext';

const Menu = () => {
  // const name = sessionStorage.getItem('name');
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
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* <a href="index.html" className="brand-link"> */}
      <NavLink exact to="/admin/dashboard" className="brand-link">
        <img src={require('../../images/AdminLTELogo.png').default} alt="Asset Management Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
        <span className="brand-text font-weight-light">Asset Management</span>
        {/* </a> */}
      </NavLink>
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
            <li className="nav-item menu-open">
              <NavLink exact to="/admin/dashboard" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Dashboard</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              <NavLink exact to="/admin/employee" className="nav-link" activeClassName="active">
                <i className="fas fa-user-plus nav-icon"></i>
                <p>Employee</p>
              </NavLink>
            </li>
            {/* <li className="nav-item menu-open">
              <NavLink exact to="/admin/gender" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-venus-mars" />
                <p>Gender</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              <NavLink exact to="/admin/role" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-user-tag"></i>
                <p>Role</p>
              </NavLink>
            </li> */}
            <li className="nav-item menu-open">
              {/* <a href="./index.html" className="nav-link active"> */}
              <NavLink exact to="/admin/asset-types" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-headset"></i>
                <p>Asset Types</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              {/* <a href="./index.html" className="nav-link active"> */}
              <NavLink exact to="/admin/properties" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-info-circle"></i>
                <p>Properties</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              {/* <a href="./index.html" className="nav-link active"> */}
              <NavLink exact to="/admin/assettype-properties" className="nav-link" activeClassName="active">
                <i className=" nav-icon fas fa-laptop"></i>
                <p>Properties for Asset</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              {/* <a href="./index.html" className="nav-link active"> */}
              <NavLink exact to="/admin/assets" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-laptop"></i>
                <p>Assets</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              <NavLink exact to="/admin/assign-return-asset" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-laptop-code"></i>
                <p>Assign/Return Asset</p>
              </NavLink>
            </li>
            {/* <li className="nav-item menu-open">
              <NavLink exact to="/admin/assign-asset-history/15" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-laptop-code"></i>
                <p>Assign Asset History</p>
              </NavLink>
            </li> */}
            <li className="nav-item menu-open">
              <NavLink to="/admin/auction/0" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-gavel"></i>
                <p>Auction</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              <NavLink exact to="/admin/sale-asset" className="nav-link" activeClassName="active">
                <i className="nav-icon fas fa-money-bill-alt"></i>
                <p>Sold Assets</p>
              </NavLink>
            </li>
            {/* <li className="nav-item menu-open">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-user-tie"></i>
                <p>
                  Bid
                    <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink exact to="/bids" className="nav-link">
                    <i className="fas fa-gavel nav-icon"></i>
                    <p>Bid On Asset</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink exact to="/admin/view-bids" className="nav-link">
                    <i className="fas fa-gavel nav-icon"></i>
                    <p>View Bid's</p>
                  </NavLink>
                </li>
              </ul>
            </li> */}
            {/* <li className="nav-item menu-open">
              <NavLink exact to="" className="nav-link" activeClassName="active">
                <i className=" nav-icon fas fa-laptop"></i>
                <p>Manage Self</p>
              </NavLink>
            </li> */}
            <li className="nav-item menu-open">
              <NavLink exact to="/view-assign-asset" className="nav-link" activeClassName="active">
                <i className=" nav-icon fas fa-laptop"></i>
                <p>View Assign Asset</p>
              </NavLink>
            </li>
            <li className="nav-item menu-open">
              <NavLink exact to="/view-returned-asset" className="nav-link" activeClassName="active">
                <i className=" nav-icon fas fa-laptop"></i>
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
                <p>Active Auctions</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default Menu;