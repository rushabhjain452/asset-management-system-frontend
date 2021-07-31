import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Menu from './Menu';
import axios from 'axios';
import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const Properties = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [property, setProperty] = useState('');
  const [mandatory, setMandatory] = useState(false);
  const [propertyId, setPropertyId] = useState(0);

  const [btnText, setBtnText] = useState('Add');
  const [searchText, setSearchText] = useState('');
  const [checked, setChecked] = useState(true);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const textboxRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/properties', { headers: authHeader(token) })
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

  const validateInput = () => {
    const char_only_regex = /^[a-zA-Z_()// -]*$/;
    let result = true;
    let error = errorMessage;
    if (property.length == 0) {
      result = false;
      error = 'Please enter value for Property.';
      textboxRef.current.focus();
    }
    else if (!property.match(char_only_regex)) {
      result = false;
      error = 'Please enter valid Property. Property can only contain characters.';
      textboxRef.current.focus();
    }
    else if (btnText == 'Add') {
      // Check if already exists
      const findItem = data.find((item) => item.propertyName.toLowerCase() == property.toLowerCase());
      if (findItem) {
        result = false;
        error = 'Property already exists with given name.';
        textboxRef.current.focus();
      }
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addProperty = () => {
    if (validateInput()) {
      setLoading(true);
      const requestData = {
        propertyName: property,
        mandatory: mandatory
      };
      axios.post(apiurl + '/properties', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Property added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Property. Please try again...');
          }
          setProperty('');
          setMandatory(false);
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Property. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const editProperty = (id, name, mandatory) => {
    setBtnText('Update');
    setPropertyId(id);
    setProperty(name);
    setMandatory(mandatory);
    textboxRef.current.focus();
  };

  const updateProperty = () => {
    if (validateInput()) {
      setLoading(true);
      const requestData = {
        propertyName: property,
        mandatory: mandatory
      };
      axios.put(apiurl + '/properties/' + propertyId, requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Property updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Property. Please try again...');
          }
          setProperty('');
          setMandatory(false);
          setBtnText('Add');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Property. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const onCancel = () => {
    setProperty('');
    setMandatory(false);
    setBtnText('Add');
  };

  const statusChange = (e, propertyId, propertyName) => {
    const status = e.target.checked;
    showConfirmAlert('Status Update', `Do you really want to ${status ? 'activate' : 'deactivate'} Property '${propertyName}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.put(apiurl + '/properties/' + propertyId + '/update-status/' + status, {}, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showToast('success', 'Status of Property updated successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to update status of Property. Please try again...');
                fetchData();
              }
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to update status of Property. Please try again...');
              fetchData();
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const search = (text, checked) => {
    let searchText = text.toLowerCase();
    if(searchText === 'yes'){
      searchText = 'true';
    }else if(searchText === 'no'){
      searchText = 'false';
    }
    console.log(searchText);
    console.log(dataCopy);
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => item.status === checked &&
        (item.propertyName.toLowerCase().includes(searchText) ||
        item.mandatory.toString() == searchText)
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
      case 'propertyName':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.propertyName.toLowerCase();
            let val2 = b.propertyName.toLowerCase();
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
      case 'mandatory':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.mandatory - b.mandatory) * order);
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
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Properties</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Properties</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <div className="row">
              <label htmlFor="propertyName">{btnText} Property</label>
              <div className="input-group mb-3 ">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <i className="fas fa-info-circle" />
                  </span>
                </div>
                <input type="text" maxLength="100" ref={textboxRef} id="propertyName" className="form-control" placeholder="Property Name" value={property} onChange={(e) => setProperty(e.target.value)} />
              </div>
              <div className="custom-control custom-switch" style={{ marginLeft: 60 }}>
                <input type="checkbox" className="custom-control-input" id="switch-mandatory" checked={mandatory} onChange={(e) => setMandatory(e.target.checked)} />
                <label className="custom-control-label" htmlFor="switch-mandatory">Is Mandatory?</label>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={btnText === 'Add' ? addProperty : updateProperty}>
              {btnText}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-bold mt-2">List of Properties (No of properties : {data.length})</h3>
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
                      className="form-control"
                      placeholder="Search"
                      onChange={onSearchTextChange} />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table id="property-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('propertyName')}>Property Name <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('mandatory')}>Mandatory? <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('status')}>Status <i className="fa fa-sort" /></th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.propertyId}>
                          <td>{index + 1}</td>
                          <td>{item.propertyName}</td>
                          <td>{item.mandatory ? 'Yes' : 'No'}</td>
                          <td>
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'status-' + item.propertyId}
                                onChange={(e) => statusChange(e, item.propertyId, item.propertyName)}
                                checked={item.status} />
                              <label className="custom-control-label" htmlFor={'status-' + item.propertyId}></label>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editProperty(item.propertyId, item.propertyName, item.mandatory)}>
                              <i className="fa fa-edit"></i>
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

export default Properties;
