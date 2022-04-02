import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { createErrorSelector } from '../selectors';
import { startDeletePost, startDeleteComment } from '../actions';

const DeleteButton = ({ type = 'post', id }) => {
  const dispatch = useDispatch();
  const error = useSelector(errorSelector);
  const [hasError, setHasError] = useState(error);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setHasError(error);
    }
    return () => {
      isMounted = false;
    };
  }, [error]);

  const handleClick = async () => {
    setIsLoading(true);
    if (type === 'post') {
      await dispatch(startDeletePost(id));
    } else {
      await dispatch(startDeleteComment(id));
    }

    if (!hasError) {
      setIsLoading(false);
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      isLoading={isLoading}
      backgroundColor="inherit"
      icon={<DeleteIcon />}
    />
  );
};

const errorSelector = createErrorSelector(
  ['DELETE_POST', 'DELETE_COMMENT'],
  false
);

export default DeleteButton;
