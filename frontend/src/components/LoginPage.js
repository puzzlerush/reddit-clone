import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Stack,
  FormControl,
  Input,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { createLoadingAndErrorSelector } from '../selectors';
import { startLogin } from '../actions/auth';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const { startLogin, location, history } = this.props;
    await startLogin(username, password);
    const { error } = this.props;
    if (!error) {
      history.push(
        (location && location.state && location.state.prevPathname) || '/'
      );
    }
  };

  render() {
    const { username, password } = this.state;
    const { isLoading, error, location } = this.props;
    const requireAuth =
      location && location.state && location.state.requireAuth;
    return (
      <Box w={300} m="auto">
        {requireAuth && (
          <Alert status="warning" mb={2}>
            <AlertIcon />
            {requireAuth}
          </Alert>
        )}
        {error && (
          <Alert status="error" mb={2}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <form onSubmit={this.handleSubmit}>
          <Stack spacing={3}>
            <FormControl>
              <Input
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
                id="username-input"
                variant="filled"
                type="text"
                placeholder="username"
                size="md"
                isRequired
              />
            </FormControl>
            <FormControl>
              <Input
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                id="password-input"
                variant="filled"
                type="password"
                placeholder="password"
                size="md"
                isRequired
              />
            </FormControl>
            <Button type="submit" isLoading={isLoading || null}>
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    );
  }
}

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['LOGIN'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startLogin: (username, password) => dispatch(startLogin(username, password)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginPage)
);
