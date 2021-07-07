import React, { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './css/style.css';
import "material-design-iconic-font/dist/css/material-design-iconic-font.min.css";
import Swal from 'sweetalert2';
import axios from 'axios';
import { errorMessage } from '../config/index';

function VerifyOtpAndUpdatePassword() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const otpRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const validateInput = () => {
    let result = true;
    let error = '';
    const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;
    const otp_regex = /^[0-9]{6}$/;
    if(otp.length === 0){
      result = false;
      error = 'Please enter OTP.';
      otpRef.current.focus();
    } 
    else if(!otp.match(otp_regex)){
      result = false;
      error = 'Please enter valid OTP of 6 digits to proceed.';
      otpRef.current.focus();
    } 
    else if(password.length === 0){
      result = false;
      error = 'Please enter new password.';
      passwordRef.current.focus();
    }
    else if(!password.match(password_regex)){
      result = false;
      error = 'Password must contain at least 1 number, 1 special character and 1 uppercase 1 lowercase letter, and at least 8 or more characters.';
      passwordRef.current.focus();
    }
    else if (password != confirmPassword){
      result = false;
      error = 'Password and confirm password didn\'t match.';
      confirmPasswordRef.current.focus();
    }
    // Display Error
    if(result === false){
      Swal.fire({
        title: 'Invalid Input',
        text: error,
        icon: 'warning',
        confirmButtonColor: '#3085d6'
      });
    }
    return result;
  };

  const handleUpdatePassword = () => {
    if(validateInput()){
      setLoading(true);
      const apiurl = process.env.REACT_APP_URL;
      const requestData = {
        employeeId: localStorage.getItem('employeeId'),
        otp: otp,
        password: password
      };
      axios.put(apiurl + '/employees/forget-password', requestData)
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          if (response.status == 200) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });
            Toast.fire({
              icon: 'success',
              title: 'Password updated successfully'
            });
            setRedirect(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response);
          let msg = errorMessage;
          if (error.response && error.response.data) {
            msg = error.response.data.message;
          }
          Swal.fire({
            title: 'Error',
            text: msg,
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        });
    }
  };

  if(redirect) {
    return <Redirect exact to="/login" />;
  }

  return (
    <div className="main">
      <section className="sign-in">
        <div className="my-container">
          <div className="signin-content">
            <div className="signin-image">
              <figure><img src={require('../images/update-password.jpg').default} alt="Update Password" /></figure>
            </div>
            <div className="signin-form">
              <h2 className="form-title">Verify OTP And Update Password</h2>
              <form method="POST" className="register-form" id="updatepassword-form">
                <div className="form-group">
                  <label htmlFor="your_otp"><i className="zmdi zmdi-account material-icons-name"></i></label>
                  <input type="text" maxLength="6" ref={otpRef} name="your_otp" id="your_otp" placeholder="Enter OTP" value={otp} onInput={e => setOtp(e.target.value)} autoFocus />
                </div>
                <div className="form-group">
                  <label htmlFor="your_pass"><i className="zmdi zmdi-lock"></i></label>
                  <input type="password" maxLength="50" ref={passwordRef} name="your_pass" id="your_pass" placeholder="New Password" value={password} onInput={e => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="your_pass"><i className="zmdi zmdi-lock"></i></label>
                  <input type="password" maxLength="50" ref={confirmPasswordRef} name="your_confirm_pass" id="your_confirm_pass" placeholder="Confirm New Password" value={confirmPassword} onInput={e => setConfirmPassword(e.target.value)} />
                </div>
                <div className="form-group form-button">
                  <button type="button" name="signin" id="signin" className="form-submit" onClick={handleUpdatePassword}>Update Password</button>
                </div>
                <Link to="/login" className="signup-image-link">Back to Login</Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VerifyOtpAndUpdatePassword;