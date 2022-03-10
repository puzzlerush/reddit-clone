import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
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

const RegisterPage = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [doNotMatchError, setDoNotMatchError] = useState('');

  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);

  useEffect(() => {
    setDoNotMatchError('');
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (password !== confirmPassword) {
        return setDoNotMatchError('Passwords do not match');
      }
      await dispatch(startRegister(username, password));
      if (!error) {
        history.push(
          (location && location.state && location.state.prevPathname) || '/'
        );
      }
    } catch (e) {}
  };

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

export default RegisterPage;
