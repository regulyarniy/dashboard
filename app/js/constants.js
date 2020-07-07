import { MODULE_NAME, API_BASE_URL, WidgetEndpoint } from '../../widget/constants';

export { MODULE_NAME, API_BASE_URL };
export const PAGINATION_LIMIT = 15; // записей на страницу
export const FILTERS_DEBOUNCE_IN_MS = 1500;

export const MessageType = {
  ERROR: `ERROR`,
  WARNING: `WARNING`,
  SUCCESS: `SUCCESS`,
  NEUTRAL: `NEUTRAL`
};

export const Endpoint = {
  EAIST_CONTEXT: `/api/eaistContext`,
  EAIST_AVAILABLE_SUBSYSTEMS: `/api/eaistContext/availableSubsystems`,
  EAIST_SET_CUSTOMER: `/common/api/core/security/authentication/setCurrentCustomer`,
  EAIST_NEW_NOTIFICATIONS: `/common/api/notifications/userNotification/countNew`,
  EAIST_VERSION: `/api/free/configuration/getProperty/eaist.version`,
  EAIST_GET_YEAR_MAX: `/api/free/configuration/getProperty/year.max`,
  EAIST_GET_YEAR_MIN: `/api/free/configuration/getProperty/year.min`,
  EAIST_CHANGE_YEAR: `/common/api/core/security/authentication/setCurrentYear`,
  CONFIG: `${API_BASE_URL}/hints/modules/pages`, // GET
  HINTS_GET_ALL: `${API_BASE_URL}/hints/filter`, // POST
  LOGS_GET_ALL: `${API_BASE_URL}/hints/history`, // POST
  ...WidgetEndpoint
};

export const HTTP_STATUS = {
  FORBIDDEN: `403`,
  BAD_REQUEST: `400`,
  UNAUTHORIZED: `401`,
  NOT_FOUND: `404`,
  CONFLICT: `409`,
  INTERNAL_SERVER_ERROR: `500`,
  NO_CONTENT: `204`
};

export const HintsSorting = {
  MODULE: `MODULE`,
  PAGE: `PAGE`,
  FIELD: `FIELD`,
  TEXT: `TEXT`,
  UPDATE_DATE: `UPDATE_DATE`
};

export const ArchivedSelectField = [
  { code: true, name: `В архиве` },
  { code: false, name: `Активные` },
  { code: null, name: `Любые` }
];

export const HistoryAction = {
  CREATE: `CREATED`,
  UPDATE: `UPDATE`,
  DELETE: `ARCHIVED`
};

export const HistoryActionTitle = {
  [HistoryAction.CREATE]: `Создан`,
  [HistoryAction.DELETE]: `Удален`,
  [HistoryAction.UPDATE]: `Обновлен`
};

export const HistoryActions = Object.values(HistoryAction).map(code => ({ code, name: HistoryActionTitle[code] }));

export const LogsSorting = {
  MODULE: `MODULE`,
  PAGE: `PAGE`,
  FIELD: `FIELD`,
  CHANGE_TYPE: `CHANGE_TYPE`,
  CHANGE_DATE: `CHANGE_DATE`,
  USERNAME: `USERNAME`
};

export const IconType = {
  INFO: `INFO`,
  EXCLAMATION: `EXCLAMATION`,
  QUESTION: `QUESTION`
};
