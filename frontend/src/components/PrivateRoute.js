import { connect } from 'react-redux';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { tokenSelector } from '../selectors';

const PrivateRoute = ({ token, children, ...rest }) => {
  const location = useLocation();
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

const mapStateToProps = (state) => ({
  token: tokenSelector(state),
});

export default connect(mapStateToProps)(PrivateRoute);
