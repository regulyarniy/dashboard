import { HTTP_STATUS } from '../../constants';
import { redirectToLogin } from '../utils';

const ContentType = {
  JSON: `application/json`,
  TEXT: `text/plain`,
  EXCEL: `application/json, application/vnd.ms-excel`,
  PDF: `application/pdf`,
  HTML: `text/html`
};

const HTTPMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
  PATCH: `PATCH`
};

const fetchWithErrorHandling = ({ url, options, responseType }) => {
  return fetch(url, options)
    .then(response => {
      if (String(response.status) === HTTP_STATUS.FORBIDDEN || String(response.status) === HTTP_STATUS.UNAUTHORIZED) {
        redirectToLogin();
      } else if (
        String(response.status) === HTTP_STATUS.BAD_REQUEST ||
        String(response.status) === HTTP_STATUS.CONFLICT ||
        String(response.status) === HTTP_STATUS.INTERNAL_SERVER_ERROR
      ) {
        return response.text().then(res => {
          const error = new Error(String(res));
          error.httpCode = String(response.status);
          throw error;
        });
      } else if (String(response.status) === HTTP_STATUS.NOT_FOUND) {
        const error = new Error(`404. Ресурс не найден на сервере!`);
        error.httpCode = String(response.status);
        throw error;
      } else if (!response.ok) {
        const error = new Error(String(response.status));
        error.httpCode = String(response.status);
        throw error;
      } else if (String(response.status) === HTTP_STATUS.NO_CONTENT) {
        return `ok`;
      } else {
        switch (responseType) {
          case ContentType.EXCEL:
          case ContentType.HTML:
          case ContentType.PDF: {
            return response.blob();
          }

          case ContentType.TEXT: {
            return response.text();
          }

          case ContentType.JSON:
          default: {
            return response.json();
          }
        }
      }
    })
    .then(response => ({ response }))
    .catch(error => ({ error }));
};

const request = (method = HTTPMethod.GET, defaultResponseType = ContentType.JSON) => (url, body = {}, responseType) => {
  const headers = new Headers();
  headers.append(`Content-Type`, ContentType.JSON);
  headers.append(`Accept`, responseType || defaultResponseType);
  const payload = JSON.stringify(body);
  const options = {
    method: method,
    headers,
    credentials: `include`
  };
  if (![HTTPMethod.GET, HTTPMethod.DELETE].includes(method)) {
    options.body = payload;
  }
  return fetchWithErrorHandling({ url, options, responseType: responseType || defaultResponseType });
};

export const get = request(HTTPMethod.GET);

export const post = request(HTTPMethod.POST);

export const postForXLSX = request(HTTPMethod.POST, ContentType.EXCEL);

export const del = request(HTTPMethod.DELETE);

export const put = request(HTTPMethod.PUT);

export const patch = request(HTTPMethod.PATCH);

export const getForText = request(HTTPMethod.GET, ContentType.TEXT);
