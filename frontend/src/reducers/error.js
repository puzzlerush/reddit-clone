const errorReducer = (state = {}, action) => {
  const { type, message, response } = action;
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestStatus] = matches;

  return {
    ...state,
    [requestName]: requestStatus === 'FAILURE' ? { message, response } : {},
  };
};

export default errorReducer;
