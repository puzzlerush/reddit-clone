import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import loadingReducer from '../reducers/loading';
import errorReducer from '../reducers/error';
import postReducer from '../reducers/post';
import postListReducer from '../reducers/postList';
import commentsReducer from '../reducers/comments';
import { saveState } from '../localStorage';
import subredditsReducer from '../reducers/subreddits';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  devTools: true,
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    error: errorReducer,
    post: postReducer,
    postList: postListReducer,
    comments: commentsReducer,
    subreddits: subredditsReducer,
  },
  middleware: [thunk],
});

store.subscribe(() => {
  saveState(store.getState().auth, 'authState');
});

export default store;
