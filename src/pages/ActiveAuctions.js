import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UserMenu from './UserMenu';
import Menu from './admin/Menu';
import axios from 'axios';

import Loader from '../components/Loader';
import { errorMessage } from '../config';
import { showToast } from '../helpers/sweetAlert';
import { formatDate, formatTimestamp, convertToDate, convertTimestampToDate, calDateDiff } from '../helpers/dateHelper';
import { authHeader } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const ActiveAuctions = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  let role = state.role;
  if (!token) {
    token = sessionStorage.getItem('token');
    role = sessionStorage.getItem('role');
    updateContextState();
  }

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);

  const [loading, setLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState('AssetId');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/auctions/active-auctions', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => {
            const val1 = convertTimestampToDate(a.endDate);
            const val2 = convertTimestampToDate(b.endDate);
            if (val1 < val2) {
              return -1;
            }
            if (val1 > val2) {
              return 1;
            }
            return 0;
          });
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

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => item.assetId == searchText ||
        item.assetType.toLowerCase().includes(searchText) ||
        formatDate(item.purchaseDate) === searchText ||
        item.minimumBidAmount == searchText ||
        formatTimestamp(item.startDate).includes(searchText) ||
        formatTimestamp(item.endDate).includes(searchText)
      );
      setData(searchData);
    } else {
      setData(dataCopy);
    }
  };

  const sort = (column) => {
    const order = sortOrder;
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
    }
  };

  return (
    <div className="wrapper">
      <Header />
      { role === 'Admin' ? <Menu /> : <UserMenu />}
      <Loader loading={loading} />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Auctions</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to={role === 'Admin' ? "/admin/dashboard" : "/dashboard"}>Home</NavLink></li>
                  <li className="breadcrumb-item active">Auctions</li>
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
              <h3 className="card-title text-bold mt-2">List of Active Auctions (No of Active Auctions : {data.length})</h3>
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
                    <th title="Sort" className="sort-style" onClick={() => sort('assetId')}>Asset Id <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('purchaseDate')}>Purchase Date <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('minimumBidAmount')}>Minimum <br />Bid Amount <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('startDate')}>Auction <br />Start Date <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('endDate')}>Auction <br />End Date <i className="fa fa-sort" /></th>
                    <th>Place /<br />View Bids</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.length > 0 && data.map((item, index) => (
                      <tr key={item.auctionId}>
                        <td>{index + 1}</td>
                        <td>{item.assetId}</td>
                        <td>{item.assetType}</td>
                        <td>{formatDate(item.purchaseDate)} <br /> ({calDateDiff(convertToDate(item.purchaseDate), new Date())})</td>
                        <td>{item.minimumBidAmount}</td>
                        <td>{formatTimestamp(item.startDate)}</td>
                        <td>{formatTimestamp(item.endDate)}</td>
                        <th>
                          <NavLink exact to={'/bids/' + item.auctionId} className="btn btn-primary btn-sm rounded-0">
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
                <div className="d-flex justify-content-center mt-3 mb-3">
                  <button type="button" className="btn btn-primary btn-lg" onClick={() => window.print()}>
                    <i className="fas fa-print"></i>
                    <span> Print</span>
                  </button>
                </div>
              }
            </div>
            {/* /.card-body */}
          </div>
          {/* /.card */}
        </section>
        {/* /.content */}
      </div>
      <Footer />
    </div>
  )
}

export default ActiveAuctions;