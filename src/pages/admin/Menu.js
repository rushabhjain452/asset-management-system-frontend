import React from 'react';
import { Link} from 'react-router-dom';
import avatar from 'admin-lte/dist/img/avatar5.png';

function Menu() {
  const name = localStorage.getItem('name');

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* <a href="index.html" className="brand-link"> */}
        <Link exact to="/admin/dashboard" className="brand-link">
          <img src={require('../../images/AdminLTELogo.png').default} alt="Asset Management Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">Asset Management</span>
        {/* </a> */}
        </Link>
        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src={avatar} className="img-circle elevation-2" alt="User Image" />
            </div>
            <div className="info">
              <a href="#" className="d-block">{ name }</a>
            </div>
          </div>
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <Link exact to="/admin/dashboard" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                  </Link>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <Link exact to="/admin/gender" className="nav-link">
                  <i className=" nav-icon fas fa-venus-mars" />
                  <p>Gender</p>
                  </Link>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <Link exact to="/admin/role" className="nav-link">
                  <i class=" nav-icon fas fa-user-tag"></i>
                  <p>Role</p>
                  </Link>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <Link exact to="/admin/asset-type" className="nav-link">
                  <i class=" nav-icon fas fa-headset"></i>
                  <p>Asset type</p>
                  </Link>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <Link exact to="/admin/properties" className="nav-link">
                  <i class=" nav-icon fas fa-info-circle"></i>
                  <p>Properties</p>
                  </Link>
              </li>
              <li className="nav-item menu-open">
                {/* <a href="./index.html" className="nav-link active"> */}
                <Link exact to="/admin/asset" className="nav-link">
                  <i class=" nav-icon fas fa-laptop"></i>
                  <p>Asset</p>
                  </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default Menu;
