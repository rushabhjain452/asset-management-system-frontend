import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {

  // const { user } = useSelector((state) => state.auth);

  // return (
  //   <Route {...rest} render={props => (
  //     user ?
  //       <Component {...props} />
  //       : <Redirect to='/login' />
  //   )} />
  // );

  return (
    <Route {...rest} />
  );
};

export default PrivateRoute;