import { get, getForText } from './requests';
import { Endpoint } from '../../constants';

export const getEaistContext = () => get(Endpoint.EAIST_CONTEXT);

export const getEaistAvailableSubsystems = () => get(Endpoint.EAIST_AVAILABLE_SUBSYSTEMS);

export const setEaistCustomer = ({ id }) => get(`${Endpoint.EAIST_SET_CUSTOMER}/${id}`);

export const getEaistMinYears = () => get(Endpoint.EAIST_GET_YEAR_MIN);

export const getEaistMaxYears = () => get(Endpoint.EAIST_GET_YEAR_MAX);

export const getEaistNewNotifications = () => get(Endpoint.EAIST_NEW_NOTIFICATIONS);

export const getEaistVersion = () => getForText(Endpoint.EAIST_VERSION);

export const changeEaistYear = ({ year }) => get(`${Endpoint.EAIST_CHANGE_YEAR}/${year}`);
