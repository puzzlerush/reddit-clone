import axios from '../axios-config';
import { commentsSelector } from '../selectors';

export const setComments = (comments) => ({
  type: 'SET_COMMENTS',
  comments,
});

export const updateComment = (id, updates) => ({
  type: 'UPDATE_COMMENT',
  id,
  updates,
});

export const deleteComment = (id) => ({
  type: 'DELETE_COMMENT',
  id,
});

export const submitComment = (commentDetails) => async (dispatch, getState) => {
  try {
    const { body, post_id, parent_comment_id } = commentDetails;
    dispatch({ type: 'SUBMIT_COMMENT_REQUEST' });
    const response = await axios.post('/comments', {
      body,
      post_id,
      parent_comment_id,
    });
    const comments = commentsSelector(getState());
    dispatch(setComments([response.data].concat(comments)));
    dispatch({ type: 'SUBMIT_COMMENT_SUCCESS' });
  } catch (e) {
    dispatch({
      type: 'SUBMIT_COMMENT_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};
