import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Menu from './admin/Menu';
import UserMenu from './UserMenu';
import axios from 'axios';
import Loader from '../components/Loader';
import { errorMessage } from '../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../helpers/sweetAlert';
import { formatDate, formatTimestamp, convertToDate, convertTimestampToDate, calDateDiff } from '../helpers/dateHelper';
import { authHeader } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const Bids = () => {
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

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  const textboxRef = useRef(null);

  useEffect(() => {
    // console.log('AuctionId in useEffect : ' + auctionId);
    fetchAuctionData();
    // fetchAssetData();
    fetchData();
  }, []);

  const fetchData = () => {
    // setLoading(true);
    // axios.get(apiurl + '/auctions/active-auctions', { headers: authHeader(token) })
    //   .then((response) => {
    //     setLoading(false);
    //     if (response.status === 200) {
    //       // Sort Data
    //       const data = response.data;
    //       data.sort((a, b) => {
    //         let val1 = convertTimestampToDate(a.endDate);
    //         let val2 = convertTimestampToDate(b.endDate);
    //         if (val1 < val2) {
    //           return -1;
    //         }
    //         if (val1 > val2) {
    //           return 1;
    //         }
    //         return 0;
    //       });
    //       setData(data);
    //       setDataCopy(data);
    //     }
    //     else {
    //       showToast('error', errorMessage);
    //     }
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     showToast('error', errorMessage);
    //     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //       logout();
    //     }
    //   });
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
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Bid. Please try again...');
          }
          clearControls();
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

  const deleteBid = (auctionId, assetId, assetType) => {
    // showConfirmAlert('Delete Confirmation', `Do you really want to delete the Auction for Asset Id '${assetId}' of Asset Type '${assetType}' ?`)
    //   .then((result) => {
    //     if (result.isConfirmed) {
    //       setLoading(true);
    //       axios.delete(apiurl + '/auctions/' + auctionId, { headers: authHeader(token) })
    //         .then((response) => {
    //           setLoading(false);
    //           if (response.status === 200) {
    //             showSweetAlert('success', 'Success', 'Auction deleted successfully.');
    //             fetchData();
    //           }
    //           else {
    //             showSweetAlert('error', 'Error', 'Failed to delete Auction. Please try again...');
    //           }
    //           clearControls();
    //         })
    //         .catch((error) => {
    //           setLoading(false);
    //           showSweetAlert('error', 'Error', 'Failed to delete Auction. Please try again...');
    //           clearControls();
    //           if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    //             logout();
    //           }
    //         });
    //     }
    //   });
  };

  const editBid = (auctionId, assetId) => {
    // setBtnText('Update');
    // setSaleDisplay(false);
    // setAuctionId(auctionId);
    // assetId = assetId;
    // setAssetIdState(assetId);
    // fetchAssetDetails(assetId);
    // setMinBidAmountDisabled(false);
    // setStartDateDisabled(false);
    // setEndDateDisabled(false);
    // // Find Auction by Id and set Values
    // let findAuction = data.find((item) => item.auctionId === auctionId);
    // // console.log(findAuction);
    // setMinBidAmount(findAuction.minimumBidAmount);
    // setStartDate(findAuction.startDate.substring(0, 16));
    // setEndDate(findAuction.endDate.substring(0, 16));
    // // if(findAuction.saleDate){
    // //   setSaleDisplay(true);
    // //   setSaleDate(findAuction.saleDate);
    // // }else{
    // //   setSaleDisplay(false);
    // // }
    // try{
    //   minBidAmountRef.current.focus();
    // }
    // catch(err){}
  };

  const updateBid = () => {
    if (validateInput()) {
      // setLoading(true);
      // const requestData = {
      //   assetId: assetIdState,
      //   minimumBidAmount: minBidAmount,
      //   startDate: startDate,
      //   endDate: endDate
      // };
      // axios.put(apiurl + '/auctions/' + auctionId, requestData, { headers: authHeader(token) })
      //   .then((response) => {
      //     setLoading(false);
      //     if (response.status === 200) {
      //       showSweetAlert('success', 'Success', 'Auction updated successfully.');
      //       fetchData();
      //     }
      //     else {
      //       showSweetAlert('error', 'Error', 'Failed to update Auction. Please try again...');
      //     }
      //     clearControls();
      //     setBtnText('Add');
      //   })
      //   .catch((error) => {
      //     setLoading(false);
      //     showSweetAlert('error', 'Error', 'Failed to update Auction. Please try again...');
      //     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      //       logout();
      //     }
      //   });
    }
  };

  const clearControls = () => {
    setBtnText('Add');
    // setBidAmount(0);
    setBidAmount('');
  };

  const onCancel = () => {
    clearControls();
  };

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length > 0) {
      let searchData = dataCopy.filter((item) => item.assetId == searchText ||
        item.assetType.toLowerCase().includes(searchText) ||
        formatDate(item.purchaseDate) === searchText ||
        item.minimumBidAmount == searchText ||
        formatTimestamp(item.startDate).includes(searchText) ||
        formatTimestamp(item.endDate).includes(searchText) ||
        formatTimestamp(item.saleDate).includes(searchText)
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
      case 'minimumBidAmount':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.minimumBidAmount - b.minimumBidAmount) * order);
          return newData;
        });
        break;
      case 'startDate':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = convertTimestampToDate(a.startDate);
            let val2 = convertTimestampToDate(b.startDate);
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
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = convertTimestampToDate(a.endDate);
            let val2 = convertTimestampToDate(b.endDate);
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
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = convertTimestampToDate(a.saleDate);
            let val2 = convertTimestampToDate(b.saleDate);
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
                    <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
                    <button
                      type="button"
                      className="btn btn-primary float-right"
                      onClick={btnText === 'Add' ? addBid : updateBid}>
                      {btnText} Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Bids;
