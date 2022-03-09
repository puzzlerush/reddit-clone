import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  HStack,
  FormControl,
  FormErrorMessage,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { startEditComment, startEditPost } from '../actions';
import { createErrorSelector } from '../selectors';
const errorSelector = createErrorSelector(['EDIT_POST', 'EDIT_COMMENT']);

const EditBox = ({ type = 'post', id, initialText, onClose }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const error = useSelector(errorSelector);

  const hasError = useRef(error);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      hasError.current = error;
    }
    return () => {
      isMounted = false;
    };
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (type === 'post') {
      await dispatch(startEditPost({ id, body: value }));
    } else {
      await dispatch(startEditComment({ id, body: value }));
    }
    if (!hasError.current) {
      onClose();
    } else {
      setIsLoading(false);
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

export default EditBox;
