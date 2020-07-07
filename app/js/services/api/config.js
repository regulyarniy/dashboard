import { Endpoint } from '../../constants';
import { get } from './requests';

export const getConfig = () => get(Endpoint.CONFIG);
