import React, { useState, useRef, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './css/style.css';
import "material-design-iconic-font/dist/css/material-design-iconic-font.min.css";
import axios from 'axios';
import Loader from '../components/Loader';
import { errorMessage } from '../config';
import { showToastWithProgress, showSweetAlert } from '../helpers/sweetAlert';
import { AuthContext } from '../context/AuthContext';

const ForgetPassword = () => {
  const { setEmployeeId } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const emailRef = useRef(null);
  const mobileRef = useRef(null);

  const validateInput = () => {
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mobile_regex = /^[0-9]{10}$/;
    let result = true;
    let error = errorMessage;

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
    else if(mobileNumber.length === 0){
      result = false;
      error = 'Please enter mobile number.';
      mobileRef.current.focus();
    }
    else if(!mobileNumber.match(mobile_regex)){
      result = false;
      error = 'Please enter valid mobile number of 10 digits.';
      mobileRef.current.focus();
    }
    // Display Error
    if(result === false){
      // Swal.fire({
      //   title: 'Invalid Input',
      //   text: error,
      //   icon: 'warning',
      //   confirmButtonColor: '#3085d6'
      // });
      showSweetAlert('warning', 'Invalid Input', error);
    }
    return result;
  };

  const handleSendOtp = () => {
    if(validateInput()){
      setLoading(true);
      const apiurl = process.env.REACT_APP_URL;
      const requestData = {
        emailId: email,
        mobileNumber: mobileNumber
      };
      axios.post(apiurl + '/employees/forget-password', requestData)
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            const data = response.data;
            // sessionStorage.setItem('employeeId', data.employeeId);
            // dispatch({type: 'SET_EMPLOYEE_ID', payload: data.employeeId});
            setEmployeeId(data.employeeId);
            showToastWithProgress('success', 'OTP sent successfully');
          }
          setRedirect(true);
        })
        .catch((error) => {
          setLoading(false);
          // console.log(error);
          // console.log(error.response);
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

  if(redirect) {
    return <Redirect to="/verify-otp-update-password" />;
  }

  return (
    <div className="main">
      <Loader loading={loading} />
      <section className="sign-in">
        <div className="my-container">
          <div className="signin-content">
            <div className="signin-image">
              <figure><img src={require('../images/forget-password.jpg').default} alt="Forget Password" className="img img-fluid" /></figure>
            </div>
            <div className="signin-form">
              <h2 className="form-title">Send OTP for Verification</h2>
              <form method="POST" className="register-form" id="forgetpassword-form">
                <div className="my-form-group">
                  <label htmlFor="your_email" className="label-style"><i className="zmdi zmdi-account material-icons-name"></i></label>
                  <input type="text" className="input-style" maxLength="50" ref={emailRef} name="your_email" id="your_email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                </div>
                <div className="my-form-group">
                  <label htmlFor="your_mobileno" className="label-style"><i className="zmdi zmdi-lock"></i></label>
                  <input type="text" className="input-style" maxLength="10" ref={mobileRef} name="your_mobileno" id="your_mobileno" placeholder="Mobile Number" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
                </div>
                <div className="my-form-group form-button">
                  {/* <input type="submit" name="signin" id="signin" className="form-submit" value="Login" /> */}
                  <button type="button" name="sendotp" id="sendotp" className="form-submit" onClick={handleSendOtp}>Send OTP</button>
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

export default ForgetPassword;