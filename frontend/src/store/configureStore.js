import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import loadingReducer from '../reducers/loading';
import errorReducer from '../reducers/error';
import postReducer from '../reducers/post';
import commentsReducer from '../reducers/comments';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const configureStore = () => {
  const rootReducer = combineReducers({
    loading: loadingReducer,
    error: errorReducer,
    post: postReducer,
    comments: commentsReducer
  });

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};

export default configureStore;