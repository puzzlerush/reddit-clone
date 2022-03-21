// Because action has type string it could be any string, and it can handled using regular expressions.
// redux-toolkit doesn't allow that kind of design so I have to get rid of that

const loadingReducer = (state = {}, action) => {
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestStatus] = matches;

  return {
    ...state,
    [requestName]: requestStatus === 'REQUEST',
  };
};

export default loadingReducer;
