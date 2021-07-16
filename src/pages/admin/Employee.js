import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Menu from './Menu';

function AddEmployee() {
  return (
    <div>
      <Header />
      <Menu />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Employee Registration</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Add Employee</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                {/* <div className="card-header">
                  <h3 className="card-title">Employee Registration</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                      <i className="fas fa-minus" />
                    </button>
                  </div>
                </div> */}
                <div className="card-body">
                  <div className="form-group">
                    {/* <input type="text" id="inputName" className="form-control" /> */}
                    <h6>Employee Id:</h6>
                    <div className="input-group mb-3 ">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-id-badge" />
                        </span>
                      </div>
                      <input type="number" maxLength="20" className="form-control" placeholder="Employee Id" />
                    </div>
                  </div>
                  <div className="form-group">
                    <h6>First Name:</h6>
                    <div className="input-group mb-3 ">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-user-circle" />
                        </span>
                      </div>
                      <input type="text" maxLength="20" className="form-control" placeholder="Employee First Name" />
                    </div>
                  </div>
                  <div className="form-group">
                    <h6>Last Name:</h6>
                    <div className="input-group mb-3 ">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-user-circle" />
                        </span>
                      </div>
                      <input type="text" maxLength="20" className="form-control" placeholder="Employee Last Name" />
                    </div>
                  </div>
                  <div class="row">
                    <h6>Gender:</h6>
                    <div class="col-sm-1">
                      <div className="form-group">
                        <div className="input-group mb-3 ">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-male" />
                            </span>
                          </div>
                          <input type="radio" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-1">
                      <div className="form-group">
                        <div className="input-group mb-3 ">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fas fa-female" />
                            </span>
                          </div>
                          <input type="radio" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <h6>Email Address:</h6>
                    <div className="input-group mb-3 ">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-envelope-open-text" />
                        </span>
                      </div>
                      <input type="email" maxLength="20" className="form-control" placeholder="Email Address" />
                    </div>
                  </div>
                  <div className="form-group">
                    {/* <input type="text" id="inputName" className="form-control" /> */}
                    <h6>Mobile Number:</h6>
                    <div className="input-group mb-3 ">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-mobile" />
                        </span>
                      </div>
                      <input type="number" maxLength="20" className="form-control" placeholder="Employee Mobile Number" />
                    </div>
                  </div>
                  {/* <div class="row"> */}
                  <div className="form-group">
                    <h6>Profile Picture:</h6>
                    <div className="input-group mb-3 ">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-images" />
                        </span>
                      </div>
                      <input type="file" className="form-control" id="exampleInputFile" />
                    </div>
                  </div>
                  {/* </div> */}
                </div>
                {/* /.card-body */}
              </div>
              {/* /.card */}
            </div>
          </div>
          <div className="row">
            {/* <a href="#" className="btn btn-primary float-right">Register</a> */}
            <div className="card-footer">
              <button type="button" className="btn btn-secondary float-right">Cancel</button>
              <button
                type="button"
                className="btn btn-primary float-right"
              // onClick={btnText === 'Add' ? addGender : updateGender}
              >
                {/* {btnText} */}
            Register
            </button>
            </div>
          </div>
        </section>
        {/* /.content */}
      </div>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>List Of Employees</h1>
              </div>
              {/* <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">List Of Employees</li>
                </ol>
              </div> */}
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          {/* Default box */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Employees</h3>
              {/* <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                  <i className="fas fa-minus" />
                </button>
                <button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
                  <i className="fas fa-times" />
                </button>
              </div> */}
            </div>
            <div className="card-body p-0">
              <table className="table table-striped projects">
                <thead>
                  <tr>
                    <th style={{ width: '1%' }}>
                      #
              </th>
                    <th style={{ width: '20%' }}>
                      Project Name
              </th>
                    <th style={{ width: '30%' }}>
                      Team Members
              </th>
                    <th>
                      Project Progress
              </th>
                    <th style={{ width: '8%' }} className="text-center">
                      Status
              </th>
                    <th style={{ width: '20%' }}>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      #
              </td>
                    <td>
                      <a>
                        XYZ
                </a>
                      <br />
                      <small>
                        Created 01.01.2019
                </small>
                    </td>
                    <td>
                      <ul className="list-inline">
                        <li className="list-inline-item">
                          <img alt="Avatar" className="table-avatar" src="../../dist/img/avatar.png" />
                        </li>
                        <li className="list-inline-item">
                          <img alt="Avatar" className="table-avatar" src="../../dist/img/avatar2.png" />
                        </li>
                        <li className="list-inline-item">
                          <img alt="Avatar" className="table-avatar" src="../../dist/img/avatar3.png" />
                        </li>
                        <li className="list-inline-item">
                          <img alt="Avatar" className="table-avatar" src="../../dist/img/avatar4.png" />
                        </li>
                      </ul>
                    </td>
                    <td className="project_progress">
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-green" role="progressbar" aria-valuenow={57} aria-valuemin={0} aria-valuemax={100} style={{ width: '57%' }}>
                        </div>
                      </div>
                      <small>
                        57% Complete
                </small>
                    </td>
                    <td className="project-state">
                      <span className="badge badge-success">Success</span>
                    </td>
                    <td className="project-actions text-right">
                      <a className="btn btn-primary btn-sm" href="#">
                        <i className="fas fa-folder">
                        </i>
                  View
                </a>
                      <a className="btn btn-info btn-sm" href="#">
                        <i className="fas fa-pencil-alt">
                        </i>
                  Edit
                </a>
                      <a className="btn btn-danger btn-sm" href="#">
                        <i className="fas fa-trash">
                        </i>
                  Delete
                </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      #
              </td>
                    <td>
                      <a>
                        ABC
                </a>
                      <br />
                      <small>
                        Created 01.01.2019
                </small>
                    </td>
                    <td>
                      <ul className="list-inline">
                        <li className="list-inline-item">
                          <img alt="Avatar" className="table-avatar" src="../../dist/img/avatar.png" />
                        </li>
                        <li className="list-inline-item">
                          <img alt="Avatar" className="table-avatar" src="../../dist/img/avatar2.png" />
                        </li>
                      </ul>
                    </td>
                    <td className="project_progress">
                      <div className="progress progress-sm">
                        <div className="progress-bar bg-green" role="progressbar" aria-valuenow={47} aria-valuemin={0} aria-valuemax={100} style={{ width: '47%' }}>
                        </div>
                      </div>
                      <small>
                        47% Complete
                </small>
                    </td>
                    <td className="project-state">
                      <span className="badge badge-success">Success</span>
                    </td>
                    <td className="project-actions text-right">
                      <a className="btn btn-primary btn-sm" href="#">
                        <i className="fas fa-folder">
                        </i>
                  View
                </a>
                      <a className="btn btn-info btn-sm" href="#">
                        <i className="fas fa-pencil-alt">
                        </i>
                  Edit
                </a>
                      <a className="btn btn-danger btn-sm" href="#">
                        <i className="fas fa-trash">
                        </i>
                  Delete
                </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* /.card-body */}
          </div>
          {/* /.card */}
        </section>
        {/* /.content */}
      </div>
      <Footer />
    </div>
  );
}

export default AddEmployee;
