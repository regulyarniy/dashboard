import { combineReducers } from 'redux';
import messages from './messages/messages';
import eaist from './eaist/eaist';
import hints from './hints/hints';
import logs from './logs/logs';
import config from './config/config';

export default combineReducers({
  messages,
  eaist,
  hints,
  logs,
  config
});
