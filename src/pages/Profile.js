import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Menu from './admin/Menu';
import avatar from 'admin-lte/dist/img/avatar5.png';

function Profile() {
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
                <h1>Profile</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Employee Profile</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                {/* Profile Image */}
                <div className="card card-primary card-outline">
                  <div className="card-body box-profile">
                    <div className="text-center">
                      <img className="profile-user-img img-fluid img-circle" src={avatar} alt="Employee profile picture" />
                    </div>
                    <h3 className="profile-username text-center">Employee name</h3>
                    <ul className="list-group list-group-unbordered mb-3">
                      <li className="list-group-item">
                        <b>Total Assigned Asset</b> <a className="float-right">1,322</a>
                      </li>
                      <li className="list-group-item">
                        <b>Total Asset Win </b> <a className="float-right">543</a>
                      </li>
                    </ul>
                  </div>
                  {/* /.card-body */}
                </div>
                {/* /.card */}
                {/* About Me Box */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">About Me</h3>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <strong><i className="fas fa-envelope mr-1" /> Email Address</strong>
                    <p className="text-muted">
                      xyz@bbd.co.za
              </p>
                    <hr />
                    <strong><i className="fas fa-mobile mr-1" /> Mobile Number</strong>
                    <p className="text-muted">9999999999</p>
                  </div>
                  {/* /.card-body */}
                </div>
                {/* /.card */}
              </div>
              {/* /.col */}
              <div className="col-md-9">
                <div className="card">
                  <div className="card-header p-2">
                    <ul className="nav nav-pills">
                      <li className="nav-item"><a className="nav-link active" href="#update-profile" data-toggle="tab">Update Profile</a></li>
                      <li className="nav-item"><a className="nav-link" href="#update-password" data-toggle="tab">Update Password</a></li>
                      <li className="nav-item"><a className="nav-link" href="#update-profile-picture" data-toggle="tab">Update Profile Picture</a></li>
                      <li className="nav-item"><a className="nav-link" href="#settings" data-toggle="tab">Settings</a></li>
                    </ul>
                  </div>{/* /.card-header */}
                  <div className="card-body">
                    <div className="tab-content">
                      <div class="active tab-pane" id="update-profile">
                        <section className="content">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="card card-primary">
                                <div className="card-body">
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
                                    <div class="col-sm-2">
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
                                    <div class="col-sm-2">
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
                                    <h6>Mobile Number:</h6>
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
            Update
            </button>
                            </div>
                          </div>
                        </section>
                      </div>
                      <div class="active tab-pane" id="update-profile-picture">
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
            Update
            </button>
                            </div>
                          </div>
                      </div>
                      <div class="active tab-pane" id="update-password">
                        <section className="content">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="card card-primary">
                                <div className="card-body">
                                  <div className="form-group">
                                    <div className="input-group mb-3 ">
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">
                                          <i className="fas fa-key" />
                                        </span>
                                      </div>
                                      <input type="password" maxLength="20" className="form-control" placeholder="Old Password" />
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <div className="input-group mb-3 ">
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">
                                          <i className="fas fa-lock" />
                                        </span>
                                      </div>
                                      <input type="password" maxLength="20" className="form-control" placeholder="New Password" />
                                    </div>
                                  </div>
                                  <div className="form-group">
                                    <div className="input-group mb-3 ">
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">
                                          <i className="fas fa-lock" />
                                        </span>
                                      </div>
                                      <input type="password" maxLength="20" className="form-control" placeholder="Confirm Password" />
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
            Update
            </button>
                            </div>
                          </div>
                        </section>
                      </div>
                      <div class="active tab-pane" id="settings">
                        <div className="row">
                          <div class="card-footer">
                            {/* <button type="cancel" class="btn btn-secondary float-left">Cancel</button> */}
                            <span className="nav-link logout-link" title="Logout" >
                              <i className="fas fa-sign-out-alt"></i> Logout
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.tab-pane */}
                </div>
                {/* /.tab-content */}
              </div>{/* /.card-body */}
            </div>
            {/* /.card */}
            {/* /.col */}
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>

      <Footer />
    </div>
  )
}

export default Profile;
