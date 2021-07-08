import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Menu from './Menu';
import axios from 'axios';
import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
// import 'admin-lte/plugins/datatables-bs4/css/dataTables.bootstrap4.min.css';
// import 'admin-lte/plugins/datatables-responsive/css/responsive.bootstrap4.min.css';
// import 'admin-lte/plugins/datatables-buttons/css/buttons.bootstrap4.min.css';
// import 'admin-lte/plugins/datatables/jquery.dataTables.min.js';
// import 'admin-lte/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js';
// import 'admin-lte/plugins/datatables-responsive/js/dataTables.responsive.min.js';
// import 'admin-lte/plugins/datatables-responsive/js/responsive.bootstrap4.min.js';
// import 'admin-lte/plugins/datatables-buttons/js/dataTables.buttons.min.js';
// import 'admin-lte/plugins/datatables-buttons/js/buttons.bootstrap4.min.js';
// import 'admin-lte/plugins/jszip/jszip.min.js';
// import 'admin-lte/plugins/pdfmake/pdfmake.min.js';
// import 'admin-lte/plugins/pdfmake/vfs_fonts.js';
// import 'admin-lte/plugins/datatables-buttons/js/buttons.html5.min.js';
// import 'admin-lte/plugins/datatables-buttons/js/buttons.print.min.js';
// import 'admin-lte/plugins/datatables-buttons/js/buttons.colVis.min.js';

const apiurl = process.env.REACT_APP_URL;

function Role() {

  const [data, setData] = useState([]);
  const [role, setRole] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [btnText, setBtnText] = useState('Add');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [loading, setLoading] = useState(false);

  const textboxRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(apiurl + '/roles', { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          setData(response.data);
        }
        else {
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        showToast('error', errorMessage);
      });
  };

  const addRole = () => {
    if (role.length > 0) {
      setLoading(true);
      const requestData = {
        name: role
      };
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.post(apiurl + '/roles', requestData, { headers })
        .then((response) => {
          setLoading(false);
          if (response.status == 201) {
            showSweetAlert('success', 'Success', 'Role added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Role. Please try again...');
          }
          setRole('');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Role. Please try again...');
        });
    } else {
      showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Role.');
    }
  };

  const deleteRole = (id, name) => {
    showConfirmAlert('Delete Confirmation', `Do you really want to delete the role '${name}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const headers = { 'Authorization': 'Bearer ' + token };
          axios.delete(apiurl + '/roles/' + id, { headers })
            .then((response) => {
              setLoading(false);
              if (response.status == 200) {
                showSweetAlert('success', 'Success', 'Role deleted successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to delete Role. Please try again...');
              }
              setRole('');
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to delete Role. Please try again...');
              setRole('');
            });
        }
      });
  };

  const editRole = (roleId, name) => {
    setRole(name);
    setBtnText('Update');
    setRoleId(roleId);
    textboxRef.current.focus();
  };

  const updateRole = () => {
    if (role.length > 0) {
      setLoading(true);
      const requestData = {
        name: role
      };
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.put(apiurl + '/roles/' + roleId, requestData, { headers })
        .then((response) => {
          setLoading(false);
          if (response.status == 200) {
            showSweetAlert('success', 'Success', 'Role updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Role. Please try again...');
          }
          setRole('');
          setBtnText('Add');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Role. Please try again...');
        });
    } else {
      showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Role.');
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
                <h1 className="m-0">Role</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Role</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <h4>{btnText} Role </h4>
            <div className="input-group mb-3 ">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fas fa-venus-mars" />
                </span>
              </div>
              <input type="text" maxLength="20" ref={textboxRef} className="form-control" placeholder="Role Name" value={role} onChange={e => setRole(e.target.value)} />
            </div>
          </div>
          <div className="card-footer">
            <button 
              type="button" 
              className="btn btn-primary float-right" 
              onClick={btnText === 'Add' ? addRole : updateRole}>
                {btnText}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">List of Role</h3>
                {/* <div className="card-tools">
                  <div className="input-group input-group-sm">
                    <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-default">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="card-body">
                <table id="role-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Role Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.roleId}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            <ul class="list-inline m-0">
                              <li class="list-inline-item">
                                <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editRole(item.roleId, item.name)}>
                                  <i class="fa fa-edit"></i>
                                </button>
                              </li>
                            </ul>
                          </td>
                          <td>
                            <ul class="list-inline m-0">
                              <li class="list-inline-item">
                                <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => deleteRole(item.roleId, item.name)}>
                                  <i class="fa fa-trash"></i>
                                </button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Role;