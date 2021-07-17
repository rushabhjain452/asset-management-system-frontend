import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Error from './pages/Error';
import ErrorBoundary from './components/ErrorBoundary';
import ForgetPassword from "./pages/ForgetPassword";
import VerifyOtpAndUpdatePassword from "./pages/VerifyOtpAndUpdatePassword";
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Gender from "./pages/admin/Gender";
// User Pages
import UserDashboard from './pages/UserDashboard';
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
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
import Role from "./pages/admin/Role";
import AssetType from "./pages/admin/AssetType";
import Properties from "./pages/admin/Properties";
import Asset from "./pages/admin/Asset";
import Profile from "./pages/Profile";
import AddEmployee from "./pages/admin/Employee";
import ViewEmployees from "./pages/admin/ViewEmployees";
import AssetProperties from "./pages/admin/AssetTypeProperties";
import AssignAsset from "./pages/admin/AssignAsset";
import Auction from "./pages/admin/Auction";
import Bids from "./pages/Bids";
import ViewBids from "./pages/admin/ViewBids";
import SaleAsset from "./pages/admin/SaleAsset";
import ViewAssignAsset from "./pages/ViewAssignAsset";
import ViewAssetSales from "./pages/ViewAssetSales";
// AdminLTE for demo purposes
// import 'admin-lte/dist/js/demo.js';
// AdminLTE dashboard demo (This is only for demo purposes)
// import 'admin-lte/dist/js/pages/dashboard.js';


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Switch>
          <>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path='/forget-password' component={ForgetPassword} />
            <Route exact path='/verify-otp-update-password' component={VerifyOtpAndUpdatePassword} />
            <PrivateRoute exact path='/profile' component={Profile} />
            <Route exact path='/error' component={Error} />
            {/* Admin Pages */}
            <PrivateRoute exact path='/admin/dashboard' component={AdminDashboard} />
            <PrivateRoute exact path='/admin/gender' component={Gender} />
            <PrivateRoute exact path='/admin/role' component={Role} />
            <PrivateRoute exact path='/admin/asset-types' component={AssetType} />
            <PrivateRoute exact path='/admin/properties' component={Properties} />
            <PrivateRoute exact path='/admin/assets' component={Asset} />
            <PrivateRoute exact path='/admin/add-employee' component={AddEmployee} />
            <PrivateRoute exact path='/admin/view-employees' component={ViewEmployees} />
            <PrivateRoute exact path='/admin/assettype-properties' component={AssetProperties} />
            <PrivateRoute exact path='/admin/assign-asset' component={AssignAsset} />
            <PrivateRoute exact path='/admin/auction' component={Auction} />
            <PrivateRoute exact path='/admin/view-bids' component={ViewBids} />
            <PrivateRoute exact path='/admin/sale-asset' component={SaleAsset} />

            {/* User Pages */}
            <PrivateRoute exact path='/dashboard' component={UserDashboard} />
            <PrivateRoute exact path='/bids' component={Bids} />
            <PrivateRoute exact path='/view-assign-asset' component={ViewAssignAsset} />
            <PrivateRoute exact path='/view-asset-sales' component={ViewAssetSales} />
            {/* <Route component={Error} /> */}
            {/* <Redirect to="/error" /> */}
          </>
        </Switch>
        {/* <IdleTimeTracker /> */}
      </ErrorBoundary>
    </Router>
  );
}

export default App;
