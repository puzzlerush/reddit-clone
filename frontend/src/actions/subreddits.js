import axios from '../axios-config';

export const setSubreddits = (subreddits) => ({
  type: 'SET_SUBREDDITS',
  subreddits,
});

export const getSubreddits = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_SUBREDDITS_REQUEST' });
    const response = await axios.get('/subreddits');
    dispatch(setSubreddits(response.data));
    dispatch({ type: 'GET_SUBREDDITS_SUCCESS' });
  } catch (e) {
    dispatch({
      type: 'GET_SUBREDDITS_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};
