import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Menu from './admin/Menu';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';
import axios from 'axios';
import Loader from '../components/Loader';
import { errorMessage } from '../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../helpers/sweetAlert';
import { authHeader } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import UserMenu from './UserMenu';

const apiurl = process.env.REACT_APP_URL;

const Profile = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  let employeeId = state.employeeId;
  let role = state.role;
  if (!token) {
    token = sessionStorage.getItem('token');
    employeeId = sessionStorage.getItem('employeeId');
    role = sessionStorage.getItem('role');
    updateContextState();
  }

  const location = useLocation();

  const [data, setData] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/employees/' + employeeId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setData(response.data);
          console.log('fetchData');
        }
        else {
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        showToast('error', errorMessage);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
      });
  };

  return (
    <div>
      <Header />
      { role === 'Admin' ? <Menu /> : <UserMenu /> }
      <Loader loading={loading} />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Profile</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
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
                      <img className="profile-user-img img-fluid img-circle" src={data.profilePicture != '' ? data.profilePicture : data.genderName === 'Female' ? femaleAvatar : maleAvatar} alt="Employee profile picture" />
                    </div>
                    <h3 className="profile-username text-center">{data.firstName + ' ' + data.lastName}</h3>
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
                    <strong><i className="fas fa-envelope mr-1" />Email Address</strong>
                    <p className="text-muted">{data.emailId}</p>
                    <hr />
                    <strong><i className="fas fa-mobile mr-1" />Mobile Number</strong>
                    <p className="text-muted">{data.mobileNumber}</p>
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
                      {/* <li className="nav-item"><a className="nav-link active" href="#update-profile" data-toggle="tab">Update Profile</a></li>
                      <li className="nav-item"><a className="nav-link" href="#update-password" data-toggle="tab">Update Password</a></li>
                      <li className="nav-item"><a className="nav-link" href="#update-profile-picture" data-toggle="tab">Update Profile Picture</a></li> */}
                      {/* <li className="nav-item"><a className="nav-link" href="#settings" data-toggle="tab">Settings</a></li> */}
                      <li className="nav-item">
                        <NavLink exact to="/profile/update" className="nav-link" activeClassName="active">Update Profile</NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink exact to="/profile/update-profile-picture" className="nav-link" activeClassName="active">Update Profile Picture</NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink exact to="/profile/update-password" className="nav-link" activeClassName="active">Update Password</NavLink>
                      </li>
                    </ul>
                  </div>{/* /.card-header */}
                  <div className="card-body">
                    <div className="tab-content">
                      {
                        location.pathname == '/profile/update' ? <UpdateProfile employeeId={employeeId} data={data} token={token} setLoading={setLoading} logout={logout} fetchData={fetchData} /> :
                          location.pathname == '/profile/update-profile-picture' ? <UpdateProfilePicture employeeId={employeeId} data={data} token={token} setLoading={setLoading} logout={logout} fetchData={fetchData} /> :
                            location.pathname == '/profile/update-password' ? <UpdatePassword employeeId={employeeId} token={token} setLoading={setLoading} logout={logout} /> : null
                      }
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
  );
}

export default Profile;

const UpdateProfile = (props) => {
  const [firstName, setFirstName] = useState(props.data.firstName);
  const [lastName, setLastName] = useState(props.data.lastName);
  const [genderId, setGenderId] = useState(props.data.genderId);
  // const [gender, setGender] = useState(props.data.genderName);
  const [emailId, setEmailId] = useState(props.data.emailId);
  const [mobileNumber, setMobileNumber] = useState(props.data.mobileNumber);

  const [genderData, setGenderData] = useState([]);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailIdRef = useRef(null);
  const mobileNumberRef = useRef(null);

  useEffect(() => {
    setFirstName(props.data.firstName);
    setLastName(props.data.lastName);
    setGenderId(props.data.genderId);
    setEmailId(props.data.emailId);
    setMobileNumber(props.data.mobileNumber);
    fetchGenderData();
  }, []);

  const fetchGenderData = () => {
    props.setLoading(true);
    axios.get(apiurl + '/genders')
      .then((response) => {
        props.setLoading(false);
        if (response.status == 200) {
          setGenderData(response.data);
        } else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        props.setLoading(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  const validateInput = () => {
    const char_only_regex = /^[a-zA-Z_()// -]*$/;
    const num_only_regex = /^[0-9]*$/;
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let result = true;
    let error = errorMessage;
    if (firstName.length === 0) {
      result = false;
      error = 'Please enter value for Employee First Name.';
      firstNameRef.current.focus();
    }
    else if (!firstName.match(char_only_regex)) {
      result = false;
      error = 'Please enter valid Employee First Name. First Name can only contain characters.';
      firstNameRef.current.focus();
    }
    else if (lastName.length === 0) {
      result = false;
      error = 'Please enter value for Employee Last Name.';
      lastNameRef.current.focus();
    }
    else if (!lastName.match(char_only_regex)) {
      result = false;
      error = 'Please enter valid Employee Last Name. Last Name can only contain characters.';
      lastNameRef.current.focus();
    }
    else if (genderId === 0) {
      result = false;
      error = 'Please select Gender of Employee.';
    }
    else if (emailId.length === 0) {
      result = false;
      error = 'Please enter value for Email Address.';
      emailIdRef.current.focus();
    }
    else if (!emailId.match(email_regex) || !emailId.includes("@bbd.co.za")) {
      result = false;
      error = 'Please enter valid Email Address of BBD Domain only.';
      emailIdRef.current.focus();
    }
    else if (mobileNumber.length === 0) {
      result = false;
      error = 'Please enter value for Mobile Number.';
      mobileNumberRef.current.focus();
    }
    else if (!mobileNumber.match(num_only_regex) || mobileNumber.length !== 10) {
      result = false;
      error = 'Please enter valid Mobile Number. Mobile number can only contain numbers and must be of 10 digits.';
      mobileNumberRef.current.focus();
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const updateEmployee = () => {
    if (validateInput()) {
      props.setLoading(true);
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('genderId', genderId);
      formData.append('emailId', emailId);
      formData.append('mobileNumber', mobileNumber);
      // formData.append('profilePicture', null);
      // console.log(url);
      axios.put(apiurl + '/employees/' + props.employeeId, formData, { headers: authHeader(props.token) })
        .then((response) => {
          props.setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Profile updated successfully.');
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Profile. Please try again...');
          }
          props.fetchData();
        })
        .catch((error) => {
          props.setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Profile. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            props.logout();
          }
        });
    }
  };

  return (
    <div className="active tab-pane" id="update-profile">
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
                    <input type="text" maxLength="50" ref={firstNameRef} className="form-control" placeholder="Employee First Name" value={firstName ? firstName : props.data.firstName} onChange={(e) => setFirstName(e.target.value)} />
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
                    <input type="text" maxLength="50" ref={lastNameRef} className="form-control" placeholder="Employee Last Name" value={lastName ? lastName : props.data.lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="row">
                  <h6>Gender:</h6>
                  {
                    genderData.map((item) => (
                      <div className="col-sm-2" key={item.genderId}>
                        <div className="form-group" title={item.name}>
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                {item.name == "Female" ? <i className="fas fa-female" /> : <i className="fas fa-male" />}
                              </span>
                            </div>
                            <input
                              type="radio"
                              className="form-control radio-style"
                              name="gender"
                              value={item.genderName}
                              // defaultChecked={genderId === item.genderId ? true : false}
                              checked={(genderId ? genderId : props.data.genderId) === item.genderId ? true : false}
                              onChange={(e) => setGenderId(item.genderId)}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className="form-group">
                  <h6>Email Address:</h6>
                  <div className="input-group mb-3 ">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-envelope-open-text" />
                      </span>
                    </div>
                    <input type="email" maxLength="50" ref={emailIdRef} className="form-control" placeholder="Email Address" value={emailId ? emailId : props.data.emailId} onChange={(e) => setEmailId(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <h6>Mobile Number:</h6>
                  <div className="input-group mb-3 ">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-mobile" />
                      </span>
                    </div>
                    <input type="number" maxLength="10" ref={mobileNumberRef} className="form-control" placeholder="Employee Mobile Number" value={mobileNumber ? mobileNumber : props.data.mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                  </div>
                </div>
              </div>
              {/* /.card-body */}
            </div>
            {/* /.card */}
          </div>
        </div>
        <div className="row">
          {/* <a href="#" className="btn btn-primary float-right">Register</a> */}
          <div className="card-footer">
            <button type="button" className="btn btn-primary float-right" onClick={updateEmployee}>Update</button>
          </div>
        </div>
      </section>
    </div>
  );
};

const UpdateProfilePicture = (props) => {
  const [gender, setGender] = useState(props.data.genderName);
  const [profilePicture, setProfilePicture] = useState(props.data.profilePicture);  // Image Path
  const [base64Image, setBase64Image] = useState('');  // Image in Base64 format
  const [profileImage, setProfileImage] = useState({});  // File object
  const [isProfilePictureChanged, setIsProfilePictureChanged] = useState(false);

  useEffect(() => {
    setGender(props.data.genderName);
    setProfilePicture(props.data.profilePicture);
  }, []);

  const onProfileSelected = (e) => {
    setProfilePicture(e.target.value);
    setIsProfilePictureChanged(true);
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      let result = true;
      let error = errorMessage;
      // Validate file
      if (file.size > 1048576) {
        // Don't allow if greater than 1 MB
        result = false;
        error = 'Please select image with size less than 1 MB.';
      }
      else if (file.type != 'image/jpeg' && file.type != 'image/png') {
        result = false;
        error = 'Please select valid Image. Only JPG and PNG images are allowed.';
      }
      // Display Error if validation failed
      if (result === false) {
        showToast('warning', error);
      }
      else {
        // Display image if validation successful
        var reader = new FileReader();
        reader.onload = (rawFile) => {
          if (rawFile.target.readyState === 2) {
            setBase64Image(rawFile.target.result);
          }
        }
        reader.readAsDataURL(file);
      }
    } else {
      showToast('warning', 'No image selected.');
    }
  }

  const removeProfilePicture = () => {
    setIsProfilePictureChanged(true);
    setProfilePicture('');
    setBase64Image('');
  }

  const updateProfilePicture = () => {
    if (isProfilePictureChanged) {
      props.setLoading(true);
      const formData = new FormData();
      if (profilePicture != '') {
        formData.append('profilePicture', profileImage);
      } else {
        formData.append('profilePicture', null);
      }
      axios.put(apiurl + '/employees/' + props.employeeId + '/update-profile-picture', formData, { headers: { ...authHeader(props.token), 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          props.setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Employee Profile Picture updated successfully.');
            props.fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Employee Profile Picture. Please try again...');
          }
        })
        .catch((error) => {
          props.setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Employee Profile Picture. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            props.logout();
          }
        });
    } else {
      showToast('warning', 'Profile Picture not changed.');
    }
  }

  return (
    <div className="active tab-pane" id="update-profile-picture">
      <div className="form-group">
        <h6>Profile Picture:</h6>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fas fa-images" />
            </span>
          </div>
          <input
            type="file"
            className="form-control"
            id="profile-picture"
            accept=".jpg,.jpeg,.png"
            // value={profilePicture}
            onChange={onProfileSelected}
          />
        </div>
        <div className="col-md-4">
          <img src={base64Image != '' ? base64Image : profilePicture ? profilePicture : props.data.profilePicture != "" ? props.data.profilePicture != "" : gender === 'Female' ? femaleAvatar : maleAvatar}
            className="img-circle elevation-2" width="100" height="100" alt="No image selected" />&nbsp;&nbsp;&nbsp;
          {
            (base64Image != '' || (profilePicture || props.data.profilePicture != '')) &&
            <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Remove Profile Picture" onClick={removeProfilePicture}>
              <i className="fa fa-trash-alt" />
            </button>
          }
        </div>
      </div>
      <div className="row">
        <div className="card-footer">
          <button type="button" className="btn btn-primary float-right" onClick={updateProfilePicture}>Update</button>
        </div>
      </div>
    </div>
  );
};

const UpdatePassword = (props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;

  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  const validateInput = () => {
    const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;
    let result = true;
    let error = errorMessage;
    if (oldPassword.length === 0) {
      result = false;
      error = 'Please enter value for Old Password.';
      oldPasswordRef.current.focus();
    }
    else if (newPassword.length === 0) {
      result = false;
      error = 'Please enter value for New Password.';
      newPasswordRef.current.focus();
    }
    else if (!newPassword.match(password_regex)) {
      result = false;
      error = 'Please enter valid value for New Password. Password must contain at least 1 number, 1 special character and 1 uppercase 1 lowercase letter, and at least 8 or more characters.';
      newPasswordRef.current.focus();
    }
    else if (confirmNewPassword.length === 0) {
      result = false;
      error = 'Please enter value for Confirm New Password.';
      confirmNewPasswordRef.current.focus();
    }
    else if(newPassword !== confirmNewPassword){
      result = false;
      error = 'New Password and Confirm New Password didn\'t match';
      confirmNewPasswordRef.current.focus();
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  }

  const updatePassword = () => {
    if (validateInput()) {
      props.setLoading(true);
      const requestData = {
        employeeId: props.employeeId,
        oldPassword: oldPassword,
        newPassword: newPassword
      };
      axios.put(apiurl + '/employees/update-password', requestData, { headers: authHeader(props.token) })
        .then((response) => {
          props.setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Password updated successfully.');
            props.logout();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Password. Please try again...');
          }
        })
        .catch((error) => {
          props.setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Password. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            props.logout();
          }
        });
    }
  }

  return (
    <div className="active tab-pane" id="update-password">
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
                    <input type="password" maxLength="20" ref={oldPasswordRef} className="form-control" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group mb-3 ">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-lock" />
                      </span>
                    </div>
                    <input type="password" maxLength="20" ref={newPasswordRef} className="form-control" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group mb-3 ">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-lock" />
                      </span>
                    </div>
                    <input type="password" maxLength="20" ref={confirmNewPasswordRef} className="form-control" placeholder="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
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
          <div className="card-footer">
            <button type="button" className="btn btn-primary float-right" onClick={updatePassword}>Update</button>
          </div>
        </div>
      </section>
    </div>
  );
};