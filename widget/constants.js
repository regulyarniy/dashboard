export const MODULE_NAME = `hints`;
export const API_BASE_URL = `/${MODULE_NAME}/api`;
export const WEBCOMPONENT_PREFIX = MODULE_NAME;
export const WidgetEndpoint = {
  HINTS_GET_CACHED: `${API_BASE_URL}/hints/modules`, // GET /hints/api/hints/modules/{moduleName}/cached,
  HINTS_CRUD: `${API_BASE_URL}/hints` // GET, POST
};

export const IconType = {
  INFO: `INFO`,
  EXCLAMATION: `EXCLAMATION`,
  QUESTION: `QUESTION`,
  EMPTY: `EMPTY`,
  EDIT: `EDIT`
};

export const IconTitle = {
  [IconType.INFO]: `Информация`,
  [IconType.QUESTION]: `Вопрос`,
  [IconType.EXCLAMATION]: `Внимание`
};
