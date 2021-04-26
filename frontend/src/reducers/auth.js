import { loadState } from '../localStorage';

const initialState = loadState('authState') || {};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      const { user, token } = action;
      return { user, token };
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

export default authReducer;
