import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Alert, AlertIcon } from '@chakra-ui/react';
import Post from './Post';
import CommentsThread from './CommentsThread';
import {
  createLoadingAndErrorSelector,
  postSelector,
  commentsSelector,
} from '../selectors';
import { getPostAndComments } from '../actions';

const getCommentsWithChildren = (comments) => {
  const commentsWithChildren = comments.map((comment) => ({
    ...comment,
    children: [],
  }));
  commentsWithChildren.forEach((childComment) => {
    const { parent_comment_id } = childComment;
    if (parent_comment_id) {
      const parent = commentsWithChildren.find(
        (comment) => parent_comment_id === comment.id
      );
      parent.children = parent.children.concat(childComment);
    }
  });
  return commentsWithChildren.filter(
    ({ parent_comment_id }) => parent_comment_id === null
  );
};

const CommentsPage = ({
  isLoading,
  error: { message, response },
  post,
  comments,
  getPostAndComments,
}) => {
  const { id } = useParams();

  useEffect(() => {
    getPostAndComments(id);
  }, []);

  const error = !!message;
  if (isLoading) {
    return null;
  } else if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {response.data.error || message}
      </Alert>
    );
  }
  const { subreddit_name, author_name, created_at, title, body, votes } = post;
  const numComments = comments.length;

  const rootComments = getCommentsWithChildren(comments);
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
      <CommentsThread comments={rootComments} indent={0} />
    </Box>
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector([
  'GET_POST_AND_COMMENTS',
]);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
  post: postSelector(state),
  comments: commentsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getPostAndComments: (id) => dispatch(getPostAndComments(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsPage);
