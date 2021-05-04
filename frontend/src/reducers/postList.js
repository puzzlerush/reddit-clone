const postListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_POST_LIST':
      return action.postList;
    case 'EDIT_POST':
      return state.map((post) =>
        post.id === action.id ? { ...post, ...action.updates } : post
      );
    case 'DELETE_POST':
      const deletedFields = { title: null, body: null, author_name: null };
      return state.map((post) =>
        post.id === action.id ? { ...post, ...deletedFields } : post
      );
    default:
      return state;
  }
};

export default postListReducer;
