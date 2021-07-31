import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { errorMessage } from '../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../helpers/sweetAlert';
import { authHeader } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const UserDashboardContent = (props) => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  let employeeId = state.employeeId;
  if (!token) {
    token = sessionStorage.getItem('token');
    employeeId = sessionStorage.getItem('employeeId');
    updateContextState();
  }

  const [totalAssignedAssets, setTotalAssignedAssets] = useState(0);
  const [totalPurchasedAssets, setTotalPurchasedAssets] = useState(0);
  const [activeAuctionData, setActiveAuctionData] = useState([]);

  useEffect(() => {
    fetchTotalAssignedAssets();
    fetchTotalPurchasedAssets();
    fetchActiveAuctions();
  }, []);

  const fetchTotalAssignedAssets = () => {
    props.setLoading(true);
    axios.get(apiurl + '/assign-assets/total-assigned-assets/' + employeeId, { headers: authHeader(token) })
      .then((response) => {
        // props.setLoading(false);
        if (response.status === 200) {
          setTotalAssignedAssets(response.data.data);
        }
        else {
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        // props.setLoading(false);
        showToast('error', errorMessage);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
      });
  }

  const fetchTotalPurchasedAssets = () => {
    // setLoading(true);
    axios.get(apiurl + '/auctions/sale-auction/employee/' + employeeId, { headers: authHeader(token) })
      .then((response) => {
        // setLoading(false);
        if (response.status === 200) {
          setTotalPurchasedAssets(response.data.length);
        }
        else {
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        // setLoading(false);
        showToast('error', errorMessage);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
      });
  }

  const fetchActiveAuctions = () => {
    // props.setLoading(true);
    axios.get(apiurl + '/auctions/active-auctions', { headers: authHeader(token) })
      .then((response) => {
        props.setLoading(false);
        if (response.status === 200) {
          console.log(response.data);
          setActiveAuctionData(response.data);
        }
        else {
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        props.setLoading(false);
        showToast('error', errorMessage);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
      });
  }

  return (
    <div>
      <div>
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0">Dashboard</h1>
                </div>{/* /.col */}
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active">Dashboard</li>
                  </ol>
                </div>{/* /.col */}
              </div>{/* /.row */}
            </div>{/* /.container-fluid */}
          </div>
          {/* /.content-header */}
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              {/* Small boxes (Stat box) */}
              <div className="row">
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>{totalAssignedAssets}</h3>
                      <p>Total Assigned Assets</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-bag" />
                    </div>
                    <NavLink exact to="/view-assign-asset" className="small-box-footer">
                      More Info <i className="fas fa-arrow-circle-right" />
                    </NavLink>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>{totalPurchasedAssets}</h3>
                      <p>Total Purchased Assets</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-stats-bars" />
                    </div>
                    <NavLink exact to="/view-asset-purchase" className="small-box-footer">
                      More Info <i className="fas fa-arrow-circle-right" />
                    </NavLink>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>{activeAuctionData.length}</h3>
                      <p>Active Auctions</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-person-add" />
                    </div>
                    <NavLink exact to="/auctions" className="small-box-footer">
                      More Info <i className="fas fa-arrow-circle-right" />
                    </NavLink>
                  </div>
                </div>
                {/* <div className="col-lg-3 col-6">
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>65</h3>
                      <p>Unique Visitors</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-pie-graph" />
                    </div>
                    <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                  </div>
                </div> */}
              </div>
              {/* /.row */}
              {/* Main row */}
              {/* /.row (main row) */}
            </div>{/* /.container-fluid */}
          </section>
          {/* /.content */}
        </div>
      </div>
    </div>
  );  
}

export default UserDashboardContent
