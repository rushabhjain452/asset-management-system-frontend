import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Menu from './Menu';
import axios from 'axios';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast } from '../../helpers/sweetAlert';
import { formatDate, convertTimestampToDate } from '../../helpers/dateHelper';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const SaleAsset = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
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
    axios.get(apiurl + '/auctions/sale-auction', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => {
            const val1 = convertTimestampToDate(a.saleDate);
            const val2 = convertTimestampToDate(b.saleDate);
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
        formatDate(item.saleDate) === searchText ||
        item.employeeId == searchText ||
        (item.firstName + ' ' + item.lastName).toLowerCase().includes(searchText)
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
      case 'minimumBidAmount':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.minimumBidAmount - b.minimumBidAmount) * order);
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
      case 'employeeId':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.employeeId - b.employeeId) * order);
          return newData;
        });
        break;
      case 'name':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = (a.firstName + ' ' + a.lastName).toLowerCase();
            const val2 = (b.firstName + ' ' + b.lastName).toLowerCase();
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
      <Menu />
      <Loader loading={loading} />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Sold Assets</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Sold Assets</li>
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
              <h3 className="card-title text-bold mt-2">List of Sold Assets (No of Sold Assets : {data.length})</h3>
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
                    <th title="Sort" className="sort-style" onClick={() => sort('saleDate')}>Sale Date <br /> (dd-mm-yyyy) <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('assetId')}>Asset Id <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                    <th>Properties</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('minimumBidAmount')}>Minimum <br />Bid Amount <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('bidAmount')}>Sale Amount <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('employeeId')}>Employee Id <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('name')}>Name <i className="fa fa-sort" /></th>
                  </tr>
                </thead>
                <tbody>
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
                        <td>{item.employeeId}</td>
                        <td>
                          {item.firstName} {item.lastName} <br />
                          <div className="d-flex justify-content-center">
                            <img src={item.profilePicture != '' ? item.profilePicture : item.gender === 'Female' ? femaleAvatar : maleAvatar}
                              className="img-circle elevation-2" width="50" height="50" />
                          </div>
                        </td>
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

export default SaleAsset;