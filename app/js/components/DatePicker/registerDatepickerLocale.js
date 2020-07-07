import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ruLocale from 'date-fns/locale/ru';

export default () => {
  registerLocale(`ru`, ruLocale);
  setDefaultLocale(`ru`);
};
