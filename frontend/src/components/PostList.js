import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import Post from './Post';
import { createLoadingAndErrorSelector, postListSelector } from '../selectors';
import { getPostList } from '../actions/postList';

const PostList = ({
  isLoading,
  error: { message, response },
  postList,
  getPostList,
}) => {
  useEffect(() => {
    getPostList();
  }, []);

  const error = !!message;
  if (isLoading) {
    return null;
  } else if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {(response && response.data && response.data.error) || message}
      </Alert>
    );
  }
  return (
    <Box>
      {postList.map(
        ({
          id,
          type,
          title,
          body,
          created_at,
          votes,
          number_of_comments,
          author_name,
          subreddit_name,
        }) => (
          <Box my={4}>
            <Post
              id={id}
              type={type}
              subreddit={subreddit_name}
              author={author_name}
              createdAt={created_at}
              title={title}
              body={body}
              numComments={parseInt(number_of_comments, 10)}
              numVotes={parseInt(votes, 10)}
            />
          </Box>
        )
      )}
    </Box>
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector([
  'GET_POST_LIST',
]);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
  postList: postListSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getPostList: () => dispatch(getPostList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostList);
