import React, { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './css/style.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';
import axios from 'axios';
import Loader from '../components/Loader';
import { errorMessage } from '../config';
import { showSweetAlert } from '../helpers/sweetAlert';

function Login() {

  const [email, setEmail] = useState("rushabh@bbd.co.za");
  const [password, setPassword] = useState("Rushabh@12345");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validateInput = () => {
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let result = true;
    let error = '';
    if(email.length === 0){
      result = false;
      error = 'Please enter email.';
      emailRef.current.focus();
    } 
    else if(!email.match(email_regex) || !email.includes('@bbd.co.za')){
      result = false;
      error = 'Please enter valid email of BBD domain.';
      emailRef.current.focus();
    } 
    else if(password.length === 0){
      result = false;
      error = 'Please enter password.';
      passwordRef.current.focus();
    }
    // Display Error
    if(result === false){
      showSweetAlert('warning', 'Invalid Input', error);
    }
    return result;
  };

  const handleLogin = () => {
    if (validateInput()) {
      const apiurl = process.env.REACT_APP_URL;
      const requestData = {
        emailId: email,
        password: password
      };
      setLoading(true);
      axios.post(apiurl + '/employees/authenticate', requestData)
        .then((response) => {
          console.log('then...');
          console.log(response.data);
          setLoading(false);
          if (response.status === 200) {
            const data = response.data;
            // sessionStorage.setItem('user', JSON.stringify({ employeeId: data.employeeId, email: data.emailId, role: data.role, token: data.token }));
            sessionStorage.setItem('employeeId', data.employeeId);
            sessionStorage.setItem('name', data.firstName + ' ' + data.lastName);
            sessionStorage.setItem('emailId', data.emailId);
            sessionStorage.setItem('role', data.role);
            sessionStorage.setItem('token', data.token);
            console.log('Set values in sessionStorage');
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
          }
          // Swal.fire({
          //   title: 'Error',
          //   text: msg,
          //   icon: 'error',
          //   confirmButtonColor: '#3085d6'
          // });
          showSweetAlert('error', 'Error', msg);
        });
    }
  };

  if(response) {
    console.log('Role checking : ' + response.role);
    if (response.role === "User") {
      // console.log('User');
      return <Redirect to="/dashboard" />;
    }
    else if (response.role === "Admin") {
      console.log('Admin');
      return <Redirect to="/admin/dashboard" />;
    }
  }

  return (
    <div className="main">
      <Loader loading={loading} />
      <section className="sign-in">
        <div className="my-container">
          <div className="signin-content">
            <div className="signin-image">
              <figure><img src={require('../images/signin-image.jpg').default} alt="sign In" className="img img-fluid" /></figure>
            </div>
            <div className="signin-form">
              <h2 className="form-title">Login</h2>
              <form method="POST" className="register-form" id="login-form">
                <div className="form-group">
                  <label htmlFor="your_name"><i className="zmdi zmdi-account material-icons-name"></i></label>
                  <input type="text" maxLength="50" ref={emailRef} name="your_name" id="your_name" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                </div>
                <div className="form-group">
                  <label htmlFor="your_pass"><i className="zmdi zmdi-lock"></i></label>
                  <input type="password" maxLength="50" ref={passwordRef} name="your_pass" id="your_pass" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
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