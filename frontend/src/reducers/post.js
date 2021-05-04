const postReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_POST':
      return action.post;
    case 'EDIT_POST':
      const { updates } = action;
      return { ...state, ...updates };
    case 'DELETE_POST':
      const deletedFields = { title: null, body: null, author_name: null };
      return { ...state, ...deletedFields };
    default:
      return state;
  }
};

export default postReducer;
