import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Menu from './Menu';
import femaleAvatar from 'admin-lte/dist/img/avatar3.png';
import maleAvatar from 'admin-lte/dist/img/avatar5.png';
import axios from 'axios';

import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast } from '../../helpers/sweetAlert';
import { formatDate, convertToDate } from '../../helpers/dateHelper';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const AssignAssetHistory = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const { assetId } = useParams();

  const history = useHistory();

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
    axios.get(apiurl + '/assign-assets/asset-id/' + assetId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setData(response.data);
          setDataCopy(response.data);
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
      const searchData = dataCopy.filter((item) => item.employeeId == searchText ||
        (item.firstName + ' ' + item.lastName).toLowerCase().includes(searchText) ||
        formatDate(item.assignDate) === searchText ||
        formatDate(item.returnDate) === searchText
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
      case 'name':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase();
            let val2 = b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase();
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
      case 'assignDate':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = convertToDate(a.assignDate);
            let val2 = convertToDate(b.assignDate);
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
      case 'returnDate':
        setData((oldData) => {
          let newData = [...oldData];
          newData.sort((a, b) => {
            let val1 = convertToDate(a.returnDate);
            let val2 = convertToDate(b.returnDate);
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
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Assign Asset History</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Assign Asset History</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <h4>Asset Id : {assetId}</h4>
            <div><label>Asset Id :</label> <span>{assetId}</span></div>
            <div><label>Asset Type :</label> <span>{data[0] && data[0].assetType}</span></div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Go Back to Assign Asset</button>
          </div>
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title text-bold mt-2">Assign Asset History</h3>
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
              <div className="card-body">
                <table id="asset-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Profile Picture</th>
                      <th title="Sort" className="sort-style" onClick={() => sort('employeeId')}>Employee Id <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('name')}>Name <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('assignDate')}>Assign Date <i className="fa fa-sort" /></th>
                      <th title="Sort" className="sort-style" onClick={() => sort('returnDate')}>Return Date <i className="fa fa-sort" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.assignAssetId}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <img src={item.profilePicture != '' ? item.profilePicture : item.gender === 'Female' ? femaleAvatar : maleAvatar}
                                className="img-circle elevation-2" width="50" height="50" />
                            </div>
                          </td>
                          <td>{item.employeeId}</td>
                          <td>{item.firstName + ' ' + item.lastName}</td>
                          <td>{formatDate(item.assignDate)}</td>
                          <td>{item.returnDate ? formatDate(item.returnDate) : 'currently assigned'}</td>
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

export default AssignAssetHistory;
