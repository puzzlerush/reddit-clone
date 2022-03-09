import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Alert,
  AlertIcon,
  Heading,
  Text,
  CircularProgress,
} from '@chakra-ui/react';
import Post from './Post';
import { createLoadingAndErrorSelector, postListSelector } from '../selectors';
import { getPostList } from '../actions/postList';

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector([
  'GET_POST_LIST',
]);

const PostList = () => {
  const { subreddit } = useParams();
  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const postList = useSelector(postListSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPostList({ subreddit }));
  }, [getPostList, subreddit]);

  if (isLoading) {
    return (
      <Flex m={10} justifyContent="center" alignItems="center">
        <CircularProgress isIndeterminate />
      </Flex>
    );
  } else if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }
  return (
    <Box>
      <Heading>{subreddit ? `r/${subreddit}` : 'Home'}</Heading>
      {postList.length > 0 ? (
        postList.map(
          ({
            id,
            type,
            title,
            body,
            created_at,
            votes,
            has_voted,
            number_of_comments,
            author_name,
            subreddit_name,
          }) => (
            <Box key={`${id}-${title}`} my={4}>
              <Post
                id={id}
                type={type}
                subreddit={subreddit_name}
                author={author_name}
                createdAt={created_at}
                title={title}
                body={body}
                numComments={number_of_comments}
                numVotes={votes}
                hasVoted={has_voted}
              />
            </Box>
          )
        )
      ) : (
        <Text m={5}>There are no posts to display.</Text>
      )}
    </Box>
  );
};

export default PostList;
