import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
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

const CreateSubredditPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);

  const isNameValid = (name) => {
    const nameRegex = new RegExp('^[a-z0-9]+$', 'i');
    return nameRegex.test(name);
  };

  const handleSubmit = async ({ name, description }) => {
    try {
      const { name: subredditName } = await dispatch(
        createSubreddit(name, description)
      );
      navigate(`/r/${subredditName}`);
    } catch (e) {
      throw new Error(e);
    }
  };

  return (
    <Box w={['100%', '90%', '80%', '70%']} m="auto">
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Formik
        onSubmit={handleSubmit}
        initialValues={{ name: '', description: '' }}
      >
        {({ values, handleSubmit, handleChange, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Stack>
              <FormControl
                isInvalid={values.name.length > 0 && !isNameValid(values.name)}
              >
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
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
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  variant="filled"
                  rows={5}
                  placeholder="description (optional)"
                />
              </FormControl>
              <Button
                isLoading={isLoading}
                type="submit"
                isDisabled={!isNameValid(values.name) || isSubmitting}
              >
                create
              </Button>
            </Stack>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['CREATE_SUBREDDIT'],
  false
);

export default CreateSubredditPage;
