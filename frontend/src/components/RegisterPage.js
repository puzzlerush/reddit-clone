import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, useHistory, useLocation } from 'react-router-dom';
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

const RegisterPage = (props) => {
  const history = useHistory();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [doNotMatchError, setDoNotMatchError] = useState('');

  useEffect(() => {
    setDoNotMatchError('');
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { startRegister } = props;
      if (password !== confirmPassword) {
        return setDoNotMatchError('Passwords do not match');
      }
      await startRegister(username, password);
      const { error } = props;
      if (!error) {
        history.push(
          (location && location.state && location.state.prevPathname) || '/'
        );
      }
    } catch (e) {}
  };

  const { isLoading, error } = props;
  return (
    <Box w={300} m="auto">
      {error && (
        <Alert status="error" mb={2}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
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
};

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
