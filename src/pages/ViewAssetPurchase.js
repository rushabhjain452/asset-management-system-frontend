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
import { formatDate, convertToDate, convertTimestampToDate, formatTimestamp } from '../helpers/dateHelper';
import { authHeader } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const ViewAssignPurchase = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  let role = state.role;
  let employeeId = state.employeeId;
  if (!token) {
    token = sessionStorage.getItem('token');
    role = sessionStorage.getItem('role');
    employeeId = sessionStorage.getItem('employeeId');
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
    axios.get(apiurl + '/auctions/sale-auction/employee/' + employeeId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => {
            let val1 = convertTimestampToDate(a.saleDate);
            let val2 = convertTimestampToDate(b.saleDate);
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
        item.assetPropertiesList.find(item => item.value.toLowerCase().includes(searchText)) != undefined ||
        item.minimumBidAmount == searchText ||
        item.bidAmount == searchText ||
        formatDate(item.saleDate) === searchText
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
      case 'minimumBidAmount':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => (a.minimumBidAmount - b.minimumBidAmount) * order);
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

  return (
    <div className="wrapper">
      <Header />
      { role === 'Admin' ? <Menu /> : <UserMenu />}
      <Loader loading={loading} />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Purchased Assets</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to={role === 'Admin' ? "/admin/dashboard" : "/dashboard"}>Home</NavLink></li>
                  <li className="breadcrumb-item active">Purchased Assets</li>
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
              <h3 className="card-title text-bold mt-2">List of Purchased Assets (No of Purchased Assets : {data.length})</h3>
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
                    <th title="Sort" className="sort-style" onClick={() => sort('saleDate')}>Purchase Date <br /> (dd-mm-yyyy) <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('assetId')}>Asset Id <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                    <th>Properties</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('minimumBidAmount')}>Minimum <br />Bid Amount <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('bidAmount')}>Sale Amount <i className="fa fa-sort" /></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.length == 0 &&
                    <td colspan="7">
                      <h3 className="text-center">You have not purchased any asset.</h3>
                    </td>
                  }
                  {
                    data.length > 0 && data.map((item, index) => (
                      <tr key={item.auctionId}>
                        <td>{index + 1}</td>
                        <td>{formatDate(item.saleDate)}</td>
                        <td>{item.assetId}</td>
                        <td>{item.assetType}</td>
                        <td>
                          {
                            item.assetPropertiesList.map((property) => (
                              <div key={property.assetPropertiesId}><b>{property.propertyName}</b> : {property.value}</div>
                            ))
                          }
                        </td>
                        <td>{item.minimumBidAmount}</td>
                        <td>{item.bidAmount}</td>
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

export default ViewAssignPurchase;