import axios from 'axios';
import store from './store/configureStore';
import { tokenSelector } from './selectors';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

instance.interceptors.request.use((config) => {
  const token = tokenSelector(store.getState());
  config.headers.Authorization = token;
  return config;
});

export default instance;
