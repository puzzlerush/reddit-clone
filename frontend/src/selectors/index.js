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
  const error = entries.length > 0 && entries;
  return error[0] ? error[0][1] : false;
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

export const commentsSelector = (state) => state.comments;

export const userSelector = (state) => state.auth.user;

export const tokenSelector = (state) => state.auth.token;

export const subredditsSelector = (state) => state.subreddits;
