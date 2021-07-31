import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Menu from './Menu';
import axios from 'axios';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const Employee = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [genderData, setGenderData] = useState([]);

  const [employeeId, setEmployeeId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [genderId, setGenderId] = useState(1);
  const [emailId, setEmailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');  // Image Path
  const [base64Image, setBase64Image] = useState('');  // Image in Base64 format
  const [profileImage, setProfileImage] = useState({});  // File object
  const [isProfilePictureChanged, setIsProfilePictureChanged] = useState(false);

  const [employeeIdDisabled, setEmployeeIdDisabled] = useState(false);

  const [btnText, setBtnText] = useState('Add');
  const [searchText, setSearchText] = useState('');
  const [checked, setChecked] = useState(true);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const employeeIdRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailIdRef = useRef(null);
  const mobileNumberRef = useRef(null);

  useEffect(() => {
    fetchGenderData();
    fetchData();
  }, []);

  const fetchGenderData = () => {
    setLoading(true);
    axios.get(apiurl + '/genders')
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          setGenderData(response.data);
        } else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  };

  const getGender = (id) => {
    id = parseInt(id);
    if (genderData.length > 0) {
      const filterData = genderData.filter((item) => item.genderId === id);
      if (filterData.length > 0) {
        return filterData[0].name;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/employees', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => a.employeeId - b.employeeId);
          setDataCopy(data);
          const filterData = data.filter((item) => item.status == checked);
          setData(filterData);
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

  const onProfileSelected = (e) => {
    // console.log('Path : ' + e.target.value);
    setProfilePicture(e.target.value);
    setIsProfilePictureChanged(true);
    // console.log('File : ');
    // console.log(e.target.files);
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      // console.log('File : ' + file);
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
          // console.log(rawFile);
          // console.log(rawFile.target.result);
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

  const validateInput = () => {
    const char_only_regex = /^[a-zA-Z_()// -]*$/;
    const num_only_regex = /^[0-9]*$/;
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let result = true;
    let error = errorMessage;
    if (employeeId.length === 0) {
      result = false;
      error = 'Please enter value for Employee Id.';
      employeeIdRef.current.focus();
    }
    // else if (!employeeId.toString().match(num_only_regex)) {
    else if (isNaN(employeeId)) {
      result = false;
      error = 'Please enter valid Employee Id. Employee Id can only contain numbers.';
      employeeIdRef.current.focus();
    }
    else if (firstName.length === 0) {
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
    else if (btnText === 'Add') {
      // Check if Employee Id already exists
      const findItem = data.find((item) => item.employeeId == parseInt(employeeId));
      if (findItem) {
        result = false;
        error = 'Given Employee Id already exists for another employee.';
        employeeIdRef.current.focus();
      }
      else {
        // Check if email already exists
        const filterData = data.filter((item) => item.emailId.toLowerCase() == emailId.toLowerCase());
        if (filterData.length > 0) {
          result = false;
          error = 'Given Email Id already exists for another employee.';
          emailIdRef.current.focus();
        }
        else {
          // Check if mobile number already exists
          const filterData = data.filter((item) => item.mobileNumber.toLowerCase() == mobileNumber.toLowerCase());
          if (filterData.length > 0) {
            result = false;
            error = 'Given Mobile Number already exists for another employee.';
            mobileNumberRef.current.focus();
          }
        }
      }
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addEmployee = () => {
    if (validateInput()) {
      setLoading(true);
      const formData = new FormData();
      formData.append('employeeId', employeeId);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('genderId', genderId);
      formData.append('emailId', emailId);
      formData.append('mobileNumber', mobileNumber);
      if (profilePicture != '') {
        formData.append('profilePicture', profileImage);
      } else {
        formData.append('profilePicture', null);
      }
      axios.post(apiurl + '/employees/register', formData, { headers: { ...authHeader(token), 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Employee added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Employee. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Employee. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const editEmployee = (id) => {
    const filterData = data.filter((item) => item.employeeId === id);
    if (filterData.length > 0) {
      let obj = filterData[0];
      setBtnText('Update');
      setEmployeeId(obj.employeeId);
      setFirstName(obj.firstName);
      setLastName(obj.lastName);
      setGenderId(obj.genderId);
      // console.log(getGender(obj.genderId));
      setEmailId(obj.emailId);
      setMobileNumber(obj.mobileNumber);
      // setProfilePicture(obj.profilePicture);
      setBase64Image(obj.profilePicture);
      setEmployeeIdDisabled(true);
      firstNameRef.current.focus();
    }
  };

  const updateEmployee = () => {
    if (validateInput()) {
      setLoading(true);
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('genderId', genderId);
      formData.append('emailId', emailId);
      formData.append('mobileNumber', mobileNumber);
      let url = apiurl + '/employees/';
      if (isProfilePictureChanged) {
        url += 'employee-with-profile/' + employeeId;
        if (profilePicture != '') {
          formData.append('profilePicture', profileImage);
        } else {
          formData.append('profilePicture', null);
        }
      } else {
        url += employeeId;
      }
      // console.log(url);
      axios.put(url, formData, { headers: { ...authHeader(token), 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Employee updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Employee. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Employee. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const clearControls = () => {
    setEmployeeId('');
    setFirstName('');
    setLastName('');
    // setGenderId(0);
    setGenderId(1);
    setEmailId('');
    setMobileNumber('');
    setProfilePicture('');
    setBase64Image('');
    setEmployeeIdDisabled(false);
    setIsProfilePictureChanged(false);
    setBtnText('Add');
  };

  const onCancel = () => {
    clearControls();
  };

  const statusChange = (e, employeeId, firstName, lastName) => {
    const status = e.target.checked;
    showConfirmAlert('Status Update', `Do you really want to ${status ? 'activate' : 'deactivate'} employee '${employeeId} - ${firstName} ${lastName}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.put(apiurl + '/employees/' + employeeId + '/update-status/' + status, {}, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showToast('success', 'Status of Employee updated successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to update status of Employee. Please try again...');
                fetchData();
              }
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to update status of Employee. Please try again...');
              fetchData();
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const search = (text, checked) => {
    const searchText = text.toLowerCase();
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => item.status === checked &&
        (item.employeeId == searchText ||
          item.firstName.toLowerCase().includes(searchText) ||
          item.lastName.toLowerCase().includes(searchText) ||
          item.genderName.toLowerCase().startsWith(searchText) ||
          item.emailId.toLowerCase().includes(searchText) ||
          item.mobileNumber.toLowerCase().includes(searchText) ||
          item.roleName.toLowerCase().includes(searchText))
      );
      setData(searchData);
    } else {
      const searchData = dataCopy.filter((item) => item.status == checked);
      setData(searchData);
    }
  }

  const onSearchTextChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    search(text, checked);
  };

  const handleStatusCheck = (e) => {
    // console.log('status changed');
    const checked = e.target.checked;
    setChecked(checked);
    search(searchText, checked);
    // if (checked) {
    //   // Show Active Employees
    // } else {
    //   // Show Inactive employees
    // }
  }

  const sort = (column) => {
    let order = sortOrder;
    if (sortColumn === column) {
      order = order * -1;
      setSortOrder(order);
    } else {
      order = 1;
      setSortOrder(1);
    }
    setSortColumn(column);
    switch (column) {
      case 'employeeId':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.employeeId - b.employeeId) * order);
          return newData;
        });
        break;
      case 'firstName':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.firstName.toLowerCase();
            let val2 = b.firstName.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'lastName':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.lastName.toLowerCase();
            let val2 = b.lastName.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'gender':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.genderName.toLowerCase();
            let val2 = b.genderName.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'emailId':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.emailId.toLowerCase();
            let val2 = b.emailId.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'mobileNumber':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.mobileNumber.toLowerCase();
            let val2 = b.mobileNumber.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'role':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.roleName.toLowerCase();
            let val2 = b.roleName.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'status':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.status - b.status) * order);
          return newData;
        });
        break;
    }
  };

  return (
    <div>
      <Header />
      <Menu />
      <Loader loading={loading} />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>{btnText} Employee</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
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
                <div className="card-body">
                  <div className="form-group">
                    {/* <input type="text" id="inputName" className="form-control" /> */}
                    <label htmlFor="employeeId">Employee Id</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-id-badge" />
                        </span>
                      </div>
                      <input type="number" maxLength="10" ref={employeeIdRef} id="employeeId" className="form-control" placeholder="Employee Id" disabled={employeeIdDisabled} value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-user-circle" />
                        </span>
                      </div>
                      <input type="text" maxLength="50" ref={firstNameRef} id="firstName" className="form-control" placeholder="Employee First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-user-circle" />
                        </span>
                      </div>
                      <input type="text" maxLength="50" ref={lastNameRef} id="lastName" className="form-control" placeholder="Employee Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="row">
                    <label>Gender</label>
                    {
                      genderData.map((item) => (
                        <div className="col-sm-1" key={item.genderId}>
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
                                checked={genderId === item.genderId ? true : false}
                                onChange={(e) => setGenderId(item.genderId)}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="form-group">
                    <label htmlFor="emailAddress">Email Address</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-envelope-open-text" />
                        </span>
                      </div>
                      <input type="email" maxLength="50" ref={emailIdRef} id="emailAddress" className="form-control" placeholder="Email Address" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="fas fa-mobile" />
                        </span>
                      </div>
                      <input type="number" maxLength="10" ref={mobileNumberRef} id="mobileNumber" className="form-control" placeholder="Employee Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group">
                        <label htmlFor="profile-picture">Profile Picture</label>
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
                            value={profilePicture}
                            onChange={onProfileSelected}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <img src={base64Image != '' ? base64Image : getGender(genderId) === 'Female' ? femaleAvatar : maleAvatar}
                        className="img-circle elevation-2" width="80" height="80" alt="No image selected" />&nbsp;&nbsp;&nbsp;
                      {
                        base64Image != '' &&
                        <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Remove Profile Picture" onClick={removeProfilePicture}>
                          <i className="fa fa-trash-alt" />
                        </button>
                      }
                    </div>
                  </div>
                </div>
                {/* /.card-body */}
              </div>
              {/* /.card */}
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={btnText === 'Add' ? addEmployee : updateEmployee}>
              {btnText}
            </button>
          </div>
        </section>
        {/* /.content */}
      </div>
      <div className="content-wrapper">
        {/* Main content */}
        <section className="content">
          {/* Default box */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-bold mt-2">List Of Employees (No of employees : {data.length})</h3>
              <div className="float-right search-width d-flex flex-md-row">
                <div className="form-check mr-4 mt-2">
                  <input type="checkbox" className="form-check-input" id="status-checked" value="Status" checked={checked} onChange={handleStatusCheck} />
                  <label className="form-check-label" htmlFor="status-checked">Active</label>
                </div>
                <div className="input-group">
                  <input
                    type="search"
                    name="table_search"
                    maxLength="20"
                    className="form-control float-right"
                    placeholder="Search"
                    onChange={onSearchTextChange} />
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th title="Sort" className="sort-style" onClick={() => sort('employeeId')}>Employee Id <i className="fa fa-sort" /></th>
                    <th>Profile Picture</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('firstName')}>First Name <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('lastName')}>Last Name <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('gender')}>Gender <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('emailId')}>Email Id <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('mobileNumber')}>Mobile Number <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('role')}>Role <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('status')}>Status <i className="fa fa-sort" /></th>
                    <th>Edit</th>
                    {checked && <th>Assign<br />Asset</th>}
                  </tr>
                </thead>
                <tbody>
                  {
                    data.length > 0 && data.map((item, index) => (
                      <tr key={item.employeeId}>
                        <td>{item.employeeId}</td>
                        <td><img src={item.profilePicture != '' ? item.profilePicture : item.genderName === 'Female' ? femaleAvatar : maleAvatar} className="img-circle elevation-2" width="50" height="50" /></td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.genderName}</td>
                        <td>{item.emailId}</td>
                        <td>{item.mobileNumber}</td>
                        <td>{item.roleName}</td>
                        <td>
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={'status-' + item.employeeId}
                              onChange={(e) => statusChange(e, item.employeeId, item.firstName, item.lastName)}
                              checked={item.status} />
                            <label className="custom-control-label" htmlFor={'status-' + item.employeeId}></label>
                          </div>
                        </td>
                        <td>
                          <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editEmployee(item.employeeId)}>
                            <i className="fa fa-edit"></i>
                          </button>
                        </td>
                        {
                          item.status &&
                          <td>
                            <NavLink className="btn btn-primary btn-sm rounded-0"
                              exact to={{
                                pathname: "/admin/assign-return-asset",
                                state: {
                                  action: 'view',
                                  employeeId: item.employeeId
                                }
                              }} >
                              <i className="fa fa-eye" title="View Assigned Assets"></i>
                            </NavLink>
                            <NavLink className="btn btn-primary btn-sm rounded-0 float-right"
                              exact to={{
                                pathname: "/admin/assign-return-asset",
                                state: {
                                  action: 'assign',
                                  employeeId: item.employeeId
                                }
                              }} >
                              <i className="fa fa-upload" title="Assign Asset"></i>
                            </NavLink>
                          </td>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              {
                data.length > 0 &&
                <div className="d-flex justify-content-center mt-3 mb-3">
                  <button type="button" className="btn btn-primary btn-lg" onClick={() => window.print()}>
                    <i className="fas fa-print"></i>
                    <span> Print</span>
                  </button>
                </div>
              }
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

export default Employee;
