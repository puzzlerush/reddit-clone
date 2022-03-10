import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Heading,
  Alert,
  AlertIcon,
  CircularProgress,
} from '@chakra-ui/react';
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
    ({ parent_comment_id, body, children }) =>
      parent_comment_id === null && (body !== null || children.length > 0)
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector([
  'GET_POST_AND_COMMENTS',
]);

const CommentsPage = () => {
  const { id } = useParams();
  useEffect(() => {
    dispatch(getPostAndComments(id));
  }, [getPostAndComments, id]);

  const dispatch = useDispatch();
  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const post = useSelector(postSelector);
  const comments = useSelector(commentsSelector);
  const user = useSelector(userSelector);

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
  const {
    id: post_id,
    type,
    subreddit_name,
    author_name,
    created_at,
    title,
    body,
    votes,
    has_voted,
  } = post;
  const numComments = comments.filter(({ body }) => body !== null).length;

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
        hasVoted={has_voted}
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

export default CommentsPage;
