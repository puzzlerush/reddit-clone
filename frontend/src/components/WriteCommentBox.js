import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  Box,
  HStack,
  FormControl,
  FormErrorMessage,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { userSelector, createLoadingAndErrorSelector } from '../selectors';
import { submitComment } from '../actions/comments';

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['SUBMIT_COMMENT'],
  false
);
const WriteCommentBox = (props) => {
  const dispatch = useDispatch();
  const [body, setBody] = useState('');
  const [hasError, setHasError] = useState(false);
  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const user = useSelector(userSelector);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { postId, parentCommentId, onClose } = props;
    await dispatch(
      submitComment({
        body,
        post_id: postId,
        parent_comment_id: parentCommentId,
      })
    );
    setBody('');
    if (error) {
      setHasError(true);
    }
    if (!error && onClose) {
      onClose();
    }
  };

  const { type = 'comment', onClose } = props;
  const isReply = type === 'reply';
  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3} isInvalid={error && hasError}>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            variant="filled"
            isDisabled={!user}
            placeholder="what are your thoughts?"
            rows={5}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <HStack>
          <Button isDisabled={!body} isLoading={isLoading} type="submit">
            {type}
          </Button>
          {isReply && onClose && <Button onClick={onClose}>cancel</Button>}
        </HStack>
      </form>
    </Box>
  );
};

export default WriteCommentBox;
