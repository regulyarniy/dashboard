import { post } from './requests';
import { Endpoint, PAGINATION_LIMIT } from '../../constants';

export const getLogs = ({
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
}) =>
  post(Endpoint.LOGS_GET_ALL, {
    limit: PAGINATION_LIMIT,
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
