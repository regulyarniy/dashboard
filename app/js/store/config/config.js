import { createSlice } from '@reduxjs/toolkit';
import templateReducers from '../templateReducers';
import { getConfig } from '../../services/api/config';
import { put, call, all, takeLatest } from 'redux-saga/effects';
import { messagesActions } from '../messages/messages';

const initialState = {
  isLoading: false,
  isLoaded: false,
  modulesStructure: {}
};

const configSlice = createSlice({
  name: `config`,
  initialState,
  reducers: {
    request: templateReducers.startLoad,
    requestSuccess(state, action) {
      const { modulesStructure } = action.payload;
      return { ...state, isLoading: false, isLoaded: true, modulesStructure };
    },
    requestFail: templateReducers.stopLoad,
    reset() {
      return { ...initialState };
    },
    setStateForTests: templateReducers.setStateForTests
  }
});

const { request, requestSuccess, requestFail } = configSlice.actions;

function* fetchConfig() {
  const { response, error } = yield call(getConfig);

  if (!error) {
    yield put(requestSuccess({ modulesStructure: response }));
  } else {
    yield put(requestFail());
    yield put(messagesActions.createError(`Ошибка запроса контекста модуля. Детали: ${error && error.message}`));
  }
}

export function* configSaga() {
  yield all([takeLatest(request, fetchConfig)]);
}

export const configActions = configSlice.actions;

export default configSlice.reducer;
