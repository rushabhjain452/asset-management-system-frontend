import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {

  // const { user } = useSelector((state) => state.auth);
  const token = sessionStorage.getItem('token');

  return (
    <Route {...rest} render={props => (
      token ?
        <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );

};

export default PrivateRoute;