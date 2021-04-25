import React from 'react';
import { connect } from 'react-redux';
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

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const { startLogin } = this.props;
    startLogin(username, password);
  };

  render() {
    const { username, password } = this.state;
    const {
      isLoading,
      error: { message, response },
    } = this.props;
    const error = !!message;
    return (
      <Box w={300} m="auto">
        {error && (
          <Alert status="error" mb={2}>
            <AlertIcon />
            {response ? response.data.error : message}
          </Alert>
        )}
        <form onSubmit={this.handleSubmit}>
          <FormControl>
            <Stack spacing={3}>
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
              <Button type="submit" isLoading={isLoading || null}>
                Login
              </Button>
            </Stack>
          </FormControl>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
