const postReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_POST':
      return action.post;
    default:
      return state;
  }
}

export default postReducer;