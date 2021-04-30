import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Flex, Text, Heading, Alert, AlertIcon } from '@chakra-ui/react';
import Post from './Post';
import CommentsThread from './CommentsThread';
import WriteCommentBox from './WriteCommentBox';
import LoginAndRegisterButtons from './LoginAndRegisterButtons';
import {
  createLoadingAndErrorSelector,
  postSelector,
  commentsSelector,
  userSelector,
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
  user,
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
  const {
    id: post_id,
    type,
    subreddit_name,
    author_name,
    created_at,
    title,
    body,
    votes,
  } = post;
  const numComments = comments.length;

  const rootComments = getCommentsWithChildren(comments);
  return (
    <Box>
      <Post
        id={post_id}
        type={type}
        subreddit={subreddit_name}
        author={author_name}
        createdAt={created_at}
        title={title}
        body={body}
        numComments={numComments}
        numVotes={votes}
      />
      <br />
      {user ? (
        <Box>
          <Box m={2}>
            <Text as="span" color="gray.500">
              {'Comment as '}
            </Text>
            <Text as="span">{user.username}</Text>
          </Box>
          <WriteCommentBox postId={post_id} parentCommentId={null} />
        </Box>
      ) : (
        <Flex
          p={5}
          border="1px"
          borderRadius={5}
          borderColor="gray.500"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading size="md" color="gray.500">
            Log in or register to leave a comment
          </Heading>
          <LoginAndRegisterButtons />
        </Flex>
      )}
      <br />
      <CommentsThread comments={rootComments} />
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
  user: userSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getPostAndComments: (id) => dispatch(getPostAndComments(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsPage);
