import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Redirect, useParams } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';
import axios from 'axios';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { getCurrentTimestamp, formatDate, formatTimestamp, convertToDate, convertTimestampToDate, calDateDiff } from '../../helpers/dateHelper';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const ViewBids = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
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

  const [saleDate, setSaleDate] = useState(getCurrentTimestamp());
  const [saleBid, setSaleBid] = useState(null);
  const [saleStatus, setSaleStatus] = useState(false);
  const [highestBidId, setHighestBidId] = useState(0);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  useEffect(() => {
    fetchAuctionData();
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
          data.sort((a, b) => b.bidAmount - a.bidAmount);
          setData(data);
          setDataCopy(data);
          // Set Highest bid for sale
          if (data.length > 0) {
            setSaleBid(data[0]);
            setHighestBidId(data[0].bidId);
          } else {
            setSaleBid(null);
            setHighestBidId(0);
          }
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
          console.log(response.data);
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

  const saleAsset = () => {
    showConfirmAlert('Sale Confirmation', `Do you really want to sold to Employee : ${saleBid.employeeId} - ${saleBid.firstName} ${saleBid.lastName} for ${saleBid.bidAmount} ?`)
      .then((result) => {
        if (result.isConfirmed) {
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
                setSaleStatus(true);
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to sale Asset. Please try again...');
              }
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to sale Asset. Please try again...');
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => item.employeeId == searchText ||
        item.firstName.toLowerCase().includes(searchText) ||
        item.lastName.toLowerCase().includes(searchText) ||
        item.bidAmount == searchText ||
        formatTimestamp(item.createdOn).includes(searchText)
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
          const newData = [...oldData];
          newData.sort((a, b) => (a.employeeId - b.employeeId) * order);
          return newData;
        });
        break;
      case 'firstName':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = a.firstName.toLowerCase();
            const val2 = b.firstName.toLowerCase();
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
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = a.lastName.toLowerCase();
            const val2 = b.lastName.toLowerCase();
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
          const newData = [...oldData];
          newData.sort((a, b) => (a.bidAmount - b.bidAmount) * order);
          return newData;
        });
        break;
      case 'createdOn':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = convertTimestampToDate(a.createdOn);
            const val2 = convertTimestampToDate(b.createdOn);
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

  if (saleStatus) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Header />
      <Menu />
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
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
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
                  <h3 className="card-title text-bold mt-2">Asset Id : {auctionData && auctionData.assetId}</h3>
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
                    saleBid &&
                    <>
                      <hr />
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
                        {
                          (auctionData && !auctionData.saleDate) ?
                          <div className="col-md-10">
                            <input type="datetime-local" placeholder="Asset Sale Date" max={getCurrentTimestamp()} value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                          </div>
                          :
                          <div className="col-md-10">
                            {auctionData && formatTimestamp(auctionData.saleDate)}
                          </div>
                        }
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <label>Sale Amount : </label>
                        </div>
                        <div className="col-md-10">
                          <div>
                            {saleBid.bidAmount}
                          </div>
                        </div>
                      </div>
                      {
                        (auctionData && !auctionData.saleDate) &&
                        <div className="row">
                          <div className="col-md-10 offset-md-2 mt-2">
                            <button type="button" className="btn btn-primary" onClick={saleAsset}>Confirm Sale</button>
                          </div>
                        </div>
                      }
                    </>
                  }
                </div>
                {/* Right Card */}
                <div className="col-12 col-md-12 col-lg-4 order-1 order-md-2">
                  <h3 className="text-primary"><i className="fas fa-laptop" /> {assetType} {asset && <span style={{ fontSize: 20 }}>&#40; purchased on {formatDate(asset.purchaseDate)} &#41;</span>}</h3>
                  <br />
                  <div className="col-12 col-sm-12">
                    <div className="info-box bg-light">
                      <div className="info-box-content">
                        <span className="info-box-text text-center text-muted">Minimum Bid Amount</span>
                        <h3 className="info-box-number text-center text-muted mb-0">{auctionData && auctionData.minimumBidAmount}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Display Data in Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-bold mt-2">List of Bids (No of Bids : {data.length})</h3>
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
            <div className="card-body p-0">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('employeeId')}>Employee Id <i className="fa fa-sort" /></th>
                    <th>Profile Picture</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('firstName')}>First Name <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('lastName')}>Last Name <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('bidAmount')}>Bid Amount <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('createdOn')}>Bid Placed at <i className="fa fa-sort" /></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.length == 0 &&
                    <td colspan="8">
                      <h3 className="text-center">No bids placed for this Auction. Be the first once to place bid.</h3>
                    </td>
                  }
                  {
                    data.length > 0 && data.map((item, index) => (
                      <tr key={item.bidId} className={item.bidId === highestBidId ? 'bg-success' : '' }>
                        <td>{index + 1}</td>
                        <td>{item.employeeId}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <img src={item.profilePicture != '' ? item.profilePicture : item.gender === 'Female' ? femaleAvatar : maleAvatar}
                              className="img-circle elevation-2" width="30" height="30" />
                          </div>
                        </td>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.bidAmount}</td>
                        <td>{formatTimestamp(item.createdOn)}</td>
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
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default ViewBids;