import axios from '../axios-config';

const setPost = (post) => ({
  type: 'SET_POST',
  post
});

const setComments = (comments) => ({
  type: 'SET_COMMENTS',
  comments
});

export const getPostAndComments = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'GET_POST_AND_COMMENTS_REQUEST' });
    const response = await axios.get(`/comments/${id}`);
    dispatch(setPost(response.data.post));
    dispatch(setComments(response.data.comments));
    dispatch({ type: 'GET_POST_AND_COMMENTS_SUCCESS' });
  } catch (e) {
    dispatch({ type: 'GET_POST_AND_COMMENTS_FAILURE', message: e.message });
  }
};