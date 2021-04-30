import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import loadingReducer from '../reducers/loading';
import errorReducer from '../reducers/error';
import postReducer from '../reducers/post';
import postListReducer from '../reducers/postList';
import commentsReducer from '../reducers/comments';
import { saveState } from '../localStorage';
import subredditsReducer from '../reducers/subreddits';

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const configureStore = () => {
  const rootReducer = combineReducers({
    auth: authReducer,
    loading: loadingReducer,
    error: errorReducer,
    post: postReducer,
    postList: postListReducer,
    comments: commentsReducer,
    subreddits: subredditsReducer,
  });

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

  store.subscribe(() => {
    saveState(store.getState().auth, 'authState');
  });

  return store;
};

const store = configureStore();

export default store;
