import { connect } from 'react-redux';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { createLoadingAndErrorSelector } from '../selectors';
import { startDeletePost } from '../actions';

const DeleteButton = ({
  type = 'post',
  isLoading,
  error,
  id,
  startDeletePost,
}) => {
  return (
    <IconButton
      onClick={() => startDeletePost(id)}
      isLoading={isLoading}
      backgroundColor="inherit"
      icon={<DeleteIcon />}
    />
  );
};

const { loadingSelector, errorSelector } = createLoadingAndErrorSelector(
  ['DELETE_POST'],
  false
);

const mapStateToProps = (state) => ({
  isLoading: loadingSelector(state),
  error: errorSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  startDeletePost: (id) => dispatch(startDeletePost(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteButton);
