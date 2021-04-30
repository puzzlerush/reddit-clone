import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Stack,
  FormControl,
  FormErrorMessage,
  Input,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { startRegister } from '../actions/auth';
import { createLoadingAndErrorSelector } from '../selectors';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      doNotMatchError: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { password, confirmPassword } = this.state;
    if (
      prevState.password !== password ||
      prevState.confirmPassword !== confirmPassword
    ) {
      this.setState({ doNotMatchError: '' });
    }
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { username, password, confirmPassword } = this.state;
      const { startRegister, history, location } = this.props;
      if (password !== confirmPassword) {
        return this.setState({ doNotMatchError: 'Passwords do not match' });
      }
      await startRegister(username, password);
      const { error } = this.props;
      if (!error) {
        history.push(
          (location && location.state && location.state.prevPathname) || '/'
        );
      }
    } catch (e) {}
  };

  render() {
    const { username, password, confirmPassword, doNotMatchError } = this.state;
    const { isLoading, error } = this.props;
    return (
      <Box w={300} m="auto">
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
            <FormControl isInvalid={doNotMatchError}>
              <Input
                value={confirmPassword}
                onChange={(e) =>
                  this.setState({ confirmPassword: e.target.value })
                }
                id="confirm-password-input"
                variant="filled"
                type="password"
                placeholder="confirm password"
                size="md"
                isRequired
              />
              <FormErrorMessage>{doNotMatchError}</FormErrorMessage>
            </FormControl>
            <Button type="submit" isLoading={isLoading}>
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    );
  }
}

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['REGISTER'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startRegister: (username, password) =>
    dispatch(startRegister(username, password)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
);
