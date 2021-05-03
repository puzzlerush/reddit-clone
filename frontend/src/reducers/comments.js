const commentsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return action.comments;
    case 'UPDATE_COMMENT':
      const { id, updates } = action;
      return state.map((comment) =>
        comment.id === id ? { ...comment, ...updates } : comment
      );
    default:
      return state;
  }
};

export default commentsReducer;
