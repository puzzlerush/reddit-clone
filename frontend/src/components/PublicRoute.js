import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { tokenSelector } from '../selectors';

const PublicRoute = ({ token, children, ...rest }) => (
  <Route {...rest}>{token ? <Redirect to="/" /> : children}</Route>
);

const mapStateToProps = (state) => ({
  token: tokenSelector(state),
});

export default connect(mapStateToProps)(PublicRoute);
