import axios from '../axios-config';

export const setPost = (post) => ({
  type: 'SET_POST',
  post,
});

export const submitPost = (postDetails) => async (dispatch) => {
  const { type, title, body, subreddit } = postDetails;
  try {
    dispatch({ type: 'SUBMIT_POST_REQUEST' });
    const response = await axios.post('/posts', {
      type,
      title,
      body,
      subreddit,
    });
    dispatch({ type: 'SUBMIT_POST_SUCCESS' });
    return response.data;
  } catch (e) {
    dispatch({
      type: 'SUBMIT_POST_FAILURE',
      message: e.message,
      respones: e.response,
    });
  }
};
