import { useState } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  HStack,
  FormControl,
  FormErrorMessage,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { startEditComment, startEditPost } from '../actions';
import { createLoadingAndErrorSelector } from '../selectors';

const EditBox = ({
  type = 'post',
  id,
  initialText,
  onClose,
  isLoading,
  error,
  startEditPost,
  startEditComment,
}) => {
  const [value, setValue] = useState(initialText);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'post') {
      await startEditPost({ id, body: value });
    } else {
      await startEditComment({ id, body: value });
    }
    if (!error && onClose && type === 'post') {
      onClose();
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3} isInvalid={!!error}>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <HStack>
          <Button
            isDisabled={value === initialText}
            isLoading={isLoading}
            type="submit"
          >
            save
          </Button>
          <Button onClick={onClose}>cancel</Button>
        </HStack>
      </form>
    </Box>
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['EDIT_POST', 'EDIT_COMMENT'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startEditPost: ({ id, body }) => dispatch(startEditPost({ id, body })),
  startEditComment: ({ id, body }) => dispatch(startEditComment({ id, body })),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBox);
