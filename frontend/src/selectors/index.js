export const createLoadingSelector = (requestNames, defaultLoading = true) => (
  state
) => {
  const entries = Object.entries(state.loading).filter(([key]) =>
    requestNames.includes(key)
  );
  const loading = entries.some(([, value]) => value);
  return defaultLoading ? entries.length === 0 || loading : loading;
};

export const createErrorSelector = (requestNames) => (state) => {
  const entries = Object.entries(state.error).filter(([key]) =>
    requestNames.includes(key)
  );
  if (entries[0]) {
    const { message, response } = entries[0][1];
    return (response && response.data && response.data.error) || message;
  } else {
    return false;
  }
};

export const createLoadingAndErrorSelector = (
  requestNames,
  defaultLoading = true
) => {
  const loadingSelector = createLoadingSelector(requestNames, defaultLoading);
  const errorSelector = createErrorSelector(requestNames);
  return { loadingSelector, errorSelector };
};

export const postSelector = (state) => state.post;

export const postListSelector = (state) => state.postList;

export const commentsSelector = (state) => state.comments;

export const userSelector = (state) => state.auth.user;

export const tokenSelector = (state) => state.auth.token;

export const subredditsSelector = (state) => state.subreddits;
