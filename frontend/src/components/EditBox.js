import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  HStack,
  FormControl,
  FormErrorMessage,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { editPost } from '../actions';
import { createLoadingAndErrorSelector } from '../selectors';

const EditBox = ({ id, initialText, onClose, isLoading, error, editPost }) => {
  const [value, setValue] = useState(initialText);
  const saveError = useRef(error);

  useEffect(() => {
    saveError.current = error;
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editPost({ id, body: value });
    if (!saveError.current) {
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
          <Button isLoading={isLoading} type="submit">
            save
          </Button>
          <Button onClick={onClose}>cancel</Button>
        </HStack>
      </form>
    </Box>
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['EDIT_POST'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  editPost: ({ id, body }) => dispatch(editPost({ id, body })),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBox);
