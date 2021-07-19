import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {

  const { state } = useContext(AuthContext);
  const token = state.token;

  return (
    <Route {...rest} render={props => (
      token != "" ?
        <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );

};

export default PrivateRoute;