import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Error from './pages/Error';
import ErrorBoundary from './components/ErrorBoundary';
import ForgetPassword from "./pages/ForgetPassword";
import VerifyOtpAndUpdatePassword from "./pages/VerifyOtpAndUpdatePassword";
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
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
            {/* Admin Pages */}
            <PrivateRoute exact path='/admin/dashboard' component={AdminDashboard} />
            {/* User Pages */}
            <PrivateRoute exact path='/dashboard' component={UserDashboard} />
            {/* <Route component={Error} /> */}
          </>
        </Switch>
        {/* <IdleTimeTracker /> */}
      </ErrorBoundary>
    </Router>
  );
}

export default App;
