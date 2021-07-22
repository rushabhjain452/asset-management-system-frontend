import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';
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
import { getTodayDate, formatDate, convertToDate } from '../../helpers/dateHelper';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

function AssignAsset() {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const [employees, setEmployees] = useState([]);
  const [employeesDisabled, setEmployeesDisabled] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const [employee, setEmployee] = useState(null);
  // const [properties, setProperties] = useState([]);

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);

  const [asset, setAsset] = useState(null);

  const [assetId, setAssetId] = useState(0);
  const [assetType, setAssetType] = useState(null);
  const [assignDate, setAssignDate] = useState(getTodayDate());

  const [btnText, setBtnText] = useState('Assign');

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and 2 = DESC

  const selectRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchEmployees();
    // fetchAssetTypes();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/assets', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setData(response.data);
          setDataCopy(response.data);
          console.log(response.data);
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

  // const fetchAssetTypes = () => {
  //   setLoading(true);
  //   axios.get(apiurl + '/asset-types/status/true', { headers: authHeader(token) })
  //     .then((response) => {
  //       setLoading(false);
  //       if (response.status === 200) {
  //         // Sort Data
  //         const data = response.data;
  //         data.sort((a, b) => {
  //           let val1 = a.assetType.toLowerCase();
  //           let val2 = b.assetType.toLowerCase();
  //           if (val1 < val2) {
  //             return -1;
  //           }
  //           if (val1 > val2) {
  //             return 1;
  //           }
  //           return 0;
  //         });
  //         let newData = data.map((item) => ({ value: item.assetTypeId, label: item.assetType }));
  //         setAssetTypes(newData);
  //       }
  //       else {
  //         showToast('error', errorMessage);
  //       }
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       showToast('error', errorMessage);
  //       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
  //         logout();
  //       }
  //     });
  // };

  const fetchEmployees = () => {
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

  const validateInput = () => {
    let result = true;
    let error = '';
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
      dateRef.current.focus();
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

  const deleteAssignedAsset = (assetId, assetType) => {
    // showConfirmAlert('Delete Confirmation', `Do you really want to delete the Asset with Asset Id '${assetId}' of Asset Type '${assetType}' ?`)
    //   .then((result) => {
    //     if (result.isConfirmed) {
    //       setLoading(true);
    //       axios.delete(apiurl + '/assets/' + assetId, { headers: authHeader(token) })
    //         .then((response) => {
    //           setLoading(false);
    //           if (response.status === 200) {
    //             showSweetAlert('success', 'Success', 'Asset deleted successfully.');
    //             fetchData();
    //           }
    //           else {
    //             showSweetAlert('error', 'Error', 'Failed to delete Asset. Please try again...');
    //           }
    //           setAssetType('');
    //         })
    //         .catch((error) => {
    //           setLoading(false);
    //           showSweetAlert('error', 'Error', 'Failed to delete Asset. Please try again...');
    //           setAssetType('');
    //           if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //             logout();
    //           }
    //         });
    //     }
    //   });
  };

  const displayAssetDetails = (assetId) => {
    setBtnText('Assign');
    setAssetId(assetId);
    let findAsset = data.find((item) => item.assetId === assetId);
    // const findItem = assetTypes.find((item) => item.value === findAsset.assetTypeId);
    console.log(findAsset);
    setAsset(findAsset);
    // setAssetType(findItem);
    // setPurchaseDate(findAsset.purchaseDate);
    // setProperties(findAsset.assetPropertiesList);
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

  const clearControls = () => {
    setAsset(null);
    setEmployee(null);
    setEmployeesDisabled(false);
    setAssignDate(getTodayDate());
    setBtnText('Assign');
  };

  const onCancel = () => {
    clearControls();
  };

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length > 0) {
      let searchData = dataCopy.filter((item) => item.assetId == searchText ||
        item.assetType.toLowerCase().includes(searchText) ||
        item.assetPropertiesList.find(item => item.value.toLowerCase().includes(searchText)) != undefined
      );
      setData(searchData);
    } else {
      setData(dataCopy);
    }
  };

  const sort = (column) => {
    let order = sortOrder;
    if(sortColumn === column){
      order = order * -1;
      setSortOrder(order);
    } else {
      order = 1;
      setSortOrder(1);
    }
    setSortColumn(column);
    switch (column) {
      case 'AssetId':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.assetId - b.assetId) * order);
          return newData;
        });
        break;
      case 'AssetType':
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
      case 'PurchaseDate':
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
      case 'Discarded':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.discarded - b.discarded) * order);
          return newData;
        });
        break;
    }
  }

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
                <h1 className="m-0">Assign Asset</h1>
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
                  <hr/>
                  <div><h5>Properties :</h5></div>
                </div>
                  {
                    asset.assetPropertiesList.map((item) => (
                      <>
                        <div className="col-lg-2 col-md-4 col-sm-6"><label>{item.propertyName} :</label></div>
                        <div className="col-lg-4 col-md-8 col-sm-6">{item.value}</div>
                      </>
                    ))
                  }
                <div className="col-md-12"><hr/></div>
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
              <div className="col-md-3 col-sm-6">
                <div className="form-group" style={{ marginTop: 20 }}>
                  <label htmlFor="purchase-date">Assign Date</label>
                  <input type="date" maxLength="20" ref={dateRef} className="form-control" id="assign-date" placeholder="Purchase Date" value={assignDate} max={getTodayDate()} onChange={(e) => setAssignDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="row">
              {/* {
                properties.length > 0 &&
                properties.map((item) => (
                  <div><b>{item.propertyName} :</b> {item.value}</div>
                ))
              } */}
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={btnText === 'Assign' ? assignAsset : ''}>
              {btnText}
            </button>
          </div>
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">List of Assets</h3>
                <div className="card-tools">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      name="table_search"
                      maxLength="20"
                      className="form-control float-right"
                      placeholder="Search"
                      onChange={onSearchTextChange} />
                    <div className="input-group-append">
                      <span className="input-group-text" id="basic-addon2">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table id="asset-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('AssetId')}>Asset Id <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('AssetType')}>Asset Type <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('PurchaseDate')}>Purchase Date <br /> (dd-mm-yyyy) <i className="fa fa-sort" /></th>
                      <th>Properties</th>
                      <th>Edit</th>
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
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => console.log()}>
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Assign Asset" onClick={() => displayAssetDetails(item.assetId)}>
                              <i className="fa fa-handshake"></i>
                            </button>
                            <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => console.log()}>
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
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
