import 'regenerator-runtime/runtime';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

// используется в тестах для получения чистого стора
export const makeStore = (middleware = []) =>
  configureStore({
    reducer: rootReducer,
    middleware
  });

const store = makeStore([...getDefaultMiddleware(), sagaMiddleware]);

sagaMiddleware.run(rootSaga);

export default store;
