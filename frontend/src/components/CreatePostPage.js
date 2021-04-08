import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Stack,
  Input, Button, Text,
  Textarea, Radio, RadioGroup
} from '@chakra-ui/react';
import axios from '../config/axios';

const CreatePostPage = () => {
  const [postType, setPostType] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subreddit, setSubreddit] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  let history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/posts', { type: postType, title, body, subreddit });
      history.push(`/posts/${response.data.id}`);
    } catch (e) {
      setLoading(false);
      setMessage('An error occurred when submitting your post.');
    }
  }

  useEffect(() => {
    setMessage('');
  }, [postType, title, body]);

  return (
    <Box m='auto' marginTop={10} maxWidth={700}>
      <form onSubmit={handleSubmit}>
        <RadioGroup
          onChange={setPostType}
          value={postType}
          m={2}
        >
          <Stack direction='row'>
            <Radio value='text'>text</Radio>
            <Radio value='link'>link</Radio>
          </Stack>
        </RadioGroup>
        <Stack spacing={3}>
          <Input
            variant='filled'
            type="text"
            placeholder="title"
            size='lg'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {postType === 'text' ? (
            <Textarea
              variant='filled'
              size='lg'
              placeholder='text (optional)'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
            />
          ) : (
            <Input
              variant='filled'
              type='text'
              placeholder="url"
              size='lg'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          )}
          <Input
              variant='filled'
              type='text'
              placeholder="subreddit"
              size='lg'
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              required
            />
          <Button
            type="submit"
            isLoading={loading || null}
            loadingText='Submitting'
          >
            Submit
          </Button>
        </Stack>
        <Box p={2}>
          <Text color='red'>{message}</Text>
        </Box>
      </form>
    </Box>
  );
};

export default CreatePostPage;