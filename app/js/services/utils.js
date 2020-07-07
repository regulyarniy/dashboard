import { customAlphabet } from 'nanoid';
import { MODULE_NAME } from '../constants';
import { format, utcToZonedTime } from 'date-fns-tz';
import locale from 'date-fns/locale/ru';

const ALPHABET = `1234567890ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstwxyz`;

const getGenerator = length => customAlphabet(ALPHABET, length);

export function getRandomString(length = 128) {
  const generate = getGenerator(length);
  return generate();
}

export function redirectToLogin() {
  window.open(`/login.html?redirect=/${MODULE_NAME}`, `_self`);
}

/**
 * Возвращает имя по коду. Для сущностей системы и модуля
 * @param items {Array.<{code: string, name: string}>}
 * @param code {string}
 * @returns {string|null}
 */
export function getNameByCode(items, code) {
  const foundItem = items.find(i => i.code === code);
  return foundItem !== undefined && foundItem.name !== undefined ? foundItem.name : null;
}

/**
 * Возвращает код по имени. Для сущностей системы и модуля
 * @param items {Array.<{code: string, name: string}>}
 * @param name {string}
 * @returns {string|null}
 */
export function getCodeByName(items, name) {
  const foundItem = items.find(i => i.name === name);
  return foundItem !== undefined && foundItem.code !== undefined ? foundItem.code : null;
}

const formatWithPattern = (pattern = `dd.MM.yy HH:mm`) => date => {
  const timeZone = `Europe/Moscow`;
  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, pattern, { timeZone, locale });
};

/**
 * Переводит ISO в московский часовой пояс и форматирует
 * @param date {string} ISO string
 * @returns {string} формат МСК ДД.ММ.ГГ ЧЧ:ММ
 */
export const formatISODateISOToMoscowTZ = (date = new Date().toISOString()) => {
  const pattern = `dd.MM.yy HH:mm`;
  return formatWithPattern(pattern)(date);
};

/**
 * Переводит ISO в московский часовой пояс и форматирует
 * @param date {string} ISO string
 * @returns {string} формат МСК ДД.ММ.ГГ ЧЧ:ММ:CC
 */
export const formatISODateISOToMoscowTZWithSeconds = (date = new Date().toISOString()) => {
  const pattern = `dd.MM.yy HH:mm:ss`;
  return formatWithPattern(pattern)(date);
};

// Author: Diego Perini https://gist.github.com/dperini/729294
const URL_REGEX = new RegExp(
  `^` +
    // protocol identifier (optional)
    // short syntax // still required
    `(?:(?:(?:https?|ftp):)?\\/\\/)` +
    // user:pass BasicAuth (optional)
    `(?:\\S+(?::\\S*)?@)?` +
    `(?:` +
    // IP address exclusion
    // private & local networks
    `(?!(?:10|127)(?:\\.\\d{1,3}){3})` +
    `(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})` +
    `(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})` +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)
    `(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])` +
    `(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}` +
    `(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))` +
    `|` +
    // host & domain names, may end with dot
    // can be replaced by a shortest alternative
    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
    `(?:` +
    `(?:` +
    `[a-z0-9\\u00a1-\\uffff]` +
    `[a-z0-9\\u00a1-\\uffff_-]{0,62}` +
    `)?` +
    `[a-z0-9\\u00a1-\\uffff]\\.` +
    `)+` +
    // TLD identifier name, may end with dot
    `(?:[a-z\\u00a1-\\uffff]{2,}\\.?)` +
    `)` +
    // port number (optional)
    `(?::\\d{2,5})?` +
    // resource path (optional)
    `(?:[/?#]\\S*)?` +
    `$`,
  `i`
);

export function validateUrl(url) {
  return URL_REGEX.test(String(url));
}
