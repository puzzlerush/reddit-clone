import axios from '../axios-config';
import { subredditsSelector } from '../selectors';

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

export const createSubreddit = (name, description) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: 'CREATE_SUBREDDIT_REQUEST' });
    const response = await axios.post('/subreddits', { name, description });
    dispatch(
      setSubreddits(subredditsSelector(getState()).concat(response.data))
    );
    dispatch({ type: 'CREATE_SUBREDDIT_SUCCESS' });
    return response.data;
  } catch (e) {
    dispatch({
      type: 'CREATE_SUBREDDIT_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};
