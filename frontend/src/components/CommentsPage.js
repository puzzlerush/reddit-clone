import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import Post from './Post';
import Comment from './Comment';
import { createLoadingAndErrorSelector, postSelector, commentsSelector } from '../selectors';
import { getPostAndComments } from '../actions';

const CommentsPage = ({ isLoading, error, post, comments, getPostAndComments }) => {
  useEffect(() => {
    getPostAndComments(1);
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

  const commentsToDisplay = comments.map(({ body, created_at, author_name, votes }, idx) => (
    <Box my={2} ml={idx*4}>
      <Comment
        my={2}
        body={body}
        createdAt={created_at}
        author={author_name}
        numVotes={votes}
      />
    </Box>

  ));

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
      {commentsToDisplay}
    </Box>
  );
}

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(['GET_POST_AND_COMMENTS']);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
  post: postSelector(state),
  comments: commentsSelector(state)
});

const mapDispatchToProps = (dispatch) => ({
  getPostAndComments: (id) => dispatch(getPostAndComments(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsPage);