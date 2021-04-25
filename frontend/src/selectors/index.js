export const createLoadingSelector = (requestNames) => (state) => {
  const entries = Object.entries(state.loading);
  const loading = entries.length === 0
    || entries.filter(([key]) => requestNames.includes(key))
      .some(([, value]) => value);
  return loading;
};

export const createErrorSelector = (requestNames) => (state) => {
  const entries = Object.entries(state.error);
  const error = entries.length > 0
    && entries.filter(([key]) => requestNames.includes(key))[0][1];
  return error;
};

export const createLoadingAndErrorSelector = (requestNames) => {
  const loadingSelector = createLoadingSelector(requestNames);
  const errorSelector = createErrorSelector(requestNames);
  return { loadingSelector, errorSelector };
};

export const postSelector = (state) => state.post;

export const commentsSelector = (state) => state.comments;