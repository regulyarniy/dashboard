import { post, get } from './requests';
import { Endpoint, PAGINATION_LIMIT } from '../../constants';

export const getHints = ({
  offset,
  sortBy,
  sortAsc,
  moduleContains,
  pageContains,
  fieldContains,
  textContains,
  onlyArchived
}) =>
  post(Endpoint.HINTS_GET_ALL, {
    limit: PAGINATION_LIMIT,
    offset,
    sortBy,
    sortAsc,
    moduleContains,
    pageContains,
    fieldContains,
    textContains,
    onlyArchived
  });

export const getHintById = ({ id }) => get(`${Endpoint.HINTS_CRUD}/${window.encodeURIComponent(id)}`);

export const updateHintById = ({ id, text, icon }) =>
  post(`${Endpoint.HINTS_CRUD}/${window.encodeURIComponent(id)}`, { text, icon });
