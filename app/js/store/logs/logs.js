import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { LogsSorting } from '../../constants';
import { messagesActions } from '../messages/messages';
import templateReducers from '../templateReducers';
import { getLogs } from '../../services/api/logs';

const initialState = {
  items: [],
  isLoading: false,
  count: 0,
  offset: 0
};

const logsSlice = createSlice({
  name: `logs`,
  initialState,
  reducers: {
    request: templateReducers.startLoad,
    requestSuccess: templateReducers.successLoadItems,
    requestFail: templateReducers.stopLoad,
    reset() {
      return { ...initialState };
    },
    setStateForTests: templateReducers.setStateForTests
  }
});

const { request, requestSuccess, requestFail } = logsSlice.actions;

const adaptLog = log => {
  const [module, page, field] = log.hintId.split(`:`);
  return { ...log, module, page, field };
};

function* fetchLogs(action) {
  const {
    offset = 0,
    sortBy = LogsSorting.CHANGE_DATE,
    sortAsc = false,
    moduleContains = null,
    pageContains = null,
    fieldContains = null,
    userNameContains = null,
    actionTypes = null,
    actionDateBegin = null,
    actionDateEnd = null
  } = action.payload;

  const { response, error } = yield call(getLogs, {
    offset,
    sortBy,
    sortAsc,
    moduleContains,
    pageContains,
    fieldContains,
    userNameContains,
    actionTypes,
    actionDateBegin,
    actionDateEnd
  });

  if (!error) {
    yield put(requestSuccess({ ...response, items: response.items.map(adaptLog) }));
  } else {
    yield put(requestFail());
    yield put(messagesActions.createError(`Ошибка запроса списка истории. Детали: ${error && error.message}`));
  }
}

export function* logsSaga() {
  yield all([takeLatest(request, fetchLogs)]);
}

export const logsActions = logsSlice.actions;

export default logsSlice.reducer;
