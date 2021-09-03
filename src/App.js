import React, { useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { LastLocationProvider } from 'react-router-last-location';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Error from './pages/Error';
import ErrorBoundary from './components/ErrorBoundary';
import ForgetPassword from './pages/ForgetPassword';
import VerifyOtpAndUpdatePassword from './pages/VerifyOtpAndUpdatePassword';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Gender from "./pages/admin/Gender";
// User Pages
import UserDashboard from './pages/UserDashboard';
// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// AdminLTE - CSS
// Font Awesome
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';
// Tempusdominus Bootstrap 4
import 'admin-lte/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css';
// iCheck
import 'admin-lte/plugins/icheck-bootstrap/icheck-bootstrap.min.css';
// JQVMap
import 'admin-lte/plugins/jqvmap/jqvmap.min.css';
// Theme style
import 'admin-lte/dist/css/adminlte.min.css';
// overlayScrollbars
import 'admin-lte/plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
// summernote
import 'admin-lte/plugins/summernote/summernote-bs4.min.css';

// AdminLTE - JS
// jQuery
import 'admin-lte/plugins/jquery/jquery.min.js';
// jQuery UI 1.11.4
import 'admin-lte/plugins/jquery-ui/jquery-ui.min.js';
// Bootstrap 4 JS
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js';
// ChartJS
// import 'admin-lte/plugins/chart.js/Chart.min.js';
// Sparkline
import 'admin-lte/plugins/sparklines/sparkline.js';
// JQVMap
// import 'admin-lte/plugins/jqvmap/jquery.vmap.min.js';
// import 'admin-lte/plugins/jqvmap/maps/jquery.vmap.usa.js';
// jQuery Knob Chart
import 'admin-lte/plugins/jquery-knob/jquery.knob.min.js';
// daterangepicker
// import 'admin-lte/plugins/moment/moment.min.js';
// import 'admin-lte/plugins/daterangepicker/daterangepicker.js';
// Tempusdominus Bootstrap 4
// import 'admin-lte/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js';
// Summernote
import 'admin-lte/plugins/summernote/summernote-bs4.min.js';
// overlayScrollbars
import 'admin-lte/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js';
// AdminLTE App
import 'admin-lte/dist/js/adminlte.js';
import Role from './pages/admin/Role';
import AssetType from './pages/admin/AssetType';
import Properties from './pages/admin/Properties';
import Asset from './pages/admin/Asset';
import Profile from './pages/Profile';
import Employee from './pages/admin/Employee';
import AssetProperties from './pages/admin/AssetTypeProperties';
import AssignAsset from './pages/admin/AssignAsset';
import AssignAssetHistory from './pages/admin/AssignAssetHistory';
import Auction from './pages/admin/Auction';
import Bids from './pages/Bids';
import ViewBids from './pages/admin/ViewBids';
import SaleAsset from './pages/admin/SaleAsset';
import ViewAssignAsset from './pages/ViewAssignAsset';
import ViewReturnedAsset from './pages/ViewReturnedAsset';
import ViewAssetPurchase from './pages/ViewAssetPurchase';
// AdminLTE for demo purposes
// import 'admin-lte/dist/js/demo.js';
// AdminLTE dashboard demo (This is only for demo purposes)
// import 'admin-lte/dist/js/pages/dashboard.js';
import { initialAuthState, authReducer, LOGIN, LOGOUT, SET_EMPLOYEE_ID } from './context/reducers';
import ActiveAuctions from './pages/ActiveAuctions';

const App = () => {

  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  const login = (username, token, role, employeeId, gender, emailId, profilePicture) => {
    // Store data in session storage
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('employeeId', employeeId);
    sessionStorage.setItem('gender', gender);
    sessionStorage.setItem('emailId', emailId);
    sessionStorage.setItem('profilePicture', profilePicture);
    // Update Context state
    dispatch({
      type: LOGIN,
      payload: {
        username: username,
        token: token,
        role: role,
        employeeId: employeeId,
        gender: gender,
        emailId: emailId,
        profilePicture: profilePicture
      }
    });
  };

  const logout = () => {
    // Remove data from session storage
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('employeeId');
    sessionStorage.removeItem('gender');
    sessionStorage.removeItem('emailId');
    sessionStorage.removeItem('profilePicture');
    // Update Context state
    dispatch({ type: LOGOUT });
  };

  const updateContextState = () => {
    let token = sessionStorage.getItem('token');
    if (token) {
      const username = sessionStorage.getItem('username');
      const role = sessionStorage.getItem('role');
      const employeeId = sessionStorage.getItem('employeeId');
      const gender = sessionStorage.getItem('gender');
      const emailId = sessionStorage.getItem('emailId');
      const profilePicture = sessionStorage.getItem('profilePicture');
      dispatch({
        type: LOGIN,
        payload: {
          username: username,
          token: token,
          role: role,
          employeeId: employeeId,
          gender: gender,
          emailId: emailId,
          profilePicture: profilePicture
        }
      });
    }
  }

  const setEmployeeId = (employeeId) => {
    dispatch({
      type: SET_EMPLOYEE_ID,
      payload: employeeId
    });
  }

  return (
    <AuthContext.Provider value={{ state: authState, dispatch: dispatch, login: login, logout: logout, setEmployeeId: setEmployeeId, updateContextState: updateContextState }}>
      <ErrorBoundary>
        {/* <Router> */}
        <Router basename="/asset-management-system">
          <LastLocationProvider>
            <Switch>
              <>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <Route exact path='/forget-password' component={ForgetPassword} />
                <Route exact path='/verify-otp-update-password' component={VerifyOtpAndUpdatePassword} />
                <Route exact path='/error' component={Error} />
                {/* Private Routes */}
                <PrivateRoute path='/profile' component={Profile} />
                {/* Admin Pages */}
                <PrivateRoute exact path='/admin/dashboard' component={AdminDashboard} />
                <PrivateRoute exact path='/admin/gender' component={Gender} />
                <PrivateRoute exact path='/admin/role' component={Role} />
                <PrivateRoute exact path='/admin/asset-types' component={AssetType} />
                <PrivateRoute exact path='/admin/properties' component={Properties} />
                <PrivateRoute exact path='/admin/assets' component={Asset} />
                <PrivateRoute exact path='/admin/employee' component={Employee} />
                <PrivateRoute exact path='/admin/assettype-properties' component={AssetProperties} />
                <PrivateRoute exact path='/admin/assign-return-asset' component={AssignAsset} />
                <PrivateRoute path='/admin/assign-asset-history/:assetId' component={AssignAssetHistory} />
                {/* <PrivateRoute exact path='/admin/auction' component={Auction} /> */}
                <PrivateRoute path='/admin/auction/:assetId' component={Auction} />
                <PrivateRoute exact path='/admin/view-bids/:auctionId' component={ViewBids} />
                <PrivateRoute exact path='/admin/sale-asset' component={SaleAsset} />
                {/* User Pages */}
                <PrivateRoute exact path='/dashboard' component={UserDashboard} />
                <PrivateRoute exact path='/auctions' component={ActiveAuctions} />
                <PrivateRoute exact path='/bids/:auctionId' component={Bids} />
                <PrivateRoute exact path='/view-assign-asset' component={ViewAssignAsset} />
                <PrivateRoute exact path='/view-returned-asset' component={ViewReturnedAsset} />
                <PrivateRoute exact path='/view-asset-purchase' component={ViewAssetPurchase} />
                {/* <Route component={Error} /> */}
                {/* <Redirect to="/error" /> */}
              </>
            </Switch>
          </LastLocationProvider>
        </Router>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
};

export default App;
