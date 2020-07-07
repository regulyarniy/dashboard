import { messagesActions } from './messages/messages';
import { eaistActions } from './eaist/eaist';
import { hintsActions } from './hints/hints';
import { logsActions } from './logs/logs';
import { configActions } from './config/config';

export default {
  messages: { ...messagesActions },
  eaist: { ...eaistActions },
  hints: { ...hintsActions },
  logs: { ...logsActions },
  config: { ...configActions }
};
