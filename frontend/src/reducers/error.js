const errorReducer = (state = {}, action) => {
  const { type, message } = action;
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestStatus] = matches;

  return {
    ...state,
    [requestName]: requestStatus === 'FAILURE' ? message : ''
  };
};

export default errorReducer;