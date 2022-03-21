import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
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
  const [hasError, setHasError] = useState(false);
  const isLoading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const user = useSelector(userSelector);

  const handleSubmit = async (values, { resetForm }) => {
    const { postId, parentCommentId, onClose } = props;
    await dispatch(
      submitComment({
        body: values.comment,
        post_id: postId,
        parent_comment_id: parentCommentId,
      })
    );
    if (error) {
      setHasError(true);
    }
    if (!error && onClose) {
      onClose();
    }
    resetForm();
  };

  const { type = 'comment', onClose } = props;
  const isReply = type === 'reply';
  return (
    <Box>
      <Formik initialValues={{ comment: '' }} onSubmit={handleSubmit}>
        {({ values, handleSubmit, handleChange, handleBlur, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <FormControl mb={3} isInvalid={error && hasError}>
              <Textarea
                name="comment"
                value={values.comment}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="filled"
                isDisabled={!user}
                placeholder="what are your thoughts?"
                rows={5}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <HStack>
              <Button
                isDisabled={isSubmitting}
                isLoading={isLoading}
                type="submit"
              >
                {type}
              </Button>
              {isReply && onClose && <Button onClick={onClose}>cancel</Button>}
            </HStack>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default WriteCommentBox;
