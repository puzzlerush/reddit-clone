import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Select,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  createLoadingAndErrorSelector,
  subredditsSelector,
} from '../selectors';
import { getSubreddits } from '../actions/subreddits';
import { submitPost } from '../actions/post';

const CreatePostPage = () => {
  const [postType, setPostType] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [subreddit, setSubreddit] = useState('');

  const srIsLoading = useSelector(srLoadingSelector);
  const srError = useSelector(srErrorSelector);
  const submitIsLoading = useSelector(submitLoadingSelector);
  const submitError = useSelector(submitErrorSelector);
  const subreddits = useSelector(subredditsSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSubreddits());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { id } = await dispatch(
        submitPost({
          type: postType,
          title,
          body: postType === 'text' ? body : url,
          subreddit,
        })
      );
      navigate(`/r/${subreddit}/comments/${id}`);
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <Box w={['100%', '90%', '80%', '70%']} m="auto">
      {submitError && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {submitError}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <FormControl>
            <RadioGroup
              value={postType}
              onChange={(postType) => setPostType(postType)}
            >
              <Stack direction="row" spacing={3}>
                <Radio value="text">text post</Radio>
                <Radio value="link">link</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
          <FormControl>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              variant="filled"
              placeholder="title"
              isRequired
            />
          </FormControl>
          <FormControl>
            {postType === 'text' ? (
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                variant="filled"
                placeholder="text (optional)"
                rows={10}
              />
            ) : (
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
                variant="filled"
                placeholder="url"
                required
              />
            )}
          </FormControl>
          <FormControl isInvalid={srError}>
            <Select
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              variant="filled"
              placeholder={srIsLoading ? 'loading...' : 'choose a subreddit'}
              isRequired
            >
              {subreddits.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Could not load subreddits</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            isLoading={srIsLoading || submitIsLoading || null}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

const { loadingSelector: srLoadingSelector, errorSelector: srErrorSelector } =
  createLoadingAndErrorSelector(['GET_SUBREDDITS']);

const {
  loadingSelector: submitLoadingSelector,
  errorSelector: submitErrorSelector,
} = createLoadingAndErrorSelector(['SUBMIT_POST'], false);

export default CreatePostPage;
