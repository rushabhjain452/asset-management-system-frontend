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

function Gender() {

  const [data, setData] = useState([]);
  const [gender, setGender] = useState('');
  const [genderId, setGenderId] = useState(0);
  const [btnText, setBtnText] = useState('Add');
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  const [loading, setLoading] = useState(false);

  const textboxRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(apiurl + '/genders')
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setData(response.data);
        }
        else {
          // showSweetAlert('error', 'Network Error', errorMessage);
          showToast('error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        // showSweetAlert('error', 'Network Error', errorMessage);
        showToast('error', errorMessage);
      });
  };

  const addGender = () => {
    if (gender.length > 0) {
      setLoading(true);
      const requestData = {
        name: gender
      };
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.post(apiurl + '/genders', requestData, { headers })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Gender added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Gender. Please try again...');
          }
          setGender('');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Gender. Please try again...');
        });
    } else {
      showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Gender.');
    }
  };

  const deleteGender = (id, name) => {
    showConfirmAlert('Delete Confirmation', `Do you really want to delete the gender '${name}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const headers = { 'Authorization': 'Bearer ' + token };
          axios.delete(apiurl + '/genders/' + id, { headers })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showSweetAlert('success', 'Success', 'Gender deleted successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to delete Gender. Please try again...');
              }
              setGender('');
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to delete Gender. Please try again...');
              setGender('');
            });
        }
      });
  };

  const editGender = (genderId, name) => {
    setGender(name);
    setBtnText('Update');
    setGenderId(genderId);
    textboxRef.current.focus();
  };

  const updateGender = () => {
    if (gender.length > 0) {
      setLoading(true);
      const requestData = {
        name: gender
      };
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.put(apiurl + '/genders/' + genderId, requestData, { headers })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Gender updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Gender. Please try again...');
          }
          setGender('');
          setBtnText('Add');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Gender. Please try again...');
        });
    } else {
      showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Gender.');
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
                <h1 className="m-0">Gender</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Gender</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <h4>{btnText} Gender</h4>
            <div className="input-group mb-3 ">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fas fa-venus-mars" />
                </span>
              </div>
              <input type="text" maxLength="20" ref={textboxRef} className="form-control" placeholder="Gender Name" value={gender} onChange={e => setGender(e.target.value)} />
            </div>
          </div>
          <div className="card-footer">
            <button 
              type="button" 
              className="btn btn-primary float-right" 
              onClick={btnText === 'Add' ? addGender : updateGender}>
                {btnText}
            </button>
            {/* <button type="submit" className="btn btn-default float-right">Cancel</button> */}
          </div>
        </div>
        <div className="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">List of Gender</h3>
                {/* <div class="card-tools">
                  <div class="input-group input-group-sm">
                    <input type="text" name="table_search" class="form-control float-right" placeholder="Search" />
                    <div class="input-group-append">
                      <button type="submit" class="btn btn-default">
                        <i class="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
              <div class="card-body">
                <table id="gender-table" class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Gender Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.genderId}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editGender(item.genderId, item.name)}>
                              <i class="fa fa-edit"></i>
                            </button>
                          </td>
                          <td>
                            <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => deleteGender(item.genderId, item.name)}>
                              <i class="fa fa-trash"></i>
                            </button>
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

export default Gender;
