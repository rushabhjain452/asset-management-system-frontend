import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {

  const { state } = useContext(AuthContext);

  let token = state.token;
  if(!token){
    // Page refresh
    token = sessionStorage.getItem('token');
    // Update Context state using login() method
    // console.error('Updating context from PrivateRoute');
    // updateContextState();
  }

  return (
    <Route {...rest} render={props => (
      token && token != "" ?
        <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );

};

export default PrivateRoute;