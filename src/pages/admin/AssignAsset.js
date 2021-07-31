import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';
// import 'admin-lte/plugins/select2/css/select2.min.css';
// import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// import 'admin-lte/plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css';
// import 'admin-lte/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css';
// import 'admin-lte/plugins/dropzone/min/dropzone.min.css';
// import 'admin-lte/plugins/select2/js/select2.full.min.js';
// import 'admin-lte/plugins/bootstrap4-duallistbox/jquery.bootstrap-duallistbox.min.js';
import axios from 'axios';
import Select from 'react-select';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { getTodayDate, formatDate, convertToDate, calDateDiff } from '../../helpers/dateHelper';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const AssignAsset = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const location = useLocation();
  // console.log('location :');
  // console.log(location);

  const [employees, setEmployees] = useState([]);
  const [employeesDisabled, setEmployeesDisabled] = useState(false);
  const [employee, setEmployee] = useState(null);
  // const [employeeId, setEmployeeId] = useState(0);

  const [assignDate, setAssignDate] = useState(getTodayDate());
  const [assignDateDisabled, setAssignDateDisabled] = useState(false);

  const [returnDate, setReturnDate] = useState(getTodayDate());
  const [returnDateDisplay, setReturnDateDisplay] = useState(false);

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);

  const [asset, setAsset] = useState(null);
  const [assetId, setAssetId] = useState(0);
  const [assignAssetId, setAssignAssetId] = useState(0);

  const [btnText, setBtnText] = useState('Assign');
  const [searchText, setSearchText] = useState('');
  const [checked, setChecked] = useState(true);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const selectRef = useRef(null);
  const assignDateRef = useRef(null);
  const returnDateRef = useRef(null);

  useEffect(() => {
    fetchData();
    // fetchEmployees();
    // if (location.state) {

    //   if (state.action === 'view') {

    //   }
    //   else if (state.action === 'assign') {

    //   }
    // }
  }, []);

  const fetchData = () => {
    // console.log('fetchData');
    setLoading(true);
    // axios.get(apiurl + '/assets/discarded/false', { headers: authHeader(token) })
    axios.get(apiurl + '/assets/assigned-employee', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          const data = response.data;
          setDataCopy(data);
          // const filterData = data.filter((item) => item.assignDate && item.returnDate === null);
          // setData(filterData);
          fetchEmployees(data);
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

  const fetchEmployees = (assetData) => {
    console.log(assetData);
    setLoading(true);
    axios.get(apiurl + '/employees/status/true', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => a.employeeId - b.employeeId);
          let newData = data.map((item) => ({ value: item.employeeId, label: item.employeeId + ' - ' + item.firstName + ' ' + item.lastName }));
          setEmployees(newData);
          setEmployee(null);
          // Check state if user coming from employee page
          if (location.state) {
            const empId = location.state.employeeId;
            if (location.state.action === 'view') {
              setChecked(true);
              setSearchText(empId.toString());
              // search(empId, true);
              const filterData = assetData.filter((item) => item.assignDate && item.returnDate === null);
              const filterData2 = filterData.filter((item) => item.employeeId === empId);
              setData(filterData2);
            }
            else if (location.state.action === 'assign') {
              setChecked(false);
              // setSearchText('');
              setSearchText(empId.toString());
              // search('', false);
              const filterData = assetData.filter((item) => (item.assignDate && item.returnDate) || (!item.assignDate && !item.returnDate));
              setData(filterData);
              // Set Employee selected in Dropdown
              const findEmployee = newData.find((item) => item.value === empId);
              setEmployee(findEmployee);
            }
          } 
          else {
            const filterData = assetData.filter((item) => item.assignDate && item.returnDate === null);
            setData(filterData);
          }
        }
        else {
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        showToast('error', errorMessage);
        console.log(error);
        console.log(error.response);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
      });
  };

  const validateInput = () => {
    let result = true;
    let error = errorMessage;
    if (asset === null) {
      result = false;
      error = 'Please select Asset to assign.';
      // selectRef.current.focus();
    }
    else if (employee === null) {
      result = false;
      error = 'Please select Employee.';
      selectRef.current.focus();
    }
    else if (assignDate === null) {
      result = false;
      error = 'Please select Assign Date.';
      assignDateRef.current.focus();
    }
    // Validate that Assign Date is greated than Purchase Date
    else if (convertToDate(assignDate) < convertToDate(asset.purchaseDate)) {
      result = false;
      error = 'Please select valid Assign Date. Asset cannot be assigned before its Purchase Date.';
      assignDateRef.current.focus();
    }
    else if (btnText === 'Assign' && asset.returnDate && convertToDate(assignDate) < convertToDate(asset.returnDate)) {
      console.log(convertToDate(assignDate));
      console.log(convertToDate(asset.returnDate));
      console.log(convertToDate(assignDate) < convertToDate(asset.returnDate));
      result = false;
      error = `Please select valid Assign Date. Assign Date cannot be before previous Return Date ${formatDate(asset.returnDate)}.`;
      assignDateRef.current.focus();
    }
    else if (btnText === 'Return' && convertToDate(returnDate) < convertToDate(assignDate)) {
      result = false;
      error = `Please select valid Return Date. Return Date cannot be before Assign Date ${formatDate(assignDate)}.`;
      // returnDateRef.current.focus();
      assignDateRef.current.focus();
    }
    // else if (result == true) {
    //   const mandatoryProperties = properties.filter((item) => item.mandatory === true);
    //   // console.log(mandatoryProperties);
    //   for (const property of mandatoryProperties) {
    //     if (property.value.length === 0) {
    //       result = false;
    //       error = `'${property.propertyName}' property is mandatory. Please enter value for it.`;
    //       // console.log(textboxRefs.current);
    //       // console.log(textboxRefs.current[0]);
    //       // console.log(textboxRefs.current[0].id);
    //       // console.log(textboxRefs.current.length);
    //       // console.log(typeof(textboxRefs.current));
    //       // const findElements = textboxRefs.map((item) => item.id === ('property-' + property.propertyId));
    //       for (const element of textboxRefs.current) {
    //         if (element.id === ('property-' + property.propertyId)) {
    //           element.focus();
    //           break;
    //         }
    //       }
    //       // console.log(findElements);
    //       // textboxRefs.current[0].focus();
    //       break;
    //     }
    //   }
    // }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const deleteAssignAsset = (assignAssetId, assetId, assetType, employeeId, employeeName) => {
    showConfirmAlert('Delete Confirmation', `Do you really want to unassign the Asset Id '${assetId}' of Asset Type '${assetType}' from employee '${employeeId} - ${employeeName}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.delete(apiurl + '/assign-assets/' + assignAssetId, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showSweetAlert('success', 'Success', 'Asset unassigned successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to unassign Asset. Please try again...');
              }
              clearControls();
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to unassign Asset. Please try again...');
              clearControls();
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const editAssignDetails = (assignAssetId, assetId) => {
    setBtnText('Update Assign');
    setEmployeesDisabled(false);
    setAssignDateDisabled(false);
    setReturnDateDisplay(false);
    setAssignAssetId(assignAssetId);
    setAssetId(assetId);
    let findAsset = data.find((item) => item.assignAssetId === assignAssetId);
    setAsset(findAsset);
    // Set Employee
    const findEmployee = employees.find((item) => item.value === findAsset.employeeId);
    setEmployee(findEmployee);
    // Set Assign Date
    setAssignDate(findAsset.assignDate);
    selectRef.current.focus();
  };

  const updateAssignAsset = () => {
    if (validateInput()) {
      const requestData = {
        assetId: assetId,
        employeeId: employee.value,
        assignDate: assignDate
      };
      setLoading(true);
      axios.put(apiurl + '/assign-assets/' + assignAssetId, requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Asset assigned updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update assign Asset. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update assign Asset. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const getAssignDetails = (assetId) => {
    setBtnText('Assign');
    setEmployeesDisabled(false);
    setAssignDateDisabled(false);
    setReturnDateDisplay(false);
    setAssetId(assetId);
    let findAsset = data.find((item) => item.assetId === assetId);
    // const findItem = assetTypes.find((item) => item.value === findAsset.assetTypeId);
    // console.log(findAsset);
    setAsset(findAsset);
    setAssignDate(getTodayDate());
    // setAssetType(findItem);
    selectRef.current.focus();
  };

  const assignAsset = () => {
    if (validateInput()) {
      const requestData = {
        assetId: assetId,
        employeeId: employee.value,
        assignDate: assignDate
      };
      setLoading(true);
      axios.post(apiurl + '/assign-assets', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Asset assigned successfully.');
            // setChecked(true);
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to assign Asset. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to assign Asset. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const getReturnDetails = (assetId) => {
    setBtnText('Return');
    setEmployeesDisabled(true);
    setAssignDateDisabled(true);
    setReturnDateDisplay(true);
    setAssetId(assetId);
    let findAsset = data.find((item) => item.assetId === assetId);
    setAsset(findAsset);
    // Set Employee
    const findEmployee = employees.find((item) => item.value === findAsset.employeeId);
    setEmployee(findEmployee);
    // Set Assign Date
    setAssignDate(findAsset.assignDate);
    setReturnDate(getTodayDate());
    assignDateRef.current.focus();
    // returnDateRef.current.focus();
  };

  const returnAsset = () => {
    if (validateInput()) {
      setLoading(true);
      console.log(asset);
      axios.put(apiurl + '/assign-assets/' + asset.assignAssetId + '/update-return-date/' + returnDate, {}, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Asset returned successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to return Asset. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to return Asset. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const clearControls = () => {
    setAsset(null);
    setEmployee(null);
    setEmployeesDisabled(false);
    setAssignDateDisabled(false);
    setReturnDateDisplay(false);
    setAssignDate(getTodayDate());
    setBtnText('Assign');
  };

  const onCancel = () => {
    clearControls();
  };

  const search = (text, checked) => {
    console.log('dataCopy : ');
    console.log(dataCopy);
    const searchText = text.toLowerCase();
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => {
        if (checked) {
          return item.assignDate && item.returnDate === null;
        } else {
          return (item.assignDate && item.returnDate) || (!item.assignDate && !item.returnDate);
        }
      });
      const searchData2 = searchData.filter((item) => item.assetId == searchText ||
        formatDate(item.purchaseDate) === searchText ||
        item.assetType.toLowerCase().includes(searchText) ||
        item.assetPropertiesList.find(item => item.value.toLowerCase().includes(searchText)) != undefined ||
        item.employeeId == searchText ||
        (item.firstName + ' ' + item.lastName).toLowerCase().includes(searchText)
      );
      setData(searchData2);
    } else {
      const searchData = dataCopy.filter((item) => {
        if (checked) {
          return item.assignDate && item.returnDate === null;
        } else {
          return (item.assignDate && item.returnDate) || (!item.assignDate && !item.returnDate);
        }
      });
      setData(searchData);
    }
  }

  const onSearchTextChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    search(text, checked);
  };

  const handleStatusCheck = (e) => {
    const checked = e.target.checked;
    setChecked(checked);
    search(searchText, checked);
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
      case 'assetId':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.assetId - b.assetId) * order);
          return newData;
        });
        break;
      case 'assetType':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.assetType.toLowerCase();
            let val2 = b.assetType.toLowerCase();
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
      case 'purchaseDate':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = convertToDate(a.purchaseDate);
            let val2 = convertToDate(b.purchaseDate);
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
    }
  };

  return (
    <div className="wrapper">
      <Header />
      <Menu />
      <Loader loading={loading} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Assign / Return Asset</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Assign Asset</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <h4>{btnText} Asset</h4>
            {
              asset &&
              (<div className="row">
                <div className="col-md-12">
                  <div><label>Asset Id :</label> <span>{asset.assetId}</span></div>
                  <div><label>Asset Type :</label> <span>{asset.assetType}</span></div>
                  <div><label>Purchase Date :</label> <span>{formatDate(asset.purchaseDate)}</span></div>
                  <hr />
                  <div><h5>Properties :</h5></div>
                </div>
                {
                  asset.assetPropertiesList.map((item) => (
                    <React.Fragment key={item.assetPropertiesId}>
                      <div className="col-lg-2 col-md-4 col-sm-6"><label>{item.propertyName} :</label></div>
                      <div className="col-lg-4 col-md-8 col-sm-6">{item.value !== '' ? item.value : '-'}</div>
                    </React.Fragment>
                  ))
                }
                <div className="col-md-12"><hr /></div>
              </div>)
            }
            <div className="row">
              <div className="col-md-10">
                <div>
                  <label>Employee</label>
                  <Select
                    value={employee}
                    name="employees"
                    placeholder="Select Employee"
                    onChange={(obj) => setEmployee(obj)}
                    options={employees}
                    ref={selectRef}
                    isDisabled={employeesDisabled}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm-6">
                <div className="form-group" style={{ marginTop: 20 }}>
                  <label htmlFor="assign-date">Assign Date</label>
                  <input type="date" ref={assignDateRef} className="form-control" id="assign-date" placeholder="Purchase Date" disabled={assignDateDisabled} max={getTodayDate()} value={assignDate} onChange={(e) => setAssignDate(e.target.value)} />
                </div>
              </div>
              {
                returnDateDisplay &&
                <div className="col-md-3 col-sm-6">
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label htmlFor="return-date">Return Date</label>
                    <input type="date" ref={returnDateRef} className="form-control" id="return-date" placeholder="Return Date" value={returnDate} max={getTodayDate()} onChange={(e) => setReturnDate(e.target.value)} />
                  </div>
                </div>
              }
              {
                returnDateDisplay &&
                <div className="col-md-6 col-sm-12">
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label>Period</label>
                    <div>{calDateDiff(convertToDate(assignDate), convertToDate(returnDate))}</div>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={btnText === 'Assign' ? assignAsset : btnText === 'Return' ? returnAsset : updateAssignAsset}>
              {btnText}
            </button>
          </div>
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-bold mt-2">List of Assign/Return Assets (No of Assets : {data.length})</h3>
                <div className="float-right search-width d-flex flex-md-row">
                  <div className="form-check mr-4 mt-2">
                    <input type="checkbox" className="form-check-input" id="status-checked" value="Status" checked={checked} onChange={handleStatusCheck} />
                    <label className="form-check-label" htmlFor="status-checked">Assigned</label>
                  </div>
                  <div className="input-group">
                    <input
                      type="search"
                      name="table_search"
                      maxLength="20"
                      className="form-control"
                      placeholder="Search"
                      value={searchText}
                      onChange={onSearchTextChange} />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table id="asset-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetId')}>Asset Id <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('purchaseDate')}>Purchase Date <br /> (dd-mm-yyyy) <i className="fa fa-sort" /></th>
                      <th>Properties</th>
                      <th>Assigned Employee</th>
                      { checked && <th>Edit</th> }
                      <th>Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.assetId}>
                          <td>{index + 1}</td>
                          <td>{item.assetId}</td>
                          <td>{item.assetType}</td>
                          <td>{formatDate(item.purchaseDate)}</td>
                          <td>
                            {
                              item.assetPropertiesList.map((property) => (
                                <div key={property.assetPropertiesId}><b>{property.propertyName}</b> : {property.value}</div>
                              ))
                            }
                          </td>
                          <td>
                            {
                              (item.assignDate && item.returnDate === null) ?
                                (<div>
                                  <NavLink exact to={'assign-asset-history/' + item.assetId} className="btn btn-secondary btn-sm rounded-0 float-right">
                                    <i className="fa fa-history" title="Assign Asset History"></i>
                                  </NavLink>
                                  <b>Assigned to</b><br />
                                  <b>Employee Id : </b>{item.employeeId} <br />
                                  {item.firstName} {item.lastName} <br />
                                  on {formatDate(item.assignDate)} <br />
                                  <div className="d-flex justify-content-center">
                                    <img src={item.profilePicture != '' ? item.profilePicture : item.gender === 'Female' ? femaleAvatar : maleAvatar}
                                      className="img-circle elevation-2" width="50" height="50" />
                                  </div>
                                </div>) :
                                (<div>
                                  <b>Not Assigned</b>
                                  {
                                    item.returnDate &&
                                    <div>
                                      <hr />
                                      <NavLink exact to={'assign-asset-history/' + item.assetId} className="btn btn-secondary btn-sm rounded-0 float-right">
                                        <i className="fa fa-history" title="Assign Asset History"></i>
                                      </NavLink>
                                      <b>Previously Assigned to</b><br />
                                      <b>Employee Id : </b>{item.employeeId} <br />
                                      {item.firstName} {item.lastName} <br />
                                      from {formatDate(item.assignDate)} to {formatDate(item.returnDate)} <br />
                                      <div className="d-flex justify-content-center">
                                        <img src={item.profilePicture != '' ? item.profilePicture : item.gender === 'Female' ? femaleAvatar : maleAvatar}
                                          className="img-circle elevation-2" width="50" height="50" />
                                      </div>
                                    </div>
                                  }
                                </div>)
                            }
                          </td>
                          {
                            (item.assignDate && item.returnDate === null) &&
                            <td>
                              <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editAssignDetails(item.assignAssetId, item.assetId)}>
                                <i className="fa fa-edit"></i>
                              </button>
                            </td>
                          }
                          <td>
                            {
                              (item.assignDate && item.returnDate === null) ?
                                (<button className="btn btn-info btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Return Asset" onClick={() => getReturnDetails(item.assetId)}>
                                  <i className="fa fa-download"></i>
                                </button>) :
                                (<button className="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Assign Asset" onClick={() => getAssignDetails(item.assetId)}>
                                  <i className="fa fa-upload"></i>
                                </button>)
                            }
                            {
                              (item.assignDate && item.returnDate === null) &&
                              <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Unassign Asset" onClick={() => deleteAssignAsset(item.assignAssetId, item.assetId, item.assetType, item.employeeId, item.firstName + ' ' + item.lastName)}>
                                <i className="fa fa-trash"></i>
                              </button>
                            }
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                {
                  data.length > 0 &&
                  <div className="d-flex justify-content-center mt-3">
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => window.print()}>
                      <i className="fas fa-print"></i>
                      <span> Print</span>
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AssignAsset;
