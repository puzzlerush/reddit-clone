import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ token, children, ...rest}) => {
  if (token) {
    return (
      <Route {...rest}>
        {children}
      </Route>
    );
  } else {
    return <Redirect to='/login' />
  }
};

const mapStateToProps = (state) => ({
  token: state.auth.token
});

export default connect(mapStateToProps)(PrivateRoute);