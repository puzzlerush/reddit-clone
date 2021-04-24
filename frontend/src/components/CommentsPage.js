import { useState, useEffect } from 'react';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import Post from './Post';
import Comment from './Comment';
import axios from '../axios-config';

const CommentsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setIsLoading(true);
        // Hard-code the post id for now
        const response = await axios.get('/comments/1');
        console.log(response.data);
        setPost(response.data.post);
        setComments(response.data.comments);
      } catch (e) {
        setError(e.message);
      }
      setIsLoading(false);
    };
    fetchPostAndComments();
  }, []);

  if (isLoading) {
    return null;
  } else if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }
  const { subreddit_name, author_name, created_at, title, body, votes } = post;
  const numComments = comments.length;
  return (
    <Box>
      <Post
        subreddit={subreddit_name}
        author={author_name}
        createdAt={created_at}
        title={title}
        body={body}
        numComments={numComments}
        numVotes={votes}
      />
      <br />
      <Comment
        body="this is a story all about how my life got flipped turned upside down"
        createdAt={created_at}
        author={author_name}
        numVotes={5}
      />
    </Box>
  );
}

export default CommentsPage;