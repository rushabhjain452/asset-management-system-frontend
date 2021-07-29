import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, Redirect, useParams } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Menu from './admin/Menu';
import UserMenu from './UserMenu';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import { errorMessage } from '../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../helpers/sweetAlert';
import { formatDate, formatTimestamp, getCurrentTimestamp, convertToDate, convertTimestampToDate, calDateDiff } from '../helpers/dateHelper';
import { authHeader } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const Bids = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  let employeeId = parseInt(state.employeeId);
  let role = state.role;
  if (!token) {
    token = sessionStorage.getItem('token');
    employeeId = parseInt(sessionStorage.getItem('employeeId'));
    role = sessionStorage.getItem('role');
    updateContextState();
  }

  const { auctionId } = useParams();
  // console.log('Auction Id : ' + auctionId);

  const [bidId, setBidId] = useState(0);
  const [bidAmount, setBidAmount] = useState('');

  // Bids Data
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);

  const [auctionData, setAuctionData] = useState(null);
  // const [auctionId, setAuctionId] = useState(null);

  const [asset, setAsset] = useState(null);
  // const [assetId, setAssetId] = useState(0);
  const [assetType, setAssetType] = useState('Asset');

  const [btnText, setBtnText] = useState('Add');

  const [saleDisplay, setSaleDisplay] = useState(false);
  const [saleDate, setSaleDate] = useState(getCurrentTimestamp());
  const [saleBid, setSaleBid] = useState(null);
  const [saleStatus, setSaleStatus] = useState(false);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const textboxRef = useRef(null);

  useEffect(() => {
    // console.log('AuctionId in useEffect : ' + auctionId);
    fetchAuctionData();
    // fetchAssetData();
    fetchUserBidData();
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/bids/auction/' + auctionId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => a.bidAmount - b.bidAmount);
          setData(data);
          setDataCopy(data);
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
    axios.get(apiurl + '/auctions/' + auctionId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setAuctionData(response.data);
          setAssetType(response.data.assetType);
          fetchAssetData(response.data.assetId);
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

  const fetchAssetData = (assetId) => {
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
  };

  const fetchUserBidData = () => {
    setLoading(true);
    axios.get(apiurl + '/bids/auction/' + auctionId + '/employee/' + employeeId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setBidId(response.data.bidId);
          setBidAmount(response.data.bidAmount);
          setBtnText('Update');
        }
        else {
          showToast('error', errorMessage);
          setBidAmount('');
          setBtnText('Add');
        }
      })
      .catch((error) => {
        setLoading(false);
        // showToast('error', errorMessage);
        setBidAmount('');
        setBtnText('Add');
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
      error = 'Please select Asset to place your Bid.';
    }
    if (auctionData === null) {
      result = false;
      error = 'Please select Auction to place your Bid.';
    }
    if (bidAmount.length === 0) {
      result = false;
      error = 'Please enter value for Bid Amount.';
      textboxRef.current.focus();
    }
    else if (isNaN(bidAmount)) {
      result = false;
      error = 'Please enter valid Bid Amount. Bid Amount can only contain numbers.';
      textboxRef.current.focus();
    }
    else if(parseInt(bidAmount) < auctionData.minimumBidAmount){
      result = false;
      error = 'Bid Amount cannot be less than Minimum Bid Amount.';
      textboxRef.current.focus();
    }
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addBid = () => {
    if (validateInput()) {
      const requestData = {
        auctionId: auctionData.auctionId,
        employeeId: employeeId,
        bidAmount: parseInt(bidAmount),
      };
      setLoading(true);
      axios.post(apiurl + '/bids', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Bid added successfully.');
            fetchUserBidData();
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Bid. Please try again...');
          }
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Bid. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const deleteBid = (bidId, assetType) => {
    showConfirmAlert('Delete Confirmation', `Do you really want to delete the Bid for Auction of '${assetType}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.delete(apiurl + '/bids/' + bidId, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showSweetAlert('success', 'Success', 'Bid deleted successfully.');
                fetchUserBidData();
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to delete Bid. Please try again...');
              }
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to delete Bid. Please try again...');
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const updateBid = () => {
    if (validateInput()) {
      setLoading(true);
      axios.put(apiurl + '/bids/' + bidId + '/update-bid-amount/' + bidAmount, {}, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Bid updated successfully.');
            fetchUserBidData();
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Bid. Please try again...');
          }
          setBtnText('Add');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Bid. Please try again...');
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const saleAsset = (item) => {
    setSaleBid(item);
    setSaleDisplay(true);
  }

  const cancelSale = () => {
    setSaleBid(null);
    setSaleDisplay(false);
  }

  const saleAssetDetails = () => {
    setLoading(true);
    const requestData = {
      saleBidId: saleBid.bidId,
      saleDate: saleDate
    };
    axios.put(apiurl + '/auctions/' + auctionId + '/update-sale-asset', requestData, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          showSweetAlert('success', 'Success', 'Asset Sale successfully.');
          // fetchUserBidData();
          // fetchData();
          setSaleStatus(true);
        }
        else {
          showSweetAlert('error', 'Error', 'Failed to sale Asset. Please try again...');
        }
        // setBtnText('Add');
      })
      .catch((error) => {
        setLoading(false);
        showSweetAlert('error', 'Error', 'Failed to sale Asset. Please try again...');
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
      });
  };

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length > 0) {
      let searchData = dataCopy.filter((item) => item.employeeId == searchText ||
        item.firstName.toLowerCase().includes(searchText) ||
        item.lastName.toLowerCase().includes(searchText) ||
        item.bidAmount == searchText
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
      case 'bidAmount':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.bidAmount - b.bidAmount) * order);
          return newData;
        });
        break;
    }
  };

  if(saleStatus){
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Header />
      { role === 'Admin' ? <Menu /> : <UserMenu />}
      <Loader loading={loading} />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Bid On {assetType}</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to={role === 'Admin' ? "/admin/dashboard" : "/dashboard"}>Home</NavLink></li>
                  <li className="breadcrumb-item"><NavLink exact to="/auctions">Auctions</NavLink></li>
                  <li className="breadcrumb-item active">Bid On {assetType}</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          {/* Default box */}
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="card-title">Asset Id : {auctionData && auctionData.assetId}</h3>
                </div>
                <div className="col-md-8">
                  {auctionData && <h3 className="card-title">Auction Period : &nbsp;&nbsp; {formatTimestamp(auctionData.startDate)} &nbsp;&nbsp; to &nbsp;&nbsp; {formatTimestamp(auctionData.endDate)}</h3>}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-md-12 col-lg-8 order-2 order-md-1">
                  <div className="row">
                    {
                      asset &&
                      asset.assetPropertiesList.map((item, index) => (
                        <div className="col-md-6 col-sm-12" key={item.assetPropertiesId}>
                          <label>{item.propertyName} :</label> {item.value}
                        </div>
                      ))
                    }
                  </div>
                  {
                    saleDisplay &&
                    <>
                      <hr/>
                      <div className="row">
                        <div className="col-md-12">
                          <h4>Sale Details</h4>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <label>Employee Id : </label>
                        </div>
                        <div className="col-md-10">
                          <div>
                            {saleBid.employeeId}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <label>Name : </label>
                        </div>
                        <div className="col-md-10">
                          <div>
                            {saleBid.firstName} {saleBid.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <label>Sale Date : </label>
                        </div>
                        <div className="col-md-10">
                          <input type="datetime-local" placeholder="Asset Sale Date" max={getCurrentTimestamp()} value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-10 offset-md-2 mt-2">
                          <button type="button" className="btn btn-primary" onClick={saleAssetDetails}>Confirm Sale</button>
                          <button type="button" className="btn btn-secondary" onClick={cancelSale}>Cancel</button>
                        </div>
                      </div>
                    </>
                  }
                </div>
                {/* Right Card */}
                <div className="col-12 col-md-12 col-lg-4 order-1 order-md-2">
                  <h3 className="text-primary"><i className="fas fa-laptop" /> {assetType} {asset && <span style={{fontSize: 20}}>&#40; purchased on {formatDate(asset.purchaseDate)} &#41;</span>}</h3>
                  <br />
                  <div className="col-12 col-sm-12">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text text-center text-muted">Minimum Bid Amount</span>
                        <h3 className="info-box-number text-center text-muted mb-0">{auctionData && auctionData.minimumBidAmount}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <h6>Bid Amount:</h6>
                    <input type="number" ref={textboxRef} maxLength="20" className="form-control" placeholder="Bid Amount" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                  </div>
                  <div className="text-center mt-5 mb-3">
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={btnText === 'Add' ? addBid : updateBid}>
                      {btnText} Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Display Data in Table */}
          <div className="card">
            <div className="card-header">
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
            <div className="card-body p-0">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('employeeId')}>Employee Id <i className="fa fa-sort" /></th>
                    <th>Profile Picture</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('firstName')}>First Name <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('lastName')}>Last Name <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('bidAmount')}>Bid Amount<i className="fa fa-sort" /></th>
                    <th>Delete <br/>My Bid</th>
                    {
                      role === 'Admin' &&
                      <th>Sale</th>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    data.length ==0 &&
                    <td colspan={role === 'Admin' ? 8 : 7}>
                      <h3 className="text-center">No bids placed for this Auction. Be the first once to place bid.</h3>
                    </td>
                  }
                  {
                    data.length > 0 && data.map((item, index) => (
                      <tr key={item.bidId}>
                        <td>{index + 1}</td>
                        <td>{item.employeeId}</td>
                        <td><img src={item.profilePicture != '' ? item.profilePicture : item.gender === 'Female' ? femaleAvatar : maleAvatar} className="img-circle elevation-2" width="100" height="100" /></td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.bidAmount}</td>
                        <td>
                          {
                            item.employeeId === employeeId ?
                              <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete my Bid" onClick={() => deleteBid(item.bidId, item.assetType)}>
                                <i className="fa fa-trash"></i>
                              </button> :
                            <div>-</div>
                          }
                        </td>
                        {
                          role === 'Admin' &&
                          <td>
                            <button className="btn btn-primary btn-sm rounded-0 float-right" type="button" data-toggle="tooltip" data-placement="top" title="Sale Asset" onClick={() => saleAsset(item)}>
                              <i className="fa fa-stamp"></i>
                            </button>
                          </td>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Bids;
