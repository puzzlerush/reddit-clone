const commentsReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return action.comments;
    case 'UPDATE_COMMENT':
      return state.map((comment) =>
        comment.id === action.id ? { ...comment, ...action.updates } : comment
      );
    case 'DELETE_COMMENT':
      const deletedFields = { body: null, author_name: null };
      return state.map((comment) =>
        comment.id === action.id ? { ...comment, ...deletedFields } : comment
      );
    default:
      return state;
  }
};

export default commentsReducer;
