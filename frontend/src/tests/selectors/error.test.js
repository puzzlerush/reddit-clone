import { createErrorSelector } from '../../selectors';

const state = {
  error: {
    GET_SUBREDDITS: {},
    GET_POST_LIST: {},
    GET_POST_AND_COMMENTS: {},
    LOGOUT: {},
    LOGIN: {
      message: 'Request failed with status code 401',
      response: { data: { error: 'Username or password was incorrect' } },
    },
  },
};

const emptyState = {
  error: {},
};

it('created selector should return an error message if any of the action types passed in failure', () => {
  const errorSelector = createErrorSelector(['LOGIN']);
  expect(errorSelector(state)).toBe(state.error.LOGIN.response.data.error);
});

it('created selector should return falsy value if none of the action types passed in are in failure', () => {
  const errorSelector = createErrorSelector(['GET_SUBREDDITS']);
  expect(errorSelector(state)).toBeFalsy();
});

it('created selector should return false if the error state is empty', () => {
  const errorSelector = createErrorSelector(['GET_SUBREDDITS']);
  expect(errorSelector(emptyState)).toBe(false);
});
