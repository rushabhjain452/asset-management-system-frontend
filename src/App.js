import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Error from './pages/Error';
import ErrorBoundary from './components/ErrorBoundary';
import ForgetPassword from "./pages/ForgetPassword";
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
// User Pages
import UserDashboard from './pages/UserDashboard';
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Switch>
          <>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path='/forget-password' component={ForgetPassword} />
            {/* Admin Pages */}
            <PrivateRoute exact path='/admin/dashboard' component={AdminDashboard} />
            {/* User Pages */}
            <PrivateRoute exact path='/dashboard' component={UserDashboard} />
            {/* <Route component={Error} /> */}
          </>
        </Switch>
        {/* <IdleTimeTracker /> */}
        {/* <Loader /> */}
      </ErrorBoundary>
    </Router>
  );
}

export default App;
