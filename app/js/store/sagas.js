import { all } from 'redux-saga/effects';
import { messagesSaga } from './messages/messages';
import { eaistSaga } from './eaist/eaist';
import { hintsSaga } from './hints/hints';
import { logsSaga } from './logs/logs';
import { configSaga } from './config/config';

export default function* rootSaga() {
  yield all([messagesSaga(), eaistSaga(), hintsSaga(), logsSaga(), configSaga()]);
}
