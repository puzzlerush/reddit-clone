import axios from '../axios-config';

export const login = (user, token) => ({
  type: 'LOGIN',
  user,
  token,
});

export const logout = () => ({ type: 'LOGOUT' });

export const startLogin = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });
    const response = await axios.post('/users/login', {
      username,
      password,
    });
    const { user, token } = response.data;
    dispatch(login(user, token));
    dispatch({ type: 'LOGIN_SUCCESS' });
  } catch (e) {
    dispatch({
      type: 'LOGIN_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};
