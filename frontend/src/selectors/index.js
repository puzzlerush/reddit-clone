export const createLoadingSelector = (requestNames, defaultLoading = true) => (
  state
) => {
  const entries = Object.entries(state.loading);
  const loading = entries
    .filter(([key]) => requestNames.includes(key))
    .some(([, value]) => value);
  return defaultLoading ? entries.length === 0 || loading : loading;
};

export const createErrorSelector = (requestNames) => (state) => {
  const entries = Object.entries(state.error);
  const error =
    entries.length > 0 && entries.filter(([key]) => requestNames.includes(key));
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
