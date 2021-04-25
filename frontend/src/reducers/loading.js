const loadingReducer = (state = {}, action) => {
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestStatus] = matches;

  return {
    ...state,
    [requestName]: requestStatus === 'REQUEST'
  };
};

export default loadingReducer;