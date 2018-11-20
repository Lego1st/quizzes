import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
// import Home from './Home';

const PrivateRoute = ({ component: Component, logged_in, ...rest }) => (
  <Route
    {...rest}
        render={props => (logged_in === true ? <Component /> : <Redirect to="/login"/>) }

    // render={props => (logged_in === true ? <Component {...props} /> : <Redirect to="/login" />)}
  />
);

export default withRouter(PrivateRoute);