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
import { useLastLocation } from 'react-router-last-location';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { getTodayDate, formatDate, convertToDate } from '../../helpers/dateHelper';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const Asset = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const lastLocation = useLastLocation();

  const [assetTypes, setAssetTypes] = useState([]);
  const [assetTypesDisabled, setAssetTypesDisabled] = useState(false);
  const [properties, setProperties] = useState([]);
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);

  const [assetId, setAssetId] = useState(0);
  const [assetType, setAssetType] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(getTodayDate());

  const [auctionAssetIds, setAuctionAssetIds] = useState([]);

  const [btnText, setBtnText] = useState('Add');
  const [searchText, setSearchText] = useState('');
  const [checked, setChecked] = useState(false);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const selectRef = useRef(null);
  const dateRef = useRef(null);
  const textboxRefs = useRef([]);
  textboxRefs.current = [];

  const noOfControlsInRow = 2;
  let controlClassName = 'col-lg-6 col-md-6 col-sm-12';
  if (noOfControlsInRow === 1) {
    controlClassName = 'col-lg-12';
  }

  useEffect(() => {
    // console.log('useEffect : ');
    // console.log(lastLocation);
    // if(lastLocation.pathname.startsWith('/admin/auction/')){
    //   setChecked(true);
    //   search('', true);
    // }
    // setPurchaseDate(getTodayDate());
    fetchData();
    fetchAssetTypes();
    fetchAuctionData();
  }, []);

  const addToRefs = (element) => {
    // console.log(e);
    if (element && !textboxRefs.current.includes(element)) {
      textboxRefs.current.push(element);
    }
    // console.log(textboxRefs.current);
    // console.log(textboxRefs);
  }

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/assets', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          const data = response.data;
          setDataCopy(response.data);
          // Check if user is coming from 'Auction'
          let filterData;
          if (lastLocation.pathname.startsWith('/admin/auction/')) {
            setChecked(true);
            filterData = data.filter((item) => item.discarded == true);
          }else{
            filterData = data.filter((item) => item.discarded == false);
          }
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

  const fetchAuctionData = () => {
    setLoading(true);
    axios.get(apiurl + '/auctions', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          const data = response.data;
          const assetIds = data.map((item) => item.assetId);
          setAuctionAssetIds(assetIds);
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

  const fetchProperties = (assetTypeId) => {
    setLoading(true);
    axios.get(apiurl + '/asset-type-properties/asset-type-id/' + assetTypeId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          const data = response.data.propertyList;
          data.forEach((item) => item.value = '');
          // data.forEach((item) => item.ref = useRef());
          // console.log(data);
          setProperties(data);
        }
        else {
          setProperties([]);
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setProperties([]);
        showToast('error', errorMessage);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
      });
  };

  const handleAssetTypeChange = (obj) => {
    setAssetType(obj);
    fetchProperties(obj.value);
  }

  const setTextboxValue = (value, propertyId) => {
    // console.log(value);
    // console.log(propertyId);
    // let obj = properties.find((item) => item.propertyId === propertyId);
    // obj.value = value;
    // console.log(obj);
    // console.log(properties);
    setProperties(oldProperties => {
      const newProperties = [...oldProperties];
      let obj = newProperties.find((item) => item.propertyId === propertyId);
      obj.value = value;
      return newProperties;
    });
  }

  const validateInput = () => {
    let result = true;
    let error = errorMessage;
    if (assetType == null) {
      result = false;
      error = 'Please select Asset Type.';
      selectRef.current.focus();
    }
    else if (purchaseDate == null) {
      result = false;
      error = 'Please select Purchase Date.';
      dateRef.current.focus();
    }
    else if (result == true) {
      const mandatoryProperties = properties.filter((item) => item.mandatory === true);
      // console.log(mandatoryProperties);
      for (const property of mandatoryProperties) {
        if (property.value.length === 0) {
          result = false;
          error = `'${property.propertyName}' property is mandatory. Please enter value for it.`;
          // console.log(textboxRefs.current);
          // console.log(textboxRefs.current[0]);
          // console.log(textboxRefs.current[0].id);
          // console.log(textboxRefs.current.length);
          // console.log(typeof(textboxRefs.current));
          // const findElements = textboxRefs.map((item) => item.id === ('property-' + property.propertyId));
          for (const element of textboxRefs.current) {
            if (element.id === ('property-' + property.propertyId)) {
              element.focus();
              break;
            }
          }
          // console.log(findElements);
          // textboxRefs.current[0].focus();
          break;
        }
      }
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addAsset = () => {
    if (validateInput()) {
      const newProperties = properties.map((item) => {
        return { propertyId: item.propertyId, value: item.value }
      })
      setLoading(true);
      const requestData = {
        assetTypeId: assetType.value,
        purchaseDate: purchaseDate,
        assetPropertiesList: newProperties
      };
      axios.post(apiurl + '/assets', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Asset added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Asset. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Asset. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  // const deleteAsset = (assetId, assetType) => {
  //   showConfirmAlert('Delete Confirmation', `Do you really want to delete the Asset with Asset Id '${assetId}' of Asset Type '${assetType}' ?`)
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         setLoading(true);
  //         axios.delete(apiurl + '/assets/' + assetId, { headers: authHeader(token) })
  //           .then((response) => {
  //             setLoading(false);
  //             if (response.status === 200) {
  //               showSweetAlert('success', 'Success', 'Asset deleted successfully.');
  //               fetchData();
  //             }
  //             else {
  //               showSweetAlert('error', 'Error', 'Failed to delete Asset. Please try again...');
  //             }
  //             setAssetType('');
  //           })
  //           .catch((error) => {
  //             setLoading(false);
  //             showSweetAlert('error', 'Error', 'Failed to delete Asset. Please try again...');
  //             setAssetType('');
  //             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
  //               logout();
  //             }
  //           });
  //       }
  //     });
  // };

  const editAsset = (assetId) => {
    setBtnText('Update');
    setAssetTypesDisabled(true);
    setAssetId(assetId);
    // console.log(assetId);
    // console.log(properties);
    let findAsset = data.find((item) => item.assetId === assetId);
    // console.log(findAsset);
    const findItem = assetTypes.find((item) => item.value === findAsset.assetTypeId);
    setAssetType(findItem);
    setPurchaseDate(findAsset.purchaseDate);
    setProperties(findAsset.assetPropertiesList);
    // let propertyIds = obj.propertyList.map((item) => item.propertyId);
    // setProperties(prevProperties => {
    //   let newProperties = [...prevProperties];
    //   newProperties.forEach((item) => {
    //     if(propertyIds.includes(item.propertyId))
    //       item.checked = true;
    //     else
    //       item.checked = false;
    //   });
    //   return newProperties;
    // });
    dateRef.current.focus();
  };

  const copyAssetProperties = (assetId) => {
    setBtnText('Add');
    setAssetTypesDisabled(false);
    setAssetId(assetId);
    let findAsset = data.find((item) => item.assetId === assetId);
    const findItem = assetTypes.find((item) => item.value === findAsset.assetTypeId);
    setAssetType(findItem);
    // setPurchaseDate(findAsset.purchaseDate);
    setPurchaseDate(getTodayDate());
    setProperties(findAsset.assetPropertiesList);
    // selectRef.current.focus();
    dateRef.current.focus();
  }

  const updateAsset = () => {
    if (validateInput()) {
      const newProperties = properties.map((item) => {
        return { propertyId: item.propertyId, value: item.value }
      })
      setLoading(true);
      const requestData = {
        assetTypeId: assetType.value,
        purchaseDate: purchaseDate,
        assetPropertiesList: newProperties
      };
      // console.log(assetId);
      // console.log(apiurl + '/assets/' + assetId);
      axios.put(apiurl + '/assets/' + assetId, requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Asset updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Asset. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Asset. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const clearControls = () => {
    // setAssetType(null);
    setAssetTypesDisabled(false);
    setPurchaseDate(getTodayDate());
    // setProperties((data) => {
    //   const newData = [...data];
    //   newData.forEach((item) => item.value = "");
    //   return newData;
    // });
    setProperties([]);
    setBtnText('Add');
  };

  const onCancel = () => {
    clearControls();
  };

  const updateDiscarded = (status, assetId, assetType) => {
    showConfirmAlert('Discard Update Confirmation', `Do you really want to ${status ? 'discard' : 'undiscard'} ${assetType} with Asset Id '${assetId}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.put(apiurl + '/assets/' + assetId + '/update-discarded/' + status, {}, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showToast('success', 'Discarded of Asset updated successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to update Asset of Property. Please try again...');
                fetchData();
              }
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to update Asset of Property. Please try again...');
              fetchData();
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const search = (text, checked) => {
    console.log('search called : ' + checked);
    const searchText = text.toLowerCase();
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => item.discarded === checked &&
        (item.assetId == searchText ||
          formatDate(item.purchaseDate) === searchText ||
          item.assetType.toLowerCase().includes(searchText) ||
          item.assetPropertiesList.find(item => item.value.toLowerCase().includes(searchText)) != undefined)
      );
      setData(searchData);
    } else {
      const searchData = dataCopy.filter((item) => item.discarded == checked);
      console.log(searchData);
      setData(searchData);
    }
  }

  const onSearchTextChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    search(text, checked);
  };

  const handleDiscardCheck = (e) => {
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
      case 'discarded':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.discarded - b.discarded) * order);
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
                <h1 className="m-0">Assets</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Assets</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <label>{btnText} Asset</label>
            <div className="row">
              <div className="col-md-10">
                <div>
                  <label>Asset Type</label>
                  <Select
                    value={assetType}
                    name="assetType"
                    placeholder="Select Asset Type"
                    onChange={handleAssetTypeChange}
                    options={assetTypes}
                    ref={selectRef}
                    isDisabled={assetTypesDisabled}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group" style={{ marginTop: 20 }}>
                  <label htmlFor="purchase-date">Purchase Date</label>
                  <input type="date" maxLength="20" ref={dateRef} className="form-control" id="purchase-date" placeholder="Purchase Date" value={purchaseDate} max={getTodayDate()} onChange={(e) => setPurchaseDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="row">
              {
                properties.length > 0 &&
                properties.map((item) => (
                  <div className={controlClassName}>
                    <div className="form-group">
                      <label htmlFor={'property-' + item.propertyId} className={item.mandatory ? 'required' : ''}>{item.propertyName}</label>
                      <input
                        type="text"
                        maxLength="200"
                        className="form-control"
                        id={'property-' + item.propertyId}
                        placeholder={'Enter ' + item.propertyName}
                        ref={addToRefs}
                        value={item.value}
                        onChange={(e) => setTextboxValue(e.target.value, item.propertyId)} />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={btnText === 'Add' ? addAsset : updateAsset}>
              {btnText}
            </button>
          </div>
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-bold mt-2">List of Assets (No of Assets : {data.length})</h3>
                <div className="float-right search-width d-flex flex-md-row">
                  <div className="form-check mr-4 mt-2">
                    <input type="checkbox" className="form-check-input" id="status-checked" value="Status" checked={checked} onChange={handleDiscardCheck} />
                    <label className="form-check-label" htmlFor="status-checked">Discarded</label>
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
                <table id="asset-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetId')}>Asset Id <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('purchaseDate')}>Purchase Date <br /> (dd-mm-yyyy) <i className="fa fa-sort" /></th>
                      <th>Properties</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('discarded')}>Discarded <i className="fa fa-sort" /></th>
                      {checked && <th>Auction</th>}
                      <th>Edit</th>
                      <th>Duplicate</th>
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
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'status-' + item.assetId}
                                onChange={(e) => updateDiscarded(e.target.checked, item.assetId, item.assetType)}
                                checked={item.discarded} />
                              <label className="custom-control-label" htmlFor={'status-' + item.assetId}></label>
                            </div>
                          </td>
                          {
                            item.discarded && checked &&
                            <td>
                              {
                                auctionAssetIds.includes(item.assetId) ?
                                  <b>Already in <br />Auction</b> :
                                  <NavLink exact to={'auction/' + item.assetId} className="btn btn-primary btn-sm rounded-0">
                                    <i className="fa fa-gavel" title="Put to Auction"></i>
                                  </NavLink>
                              }
                            </td>
                          }
                          <td>
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editAsset(item.assetId)}>
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Copy Properties for another Asset" onClick={() => copyAssetProperties(item.assetId)}>
                              <i className="fa fa-copy"></i>
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

export default Asset;
