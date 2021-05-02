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
import { editComment, editPost } from '../actions';
import { createLoadingAndErrorSelector } from '../selectors';

const EditBox = ({
  type = 'post',
  id,
  initialText,
  onClose,
  isLoading,
  error,
  editPost,
  editComment,
}) => {
  const [value, setValue] = useState(initialText);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === 'post') {
      await editPost({ id, body: value });
    } else {
      await editComment({ id, body: value });
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
  editPost: ({ id, body }) => dispatch(editPost({ id, body })),
  editComment: ({ id, body }) => dispatch(editComment({ id, body })),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBox);
