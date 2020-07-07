import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import { HintsSorting } from '../../constants';
import { getHintById, getHints, updateHintById } from '../../services/api/hints';
import { messagesActions } from '../messages/messages';
import templateReducers from '../templateReducers';

const initialState = {
  items: [],
  isLoading: false,
  count: 0,
  offset: 0,
  loadingIds: []
};

const updateByIdTemplate = (state, action) => {
  const { id } = action.payload;
  const oldItem = state.items.find(i => i.id === id);
  if (oldItem) {
    const index = state.items.indexOf(oldItem);
    state.items[index] = action.payload;
  } else {
    state.items.push(action.payload);
  }
  state.loadingIds = state.loadingIds.filter(i => i !== id);
};

const hintsSlice = createSlice({
  name: `hints`,
  initialState,
  reducers: {
    request: templateReducers.startLoad,
    requestSuccess: templateReducers.successLoadItems,
    requestFail: templateReducers.stopLoad,
    requestById: templateReducers.startLoadById,
    requestByIdSuccess: updateByIdTemplate,
    requestByIdFail: templateReducers.stopLoadById,
    updateById: templateReducers.startLoadById,
    updateByIdSuccess: updateByIdTemplate,
    updateByIdFail: templateReducers.stopLoadById,
    reset() {
      return { ...initialState };
    },
    setStateForTests: templateReducers.setStateForTests
  }
});

const {
  request,
  requestSuccess,
  requestFail,
  requestById,
  requestByIdSuccess,
  requestByIdFail,
  updateById,
  updateByIdSuccess,
  updateByIdFail
} = hintsSlice.actions;

function* fetchHints(action) {
  const {
    offset = 0,
    sortBy = HintsSorting.MODULE,
    sortAsc = false,
    moduleContains = null,
    pageContains = null,
    fieldContains = null,
    textContains = null,
    onlyArchived = null
  } = action.payload;

  const { response, error } = yield call(getHints, {
    offset,
    sortBy,
    sortAsc,
    moduleContains,
    pageContains,
    fieldContains,
    textContains,
    onlyArchived
  });

  if (!error) {
    yield put(requestSuccess(response));
  } else {
    yield put(requestFail());
    yield put(messagesActions.createError(`Ошибка запроса списка подсказок. Детали: ${error && error.message}`));
  }
}

function* fetchHintById(action) {
  const { id } = action.payload;

  const { response, error } = yield call(getHintById, { id });

  if (!error) {
    yield put(requestByIdSuccess(response));
  } else {
    yield put(requestByIdFail({ id }));
    yield put(messagesActions.createError(`Ошибка запроса подсказки. Детали: ${error && error.message}`));
  }
}

function* editHintById(action) {
  const { id, text, icon } = action.payload;

  const { response, error } = yield call(updateHintById, { id, text, icon });

  if (!error) {
    yield put(updateByIdSuccess(response));
    yield put(messagesActions.createSuccess(`Подсказка обновлена.`));
  } else {
    yield put(updateByIdFail({ id }));
    yield put(messagesActions.createError(`Ошибка обновления подсказки. Детали: ${error && error.message}`));
  }
}

export function* hintsSaga() {
  yield all([
    takeLatest(request, fetchHints),
    takeEvery(requestById, fetchHintById),
    takeEvery(updateById, editHintById)
  ]);
}

export const hintsActions = hintsSlice.actions;

export default hintsSlice.reducer;
