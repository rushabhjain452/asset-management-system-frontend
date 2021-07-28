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
import { formatDate, convertToDate } from '../helpers/dateHelper';
import { authHeader } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const ViewAssignAsset = () => {
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
    axios.get(apiurl + '/assign-assets/assets-with-properties/employee/' + employeeId, { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => {
            let val1 = convertToDate(a.assignDate);
            let val2 = convertToDate(b.assignDate);
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
      let searchData = dataCopy.filter((item) => item.assetId == searchText ||
        item.assetType.toLowerCase().includes(searchText) ||
        item.assetPropertiesList.find(item => item.value.toLowerCase().includes(searchText)) != undefined ||
        formatDate(item.assignDate) === searchText
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
    }
  };

  return (
    <div className="wrapper">
      <Header />
      { role === 'Admin' ? <Menu /> : <UserMenu /> }
      <Loader loading={loading} />
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Assign Assets</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to={role === 'Admin' ? "/admin/dashboard" : "/dashboard"}>Home</NavLink></li>
                  <li className="breadcrumb-item active">Assign Assets</li>
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
                    <th title="Sort" className="sort-style" onClick={() => sort('assetId')}>Asset Id <i className="fa fa-sort" /></th>
                    <th title="Sort" className="sort-style" onClick={() => sort('assetType')}>Asset Type <i className="fa fa-sort" /></th>
                    <th>Properties</th>
                    <th title="Sort" className="sort-style" onClick={() => sort('assignDate')}>Assign Date <i className="fa fa-sort" /></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.length > 0 && data.map((item, index) => (
                      <tr key={item.assetId}>
                        <td>{index + 1}</td>
                        <td>{item.assetId}</td>
                        <td>{item.assetType}</td>
                        <td>
                          {
                            item.assetPropertiesList.map((property) => (
                              <div key={property.assetPropertiesId}><b>{property.propertyName}</b> : {property.value}</div>
                            ))
                          }
                        </td>
                        <td>{formatDate(item.assignDate)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
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

export default ViewAssignAsset;
