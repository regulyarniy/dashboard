import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeEvery, delay, all } from 'redux-saga/effects';
import { nanoid } from 'nanoid';
import { MessageType } from '../../constants';

const messagesSlice = createSlice({
  name: `messages`,
  initialState: [],
  reducers: {
    push(state, action) {
      const { message, type, id } = action.payload;
      state.push({ message, type, id });
    },
    remove(state, action) {
      const { id } = action.payload;
      return state.filter(m => m.id !== id);
    },
    create() {
      // payload: { message, type }
    },
    createWarning() {
      // payload: message
    },
    createError() {
      // payload: message
    },
    createNeutral() {
      // payload: message
    },
    createSuccess() {
      // payload: message
    }
  }
});

const { push, remove, create, createWarning, createError, createNeutral, createSuccess } = messagesSlice.actions;

const TIMEOUT_IN_MS = 10000;

function* createMessage(action) {
  const { message, type = MessageType.NEUTRAL } = action.payload;
  const id = `message-${nanoid()}`;
  yield put(push({ message, type, id }));
  yield call(deleteMessageAfterTimeout, id);
}

function* createWarningMessage(action) {
  yield call(createMessage, {
    ...action,
    payload: { message: action.payload, type: MessageType.WARNING }
  });
}

function* createErrorMessage(action) {
  yield call(createMessage, {
    ...action,
    payload: { message: action.payload, type: MessageType.ERROR }
  });
}

function* createSuccessMessage(action) {
  yield call(createMessage, {
    ...action,
    payload: { message: action.payload, type: MessageType.SUCCESS }
  });
}

function* createNeutralMessage(action) {
  yield call(createMessage, {
    ...action,
    payload: { message: action.payload, type: MessageType.NEUTRAL }
  });
}

function* deleteMessageAfterTimeout(id) {
  yield delay(TIMEOUT_IN_MS);
  yield put(remove({ id }));
}

export function* messagesSaga() {
  yield all([
    yield takeEvery(create.type, createMessage),
    yield takeEvery(createError.type, createErrorMessage),
    yield takeEvery(createNeutral.type, createNeutralMessage),
    yield takeEvery(createSuccess.type, createSuccessMessage),
    yield takeEvery(createWarning.type, createWarningMessage)
  ]);
}

export const messagesActions = messagesSlice.actions;

export default messagesSlice.reducer;
