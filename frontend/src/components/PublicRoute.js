import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { tokenSelector } from '../selectors';

const PublicRoute = ({ children, ...rest }) => {
  const token = useSelector(tokenSelector);
  return <Route {...rest}>{token ? <Redirect to="/" /> : children}</Route>;
};

export default PublicRoute;
