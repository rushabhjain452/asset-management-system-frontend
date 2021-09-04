import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';
import axios from 'axios';
import Select from 'react-select';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { getCurrentTimestamp, formatDate, formatTimestamp, convertToDate, convertTimestampToDate, calDateDiff } from '../../helpers/dateHelper';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

let assetId = 0;

const Auction = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  // let { assetId } = useParams();
  let params = useParams();
  assetId = params.assetId;
  // if (assetId) {
  //   console.log('AssetId found...');
  //   if(assetId != 0){
  //     setBtnText('Add');
  //   }else{
  //     setAsset(null);
  //   }
  // } else {
  //   setAsset(null);
  // }

  const [asset, setAsset] = useState(null);
  const [assetIdState, setAssetIdState] = useState(0);

  const [auctionId, setAuctionId] = useState(0);

  const [minBidAmount, setMinBidAmount] = useState(getCurrentTimestamp());
  const [minBidAmountDisabled, setMinBidAmountDisabled] = useState(false);

  // 2021-07-27T13:21
  const [startDate, setStartDate] = useState(getCurrentTimestamp());
  const [startDateDisabled, setStartDateDisabled] = useState(false);

  const [endDate, setEndDate] = useState(getCurrentTimestamp());
  const [endDateDisabled, setEndDateDisabled] = useState(false);

  const [saleDisplay, setSaleDisplay] = useState(false);

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);

  // Sale Details
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [saleDate, setSaleDate] = useState(getCurrentTimestamp());

  const [btnText, setBtnText] = useState('Add');
  const [searchText, setSearchText] = useState('');
  const [checked, setChecked] = useState(true);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const minBidAmountRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    // console.log('assetId : ' + assetId);
    fetchAssetDetails(assetId);
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/auctions', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => a.assetId - b.assetId);
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

  const fetchAssetDetails = (assetId) => {
    if (assetId) {
      if (assetId != 0) {
        setLoading(true);
        axios.get(apiurl + '/assets/' + assetId, { headers: authHeader(token) })
          .then((response) => {
            setLoading(false);
            if (response.status === 200) {
              setAsset(response.data);
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
      } else {
        setAsset(null);
      }
    } else {
      setAsset(null);
    }
  };

  // const fetchEmployees = () => {
  //   setLoading(true);
  //   axios.get(apiurl + '/employees/status/true', { headers: authHeader(token) })
  //     .then((response) => {
  //       setLoading(false);
  //       if (response.status === 200) {
  //         // Sort Data
  //         const data = response.data;
  //         data.sort((a, b) => a.employeeId - b.employeeId);
  //         const newData = data.map((item) => ({ value: item.employeeId, label: item.employeeId + ' - ' + item.firstName + ' ' + item.lastName }));
  //         setEmployees(newData);
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

  const validateInput = () => {
    let result = true;
    let error = errorMessage;
    if (asset === null) {
      result = false;
      error = 'Please select Asset to put in Auction.';
    }
    if (minBidAmount.length === 0) {
      result = false;
      error = 'Please enter value for Minimum Bid Amount.';
      minBidAmountRef.current.focus();
    }
    else if (isNaN(minBidAmount)) {
      result = false;
      error = 'Please enter valid Minimmum Bid Amount. Minimum Bid Amount can only contain numbers.';
      minBidAmountRef.current.focus();
    }
    else if (startDate === null) {
      result = false;
      error = 'Please select Start Date.';
      startDateRef.current.focus();
    }
    else if (endDate === null) {
      result = false;
      error = 'Please select End Date.';
      endDateRef.current.focus();
    }
    // Validate that Start Date is greated than Purchase Date
    else if (convertToDate(startDate) < convertToDate(asset.purchaseDate)) {
      result = false;
      error = 'Please select valid Start Date. Auction cannot be started before Purchase Date of Asset.';
      startDateRef.current.focus();
    }
    // Validate that Start Date is less than End Date
    else if (convertTimestampToDate(endDate) < convertTimestampToDate(startDate)) {
      result = false;
      error = 'Please select valid Start Date and End Date. End Date cannot be before Start Date.';
      startDateRef.current.focus();
    }
    // Validate if given Asset Id is already in Auction Data
    else if (btnText == 'Add') {
      // Check if already exists
      const findItem = data.find((item) => item.assetId == assetId);
      if (findItem) {
        result = false;
        error = 'Auction already exists for AssetId : ' + assetId + '.';
        startDateRef.current.focus();
      }
    }
    // else if(btnText === 'Add' && asset.returnDate && convertToDate(assignDate) < convertToDate(asset.returnDate)) {
    //   console.log(convertToDate(assignDate));
    //   console.log(convertToDate(asset.returnDate));
    //   console.log(convertToDate(assignDate) < convertToDate(asset.returnDate));
    //   result = false;
    //   error = `Please select valid Assign Date. Assign Date cannot be before previous Return Date ${formatDate(asset.returnDate)}.`;
    //   assignDateRef.current.focus();
    // }
    // else if (btnText === 'Update' && convertToDate(returnDate) < convertToDate(assignDate)) {
    //   result = false;
    //   error = `Please select valid Return Date. Return Date cannot be before Assign Date ${formatDate(assignDate)}.`;
    //   // returnDateRef.current.focus();
    //   assignDateRef.current.focus();
    // }
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addAuction = () => {
    if (validateInput()) {
      const requestData = {
        assetId: assetId,
        minimumBidAmount: parseInt(minBidAmount),
        startDate: startDate,
        endDate: endDate
      };
      setLoading(true);
      axios.post(apiurl + '/auctions', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Auction added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Auction. Please try again...');
          }
          clearControls();
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Auction. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  // const deleteAuction = (auctionId, assetId, assetType) => {
  //   showConfirmAlert('Delete Confirmation', `Do you really want to delete the Auction for Asset Id '${assetId}' of Asset Type '${assetType}' ?`)
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         setLoading(true);
  //         axios.delete(apiurl + '/auctions/' + auctionId, { headers: authHeader(token) })
  //           .then((response) => {
  //             setLoading(false);
  //             if (response.status === 200) {
  //               showSweetAlert('success', 'Success', 'Auction deleted successfully.');
  //               fetchData();
  //             }
  //             else {
  //               showSweetAlert('error', 'Error', 'Failed to delete Auction. Please try again...');
  //             }
  //             clearControls();
  //           })
  //           .catch((error) => {
  //             setLoading(false);
  //             showSweetAlert('error', 'Error', 'Failed to delete Auction. Please try again...');
  //             clearControls();
  //             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
  //               logout();
  //             }
  //           });
  //       }
  //     });
  // };

  const editAuction = (auctionId, assetId) => {
    setBtnText('Update');
    setSaleDisplay(false);
    setAuctionId(auctionId);
    assetId = assetId;
    setAssetIdState(assetId);
    fetchAssetDetails(assetId);
    setMinBidAmountDisabled(false);
    setStartDateDisabled(false);
    setEndDateDisabled(false);
    // Find Auction by Id and set Values
    const findAuction = data.find((item) => item.auctionId === auctionId);
    // console.log(findAuction);
    setMinBidAmount(findAuction.minimumBidAmount);
    setStartDate(findAuction.startDate.substring(0, 16));
    setEndDate(findAuction.endDate.substring(0, 16));
    // if(findAuction.saleDate){
    //   setSaleDisplay(true);
    //   setSaleDate(findAuction.saleDate);
    // }else{
    //   setSaleDisplay(false);
    // }
    try {
      minBidAmountRef.current.focus();
    }
    catch (err) { }
  };

  const updateAuction = () => {
    if (validateInput()) {
      setLoading(true);
      const requestData = {
        assetId: assetIdState,
        minimumBidAmount: minBidAmount,
        startDate: startDate,
        endDate: endDate
      };
      axios.put(apiurl + '/auctions/' + auctionId, requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Auction updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Auction. Please try again...');
          }
          clearControls();
          setBtnText('Add');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Auction. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const clearControls = () => {
    setAsset(null);
    setSaleDisplay(false);
    setMinBidAmountDisabled(false);
    setStartDateDisabled(false);
    setEndDateDisabled(false);
    // setEmployee(null);
    // setEmployeesDisabled(false);
    // setStartDateDisabled(false);
    // setEndDateDisabled(false);
    // setStartDate(getTodayDate());
    // setBtnText('Add');
  };

  const onCancel = () => {
    clearControls();
  };

  const statusChange = (e, auctionId, assetId, assetType) => {
    const status = e.target.checked;
    showConfirmAlert('Status Update', `Do you really want to ${status ? 'activate' : 'deactivate'} the Auction for Asset Id '${assetId}' of Asset Type '${assetType} ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.put(apiurl + '/auctions/' + auctionId + '/update-status/' + status, {}, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showToast('success', 'Status of Auction updated successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to update status of Auction. Please try again...');
                fetchData();
              }
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to update status of Auction. Please try again...');
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
        (item.assetId == searchText ||
        item.assetType.toLowerCase().includes(searchText) ||
        formatDate(item.purchaseDate) === searchText ||
        item.minimumBidAmount == searchText ||
        formatTimestamp(item.startDate).includes(searchText) ||
        formatTimestamp(item.endDate).includes(searchText) ||
        formatTimestamp(item.saleDate).includes(searchText))
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
      case 'assetId':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.assetId - b.assetId) * order);
          return newData;
        });
        break;
      case 'assetType':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = a.assetType.toLowerCase();
            const val2 = b.assetType.toLowerCase();
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
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = convertToDate(a.purchaseDate);
            const val2 = convertToDate(b.purchaseDate);
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
      case 'minimumBidAmount':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.minimumBidAmount - b.minimumBidAmount) * order);
          return newData;
        });
        break;
      case 'startDate':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = convertTimestampToDate(a.startDate);
            const val2 = convertTimestampToDate(b.startDate);
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
      case 'endDate':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = convertTimestampToDate(a.endDate);
            const val2 = convertTimestampToDate(b.endDate);
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
      case 'saleDate':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = convertTimestampToDate(a.saleDate);
            const val2 = convertTimestampToDate(b.saleDate);
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
          const newData = [...oldData];
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
                <h1 className="m-0">Auction</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Auction</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <h4>{btnText} Auction</h4>
            {
              asset ?
                (
                  <div>
                    <div className="row">
                      <div className="col-md-12">
                        <div><label>Asset Id :</label> <span>{assetId}</span></div>
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
                    </div>
                    <div className="row">
                      <div className="col-md-10">
                        <div className="form-group">
                          <label>Minimum Bid Amount</label>
                          <input type="number" ref={minBidAmountRef} className="form-control" maxLength="20" placeholder="Minimum Bid Amount" disabled={minBidAmountDisabled} value={minBidAmount} onChange={(e) => setMinBidAmount(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Auction Start Date</label>
                          <input type="datetime-local" ref={startDateRef} className="form-control" placeholder="Bid Start Date" disabled={startDateDisabled} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Auction End Date</label>
                          <input type="datetime-local" ref={endDateRef} className="form-control" placeholder="Bid End Date" disabled={endDateDisabled} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group" style={{ marginTop: 20 }}>
                          <label>Period</label>
                          <div>{calDateDiff(convertToDate(startDate), convertToDate(endDate))}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) :
                (
                  <div className="row">
                    <div className="col-md-5">
                      <NavLink exact to="/admin/assets" className="btn btn-secondary btn-sm rounded-0">
                        Select Asset for Auction
                      </NavLink>
                    </div>
                  </div>
                )
            }
            {
              saleDisplay &&
              <div>
                <div className="row">
                  <div className="col-md-12">
                    <h4>Sale Details</h4>
                  </div>
                </div>
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
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-5">
                    <div className="form-group">
                      <label>Sale Date</label>
                      <input type="datetime-local" className="form-control" placeholder="Asset Sale Date" max={getCurrentTimestamp()} value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
          {
            asset &&
            <div className="card-footer">
              <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
              <button
                type="button"
                className="btn btn-primary float-right"
                onClick={btnText === 'Add' ? addAuction : updateAuction}>
                {btnText}
              </button>
            </div>
          }
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-bold mt-2">List of Auctions (No of Auctions : {data.length})</h3>
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
                <table id="example1" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetId')}>Asset Id <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('purchaseDate')}>Purchase Date <br /> (dd-mm-yyyy) <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('minimumBidAmount')}>Minimum <br />Bid Amount <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('startDate')}>Auction <br />Start Date <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('endDate')}>Auction <br />End Date <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('saleDate')}>Sale Date <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('status')}>Status <i className="fa fa-sort" /></th>
                      <th>Edit</th>
                      <th>View Bids</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.auctionId}>
                          <td>{index + 1}</td>
                          <td>{item.assetId}</td>
                          <td>{item.assetType}</td>
                          <td>{formatDate(item.purchaseDate)}</td>
                          <td>{item.minimumBidAmount}</td>
                          <td>{formatTimestamp(item.startDate)}</td>
                          <td>{formatTimestamp(item.endDate)}</td>
                          <td>
                            {
                              item.saleDate ?
                                formatTimestamp(item.saleDate) :
                                <div>
                                  <b>Not sold</b>
                                  {
                                    item.status &&
                                    <NavLink exact to={'/admin/view-bids/' + item.auctionId} className="btn btn-primary btn-sm rounded-0 float-right">
                                      <i className="fa fa-stamp" title="Sale Asset"></i>
                                    </NavLink>
                                  }
                                  {/* <button className="btn btn-primary btn-sm rounded-0 float-right" type="button" data-toggle="tooltip" data-placement="top" title="Sale Asset" onClick={() => console.log(item.auctionId)}>
                                  <i className="fa fa-stamp"></i>
                                </button> */}
                                </div>
                            }
                          </td>
                          <td>
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={'status-' + item.auctionId}
                                onChange={(e) => statusChange(e, item.auctionId, item.assetId, item.assetType)}
                                checked={item.status} />
                              <label className="custom-control-label" htmlFor={'status-' + item.auctionId}></label>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editAuction(item.auctionId, item.assetId)}>
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>
                          <th>
                            <NavLink exact to={'/admin/view-bids/' + item.auctionId} className="btn btn-primary btn-sm rounded-0">
                              <i className="fa fa-arrow-circle-right" title="Go to Bids Page"></i>
                            </NavLink>
                          </th>
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

export default Auction;
