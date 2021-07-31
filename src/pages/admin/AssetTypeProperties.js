import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';
import 'admin-lte/plugins/select2/css/select2.min.css';
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
import 'admin-lte/plugins/bootstrap4-duallistbox/bootstrap-duallistbox.min.css';
import 'admin-lte/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css';
import 'admin-lte/plugins/dropzone/min/dropzone.min.css';
import 'admin-lte/plugins/select2/js/select2.full.min.js';
import 'admin-lte/plugins/bootstrap4-duallistbox/jquery.bootstrap-duallistbox.min.js';
import axios from 'axios';
import Select from 'react-select';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const AssetProperties = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const [assetTypes, setAssetTypes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);

  const [assetType, setAssetType] = useState(null);

  const [btnText, setBtnText] = useState('Add');

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const selectRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchAssetTypes();
    fetchProperties();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/asset-type-properties', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setData(response.data);
          setDataCopy(response.data);
          // console.log(response.data);
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

  const fetchAssetTypes = () => {
    setLoading(true);
    axios.get(apiurl + '/asset-types/status/true', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => {
            let val1 = a.assetType.toLowerCase();
            let val2 = b.assetType.toLowerCase();
            if (val1 < val2) {
              return -1;
            }
            if (val1 > val2) {
              return 1;
            }
            return 0;
          });
          let newData = data.map((item) => ({ value: item.assetTypeId, label: item.assetType }));
          setAssetTypes(newData);
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

  const fetchProperties = () => {
    setLoading(true);
    axios.get(apiurl + '/properties/status/true', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => {
            let val1 = a.propertyName.toLowerCase();
            let val2 = b.propertyName.toLowerCase();
            if (val1 < val2) {
              return -1;
            }
            if (val1 > val2) {
              return 1;
            }
            return 0;
          });
          setProperties(data);
          data.forEach((item) => item.checked = false);
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

  const handleChecked = (e) => {
    const propertyId = e.target.value;
    const checked = e.target.checked;
    setProperties((data) => {
      const newData = [...data];
      const property = newData.find(item => item.propertyId == propertyId);
      // console.log(property);
      property.checked = checked;
      // console.log(newData);
      return newData;
    });
  }

  const validateInput = (propertyIds) => {
    let result = true;
    let error = errorMessage;
    if (assetType == null) {
      result = false;
      error = 'Please select Asset Type.';
      selectRef.current.focus();
    }
    else if (propertyIds.length < 1) {
      result = false;
      error = 'Please select at least one property.';
    }
    else if (btnText == 'Add') {
      const findItem = data.find((item) => item.assetTypeId == assetType.value);
      if (findItem) {
        result = false;
        error = 'Properties already exists for selected Asset Type.';
        selectRef.current.focus();
      }
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addAssetTypeProperties = () => {
    let propertyIds = [];
    properties.forEach((item) => item.checked ? propertyIds.push({ propertyId: item.propertyId }) : '');
    // console.log(assetType);
    if (validateInput(propertyIds)) {
      setLoading(true);
      const requestData = {
        assetTypeId: assetType.value,
        propertyList: propertyIds
      };
      axios.post(apiurl + '/asset-type-properties', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Asset Type Properties added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Asset Type Properties. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Asset Type Properties. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const deleteAssetTypeProperties = (id, name) => {
    showConfirmAlert('Delete Confirmation', `Do you really want to delete the properties of Asset Type '${name}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.delete(apiurl + '/asset-type-properties/' + id, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showSweetAlert('success', 'Success', 'Properties of Asset Type deleted successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to delete Properties of Asset Type. Please try again...');
              }
              setAssetType('');
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to delete Properties of Asset Type. Please try again...');
              setAssetType('');
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const editAssetTypeProperties = (id, name) => {
    setBtnText('Update');
    // findItem : {value: 1, label: "Laptop"}
    const findItem = assetTypes.find((item) => item.value === id);
    setAssetType(findItem);
    let obj = data.find((item) => item.assetTypeId === id);
    let propertyIds = obj.propertyList.map((item) => item.propertyId);
    setProperties(prevProperties => {
      let newProperties = [...prevProperties];
      newProperties.forEach((item) => {
        if (propertyIds.includes(item.propertyId))
          item.checked = true;
        else
          item.checked = false;
      });
      return newProperties;
    });
    selectRef.current.focus();
  };

  const updateAssetTypeProperties = () => {
    let propertyIds = [];
    properties.forEach((item) => item.checked ? propertyIds.push({ propertyId: item.propertyId }) : '');
    if (validateInput(propertyIds)) {
      setLoading(true);
      const requestData = {
        propertyList: propertyIds
      };
      axios.put(apiurl + '/asset-type-properties/' + assetType.value, requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Asset Type Properties updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Asset Type Properties. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Asset Type Properties. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const clearControls = () => {
    setAssetType(null);
    setProperties((data) => {
      const newData = [...data];
      newData.forEach((item) => item.checked = false);
      return newData;
    });
    setBtnText('Add');
  };

  const onCancel = () => {
    clearControls();
  };

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => item.assetType.toLowerCase().includes(searchText) ||
        item.propertyList.find(item => item.propertyName.toLowerCase().includes(searchText)) != undefined
      );
      setData(searchData);
    } else {
      setData(dataCopy);
    }
  };

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
    }
  };

  return (
    <div>
      <Header />
      <Menu />
      <Loader loading={loading} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Asset Type Properties</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Asset Type Properties</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <h4>{btnText} Asset Type with Properties </h4>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-10">
                  <div>
                    <label>Asset Type</label>
                    <Select
                      value={assetType}
                      name="assetType"
                      placeholder="Select Asset Type"
                      onChange={(obj) => setAssetType(obj)}
                      options={assetTypes}
                      ref={selectRef}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group" style={{ marginTop: 20 }}>
                    <label>Properties</label>
                    <div className="container-fluid">
                      <div className="row">
                        {
                          properties.length > 0 &&
                          properties.map((item) => (
                            <div className="col-lg-3 col-md-4 col-sm-6" key={item.propertyId}>
                              <div className="form-check">
                                <input className="form-check-input" type="checkbox" value={item.propertyId} checked={item.checked} id={'property-' + item.propertyId} onChange={handleChecked} />
                                <label className="form-check-label" htmlFor={'property-' + item.propertyId}>{item.propertyName}</label>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="form-group">
                <h6>Property Value:</h6>
                  <input type="text" maxLength="20" className="form-control" placeholder="Property Value" />
              </div> */}
              <div className="card-footer">
                <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-primary float-right"
                  onClick={btnText === 'Add' ? addAssetTypeProperties : updateAssetTypeProperties}>
                  {btnText}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-bold mt-2">List of Asset with Properties (No of Assets with Properties : {data.length})</h3>
                <div className="float-right search-width d-flex flex-md-row">
                  <div className="input-group">
                    <input
                      type="search"
                      name="table_search"
                      maxLength="20"
                      className="form-control"
                      placeholder="Search"
                      onChange={onSearchTextChange} />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table id="asset-type-properties-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                      <th>Properties</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.assetTypeId}>
                          <td>{index + 1}</td>
                          <td>{item.assetType}</td>
                          <td>
                            <ol>
                              {
                                item.propertyList.map((property) => (
                                  <li key={property.propertyId}>{property.propertyName} ({property.mandatory ? 'Mandatory' : 'Optional'})</li>
                                ))
                              }
                            </ol>
                          </td>
                          <td>
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editAssetTypeProperties(item.assetTypeId)}>
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => deleteAssetTypeProperties(item.assetTypeId, item.assetType)}>
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                {
                  data.length > 0 &&
                  <div className="d-flex justify-content-center mt-4">
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

export default AssetProperties;
