import React from 'react'

function UserMenu() {
  return (
 <div>
  <aside className="main-sidebar sidebar-dark-primary elevation-4">
    <a href="index.html" className="brand-link">
      <img src={require('../images/AdminLTELogo.png').default} alt="Asset Management Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
      <span className="brand-text font-weight-light">Asset Management</span>
    </a>
    <div className="sidebar">
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li className="nav-item menu-open">
            <a href="./index.html" className="nav-link active">
              <i className="nav-icon fas fa-tachometer-alt" />
              <p>
                Dashboard
              </p>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</div>

  )
}

export default UserMenu
