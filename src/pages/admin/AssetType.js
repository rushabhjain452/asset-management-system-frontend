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

const AssetType = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [assetType, setAssetType] = useState('');
  const [assetTypeId, setAssetTypeId] = useState(0);

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
    axios.get(apiurl + '/asset-types', { headers: authHeader(token) })
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
    if (assetType.length == 0) {
      result = false;
      error = 'Please enter value for Asset Type.';
      textboxRef.current.focus();
    }
    else if (!assetType.match(char_only_regex)) {
      result = false;
      error = 'Please enter valid Asset Type. Asset Type can only contain characters.';
      textboxRef.current.focus();
    }
    else if (btnText == 'Add') {
      // Check if already exists
      const findItem = data.find((item) => item.assetType.toLowerCase() == assetType.toLowerCase());
      if(findItem){
        result = false;
        error = 'Asset Type already exists with given name.';
        textboxRef.current.focus();
      }
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addAssetType = () => {
    if (validateInput()) {
      setLoading(true);
      const requestData = {
        assetType: assetType
      };
      axios.post(apiurl + '/asset-types', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Asset Type added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Asset Type. Please try again...');
          }
          setAssetType('');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Asset Type. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const editAssetType = (id, name) => {
    setBtnText('Update');
    setAssetTypeId(id);
    setAssetType(name);
    textboxRef.current.focus();
  };

  const updateAssetType = () => {
    if (validateInput()) {
      setLoading(true);
      const requestData = {
        assetType: assetType
      };
      axios.put(apiurl + '/asset-types/' + assetTypeId, requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Asset Type updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Asset Type. Please try again...');
          }
          setAssetType('');
          setBtnText('Add');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Asset Type. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const onCancel = () => {
    setAssetType('');
    setBtnText('Add');
  };

  const statusChange = (e, assetTypeId, assetType) => {
    const status = e.target.checked;
    showConfirmAlert('Status Update', `Do you really want to ${status ? 'activate' : 'deactivate'} Asset Type '${assetType}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.put(apiurl + '/asset-types/' + assetTypeId + '/update-status/' + status, {}, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                // showSweetAlert('success', 'Success', 'Status of Asset Type updated successfully.');
                showToast('success', 'Status of Asset Type updated successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to update status of Asset Type. Please try again...');
                fetchData();
              }
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to update status of Asset Type. Please try again...');
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
        item.assetType.toLowerCase().includes(searchText)
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
    if(sortColumn === column){
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
    <div className="wrapper">
      <Header />
      <Menu />
      <Loader loading={loading} />
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Asset Types</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Asset Type</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <label htmlFor="assetType">{btnText} Asset Type </label>
            <div className="input-group mb-3 ">
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fas fa-headset" /></span>
              </div>
              <input type="text" maxLength="20" ref={textboxRef} id="assetType" className="form-control" placeholder="Asset Type Name" value={assetType} onChange={(e) => setAssetType(e.target.value)} />
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={btnText === 'Add' ? addAssetType : updateAssetType}>
              {btnText}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-bold mt-2">List of Asset Types (No of Asset Types : {data.length})</h3>
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
                <table id="asset-type-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type Name <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('status')}>Status <i className="fa fa-sort" /></th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.assetTypeId}>
                          <td>{index + 1}</td>
                          <td>{item.assetType}</td>
                          <td>
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'status-' + item.assetTypeId}
                                onChange={(e) => statusChange(e, item.assetTypeId, item.assetType)}
                                checked={item.status} />
                              <label className="custom-control-label" htmlFor={'status-' + item.assetTypeId}></label>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editAssetType(item.assetTypeId, item.assetType)}>
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

export default AssetType;
