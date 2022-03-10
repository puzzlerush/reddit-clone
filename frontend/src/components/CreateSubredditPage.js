import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Stack,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { createLoadingAndErrorSelector } from '../selectors';
import { createSubreddit } from '../actions/subreddits';

const CreateSubredditPage = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);

  const isNameValid = (name) => {
    const nameRegex = new RegExp('^[a-z0-9]+$', 'i');
    return nameRegex.test(name);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name: subredditName } = await dispatch(
        createSubreddit(name, description)
      );
      history.push(`/r/${subredditName}`);
    } catch (e) {}
  };

  return (
    <Box w={['100%', '90%', '80%', '70%']} m="auto">
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack>
          <FormControl isInvalid={name.length > 0 && !isNameValid(name)}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="filled"
              placeholder="subreddit name"
              isRequired
            />
            <FormErrorMessage>
              Name can only contain alphanumeric characters
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="filled"
              rows={5}
              placeholder="description (optional)"
            />
          </FormControl>
          <Button
            isLoading={isLoading}
            type="submit"
            isDisabled={!isNameValid(name)}
          >
            create
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['CREATE_SUBREDDIT'],
  false
);

export default CreateSubredditPage;
