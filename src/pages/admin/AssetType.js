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

function AssetType() {

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [assetType, setAssetType] = useState('');
  const [assetTypeId, setAssetTypeId] = useState(0);
  const [btnText, setBtnText] = useState('Add');

  const [loading, setLoading] = useState(false);

  const textboxRef = useRef(null);

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(apiurl + '/asset-types', { headers })
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
      });
  };

  const addAssetType = () => {
    if (assetType.length > 0) {
      setLoading(true);
      const requestData = {
        assetType: assetType
      };
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.post(apiurl + '/asset-types', requestData, { headers })
        .then((response) => {
          setLoading(false);
          if (response.status === 201) {
            showSweetAlert('success', 'Success', 'Asset Type added successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to add Asset Type. Please try again...');
          }
          setAssetType('');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to add Asset Type. Please try again...');
        });
    } else {
      showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Asset Type.');
    }
  };

  const deleteAssetType = (id, name) => {
    showConfirmAlert('Delete Confirmation', `Do you really want to delete the Asset Type '${name}' ?`)
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          const headers = { 'Authorization': 'Bearer ' + token };
          axios.delete(apiurl + '/asset-types/' + id, { headers })
            .then((response) => {
              setLoading(false);
              if (response.status === 200) {
                showSweetAlert('success', 'Success', 'Asset Type deleted successfully.');
                fetchData();
              }
              else {
                showSweetAlert('error', 'Error', 'Failed to delete Asset Type. Please try again...');
              }
              setAssetType('');
            })
            .catch((error) => {
              setLoading(false);
              showSweetAlert('error', 'Error', 'Failed to delete Asset Type. Please try again...');
              setAssetType('');
            });
        }
      });
  };

  const editAssetType = (assetTypeId, name) => {
    setAssetType(name);
    setBtnText('Update');
    setAssetTypeId(assetTypeId);
    textboxRef.current.focus();
  };

  const updateAssetType = () => {
    if (assetType.length > 0) {
      setLoading(true);
      const requestData = {
        assetType: assetType
      };
      const headers = { 'Authorization': 'Bearer ' + token };
      axios.put(apiurl + '/asset-types/' + assetTypeId, requestData, { headers })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            showSweetAlert('success', 'Success', 'Asset Type updated successfully.');
            fetchData();
          }
          else {
            showSweetAlert('error', 'Error', 'Failed to update Asset Type. Please try again...');
          }
          setAssetType('');
          setBtnText('Add');
        })
        .catch((error) => {
          setLoading(false);
          showSweetAlert('error', 'Error', 'Failed to update Asset Type. Please try again...');
        });
    } else {
      showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Asset Type.');
    }
  };

  const statusChange = (e, assetTypeId) => {
    const status = e.target.checked;
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.put(apiurl + '/asset-types/' + assetTypeId + '/update-status/' + status, {}, { headers })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          // showSweetAlert('success', 'Success', 'Status of Asset Type updated successfully.');
          showToast('success', 'Status of Asset Type updated successfully.');
          fetchData();
        }
        else {
          showSweetAlert('error', 'Error', 'Failed to update status of Asset Type. Please try again...');
          fetchData();
        }
      })
      .catch((error) => {
        setLoading(false);
        showSweetAlert('error', 'Error', 'Failed to update status of Asset Type. Please try again...');
        fetchData();
      });
  };

  const onSearchTextChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    if(searchText.length > 0){
      let searchData = dataCopy.filter((item) => item.assetType.toLowerCase().includes(searchText));
      setData(searchData);
    }else{
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
                <h1 className="m-0">Asset Type</h1>
              </div>{/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><NavLink exact to="/admin/dashboard">Home</NavLink></li>
                  <li className="breadcrumb-item active">Asset Type</li>
                </ol>
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </div>
        <div className="card card-info">
          <div className="card-body">
            <h4>{btnText} Asset Type </h4>
            <div className="input-group mb-3 ">
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fas fa-venus-mars" /></span>
              </div>
              <input type="text" maxLength="20" ref={textboxRef} className="form-control" placeholder="Asset Type Name" value={assetType} onChange={e => setAssetType(e.target.value)} />
            </div>
          </div>
          <div className="card-footer">
            <button 
              type="button" 
              className="btn btn-primary float-right" 
              onClick={btnText === 'Add' ? addAssetType : updateAssetType}>
                {btnText}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">List of Asset Types</h3>
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
                      <span class="input-group-text" id="basic-addon2">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table id="asset-type-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Role Name</th>
                      <th>Status</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.length > 0 && data.map((item, index) => (
                        <tr key={item.assetTypeId}>
                          <td>{index + 1}</td>
                          <td>{item.assetType}</td>
                          <td>
                            <div className="custom-control custom-switch">
                              <input 
                                type="checkbox" 
                                className="custom-control-input" 
                                id={'status-'+item.assetTypeId} 
                                onChange={(e) => statusChange(e, item.assetTypeId)}
                                defaultChecked={item.status} />
                              <label className="custom-control-label" for={'status-'+item.assetTypeId}></label>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => editAssetType(item.assetTypeId, item.assetType)}>
                              <i className="fa fa-edit"></i>
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={() => deleteAssetType(item.assetTypeId, item.assetType)}>
                              <i className="fa fa-trash"></i>
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

export default AssetType;
