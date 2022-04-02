import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { tokenSelector } from '../selectors';

const PrivateRoute = ({ children, ...rest }) => {
  const location = useLocation();
  const token = useSelector(tokenSelector);
  return (
    <Route {...rest}>
      {token ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: {
              requireAuth: 'You must be logged in to do that',
              prevPathname: location.pathname,
            },
          }}
        />
      )}
    </Route>
  );
};

export default PrivateRoute;
