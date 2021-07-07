import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './css/login.css';
import "material-design-iconic-font/dist/css/material-design-iconic-font.min.css";
import Swal from 'sweetalert2';
import axios from 'axios';
import { errorMessage } from '../config/index';

function Login() {

  const [email, setEmail] = useState("rushabh@bbd.co.za");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();

  const handleLogin = () => {
    if (email && password) {
      const apiurl = process.env.REACT_APP_URL;
      const requestData = {
        emailId: email,
        password: password
      };
      axios.post(apiurl + '/employees/authenticate', requestData)
        .then((response) => {
          console.log('then...');
          console.log(response.data);
          setLoading(false);
          if (response.status == 200) {
            const data = response.data;
            // localStorage.setItem('user', JSON.stringify({ employeeId: data.employeeId, email: data.emailId, role: data.role, token: data.token }));
            localStorage.setItem('employeeId', data.employeeId);
            localStorage.setItem('emailId', data.emailId);
            localStorage.setItem('role', data.role);
            localStorage.setItem('token', data.token);
            console.log('Set values in localStorage');
            // Swal.fire({
            //   title: 'Success',
            //   text: 'Login success...',
            //   icon: 'success',
            //   confirmButtonColor: '#3085d6'
            // });
          }
          setResponse(response.data);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          console.log(error.response);
          let msg = errorMessage;
          if (error.response && error.response.data) {
            msg = error.response.data.message;
          } else {
            console.log('No response');
          }
          Swal.fire({
            title: 'Error',
            text: msg,
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        });
    } else {
      // alert('Please enter email and password...');
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please enter email and password...',
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  if(response) {
    console.log('Role checking : ' + response.role);
    if (response.role === "User") {
      // console.log('User');
      return <Redirect exact to="/dashboard" />;
    }
    else if (response.role === "Admin") {
      // console.log('Admin');
      return <Redirect exact to="/admin/dashboard" />;
    }
  }

  return (
    <div className="main">
      <section className="sign-in">
        <div className="container">
          <div className="signin-content">
            <div className="signin-image">
              <figure><img src={require('../images/signin-image.jpg').default} alt="sign In image" /></figure>
            </div>
            <div className="signin-form">
              <h2 className="form-title">Login</h2>
              <form method="POST" className="register-form" id="login-form">
                <div className="form-group">
                  <label htmlFor="your_name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                  <input type="text" name="your_name" id="your_name" placeholder="Email" value={email} onInput={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="your_pass"><i className="zmdi zmdi-lock"></i></label>
                  <input type="password" name="your_pass" id="your_pass" placeholder="Password" value={password} onInput={e => setPassword(e.target.value)} />
                </div>
                <Link to="/forget-password" className="signup-image-link">Forget Password?</Link>
                {/* <div className="form-group">
                  <input type="checkbox" name="remember-me" id="remember-me" className="agree-term" />
                  <label htmlFor="remember-me" className="label-agree-term"><span><span></span></span>Remember me</label>
                </div> */}
                <div className="form-group form-button">
                  {/* <input type="submit" name="signin" id="signin" className="form-submit" value="Login" /> */}
                  <button type="button" name="signin" id="signin" className="form-submit" onClick={handleLogin}>Login</button>
                </div>
              </form>
              {/* <div className="social-login">
                <span className="social-label">Or login with</span>
                <ul className="socials">
                  <li><a href="#"><i className="display-flex-center zmdi zmdi-facebook"></i></a></li>
                  <li><a href="#"><i className="display-flex-center zmdi zmdi-twitter"></i></a></li>
                  <li><a href="#"><i className="display-flex-center zmdi zmdi-google"></i></a></li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;