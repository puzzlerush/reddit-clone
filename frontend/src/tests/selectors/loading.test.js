import { createLoadingSelector } from '../../selectors';

const state = {
  loading: {
    GET_SUBREDDITS: true,
    GET_POST_LIST: false,
    GET_POST_AND_COMMENTS: false,
  },
};

const emptyState = {
  loading: {},
};

it('created selector should return true if any of the action types passed in are in the request phase', () => {
  const loadingSelector = createLoadingSelector([
    'GET_SUBREDDITS',
    'GET_POST_LIST',
    'GET_POST_AND_COMMENTS',
  ]);
  expect(loadingSelector(state)).toBe(true);
});

it('created selector should return false if none of the action types passed in are in the request phase', () => {
  const loadingSelector = createLoadingSelector(['GET_POST_LIST']);
  expect(loadingSelector(state)).toBe(false);
});

it('created selector should return true when no requests have been initiated by default', () => {
  const loadingSelector = createLoadingSelector(['GET_POST_LIST']);
  expect(loadingSelector(emptyState)).toBe(true);
});

it('created selector should return false when no requests have been initiated if the default loading parameter is set to false', () => {
  const loadingSelector = createLoadingSelector(['SUBMIT_POST'], false);
  expect(loadingSelector(emptyState)).toBe(false);
});
