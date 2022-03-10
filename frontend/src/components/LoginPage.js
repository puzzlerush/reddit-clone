import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
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

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['LOGIN'],
  false
);

const LoginPage = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(startLogin(username, password));
    if (!error) {
      history.push(
        (location && location.state && location.state.prevPathname) || '/'
      );
    }
  };

  const requireAuth = location && location.state && location.state.requireAuth;

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
          <Button type="submit" isLoading={isLoading || null}>
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
