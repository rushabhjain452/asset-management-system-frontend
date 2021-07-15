import React from 'react'
import Header from '../Header';
import Footer from '../Footer';
import Menu from './Menu';
function AddEmployees() {
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
                <div className="card-header">
                  <h3 className="card-title">Add Employee</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                      <i className="fas fa-minus" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    {/* <input type="text" id="inputName" className="form-control" /> */}
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
              <div class="card-footer">
              <button type="cancel" class="btn btn-secondary float-left">Cancel</button>
                  <button type="submit" class="btn btn-primary float-right">Submit</button>
                </div>
            </div>
        </section>
        {/* /.content */}
      </div>

      <Footer />
    </div>
  )
}

export default AddEmployees
