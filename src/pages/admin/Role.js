import React, { useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Menu from './Menu';
import axios from 'axios';
import Loader from '../../components/Loader';
import { errorMessage } from '../../config';
import { showToast, showSweetAlert, showConfirmAlert } from '../../helpers/sweetAlert';
import { authHeader } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const apiurl = process.env.REACT_APP_URL;

const Role = () => {
  const { state, logout, updateContextState } = useContext(AuthContext);
  let token = state.token;
  if (!token) {
    token = sessionStorage.getItem('token');
    updateContextState();
  }

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [role, setRole] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [btnText, setBtnText] = useState('Add');
  const [searchText, setSearchText] = useState('');
  const [checked, setChecked] = useState(true);

  const [loading, setLoading] = useState(false);

  const textboxRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/roles', { headers: authHeader(token) })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // Sort Data
          const data = response.data;
          data.sort((a, b) => {
            const val1 = a.name.toLowerCase();
            const val2 = b.name.toLowerCase();
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

  const validateInput = () => {
    const char_only_regex = /^[a-zA-Z_()// -]*$/;
    let result = true;
    let error = errorMessage;
    if (role.length == 0) {
      result = false;
      error = 'Please enter value for Role.';
      textboxRef.current.focus();
    }
    else if (!role.match(char_only_regex)) {
      result = false;
      error = 'Please enter valid Role. Role can only contain characters.';
      textboxRef.current.focus();
    }
    else if (btnText == 'Add') {
      // Check if already exists
      const findItem = data.find((item) => item.name.toLowerCase() == role.toLowerCase());
      if (findItem) {
        result = false;
        error = 'Role already exists with given name.';
        textboxRef.current.focus();
      }
    }
    // Display Error if validation failed
    if (result === false) {
      showToast('warning', error);
    }
    return result;
  };

  const addRole = () => {
    if (validateInput()) {
      setLoading(true);
      const requestData = {
        name: role
      };
      axios.post(apiurl + '/roles', requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
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
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const deleteRole = (id, name) => {
    showConfirmAlert('Delete Confirmation', `Do you really want to delete the role '${name}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios.delete(apiurl + '/roles/' + id, { headers: authHeader(token) })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
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
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
              }
            });
        }
      });
  };

  const editRole = (id, name) => {
    setBtnText('Update');
    setRoleId(id);
    setRole(name);
    textboxRef.current.focus();
  };

  const updateRole = () => {
    if (validateInput()) {
      setLoading(true);
      const requestData = {
        name: role
      };
      axios.put(apiurl + '/roles/' + roleId, requestData, { headers: authHeader(token) })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
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
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logout();
          }
        });
    }
  };

  const onCancel = () => {
    setRole('');
    setBtnText('Add');
  };

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if (searchText.length > 0) {
      const searchData = dataCopy.filter((item) => item.name.toLowerCase().includes(searchText));
      setData(searchData);
    } else {
      setData(dataCopy);
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
                  <i className="fas fa-user-tag" />
                </span>
              </div>
              <input type="text" maxLength="20" ref={textboxRef} className="form-control" placeholder="Role Name" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
          </div>
          <div className="card-footer">
            <button type="button" className="btn btn-secondary float-right" onClick={onCancel}>Cancel</button>
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
                <h3 className="card-title text-bold mt-2">List of Role</h3>
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
                <table id="role-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
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
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editRole(item.roleId, item.name)}>
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => deleteRole(item.roleId, item.name)}>
                              <i className="fa fa-trash"></i>
                            </button>
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Role;