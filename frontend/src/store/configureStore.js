import { createStore, combineReducers } from 'redux'
import authReducer from '../reducers/auth';
import axios from '../config/axios';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

const persistedState = loadState();

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {}
}

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const configureStore = () => {
  const rootReducer = combineReducers({
    auth: authReducer
  });

  const store = createStore(
    rootReducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
  setAuthToken(store.getState().auth.token);
  store.subscribe(() => {
    const state = store.getState();
    saveState(state);
    setAuthToken(state.auth.token);
  });

  return store;
}

export default configureStore;