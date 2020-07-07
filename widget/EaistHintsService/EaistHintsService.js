import { MODULE_NAME, WidgetEndpoint } from '../constants';
import { openDB } from 'idb';

const OBJECT_STORE_NAME = MODULE_NAME;
const HINTS_KEY = MODULE_NAME;

// protected fields
const _ = {
  database: Symbol(`database`),
  dictionary: Symbol(`dictionary`),
  listeners: Symbol(`listeners`),
  unsubscribe: Symbol(`unsubscribe`),
  broadcast: Symbol(`broadcast`),
  merge: Symbol(`merge`),
  startUpdating: Symbol(`startUpdating`),
  stopUpdating: Symbol(`stopUpdating`),
  isAdmin: Symbol(`isAdmin`),
  isUpdating: Symbol(`isUpdating`)
};

class EaistHintsService {
  constructor(isAdmin = false) {
    this[_.database] = null;
    this[_.dictionary] = {};
    this[_.listeners] = [];
    this[_.isAdmin] = isAdmin;
    this[_.isUpdating] = false;

    openDB(MODULE_NAME, 1, {
      upgrade: (db, oldVersion, newVersion, transaction) => {
        db.createObjectStore(OBJECT_STORE_NAME);
        transaction.done.then(() => {
          db.put(OBJECT_STORE_NAME, this[_.dictionary], HINTS_KEY).then(() => {
            this[_.database] = db;
          });
        });
      }
    })
      .then(db => {
        db.get(OBJECT_STORE_NAME, HINTS_KEY).then(hints => {
          this[_.merge](hints);
          this[_.database] = db;
        });
      })
      // eslint-disable-next-line no-console
      .catch(console.error);
  }

  get isAdmin() {
    return this[_.isAdmin];
  }

  set isAdmin(value) {
    // TODO backend request
    this[_.isAdmin] = value;
    this[_.broadcast]();
  }

  get dictionary() {
    return this[_.dictionary];
  }

  get isUpdating() {
    return this[_.isUpdating];
  }

  /**
   * Запрашивает все подсказки для модуля
   * @param moduleName
   * @returns {Promise<void>}
   */
  fetch = async moduleName => {
    if (typeof moduleName !== `string`) {
      return Promise.resolve();
    }
    this[_.startUpdating]();
    try {
      const headers = new Headers();
      headers.append(`Content-Type`, `application/json`);
      const abortController = new window.AbortController();
      const options = {
        method: `GET`,
        headers,
        credentials: `include`,
        signal: abortController.signal
      };
      window.setTimeout(() => abortController.abort(), 60000); // таймаут на загрузку основного списка
      const response = await window
        .fetch(`${WidgetEndpoint.HINTS_GET_CACHED}/${window.encodeURIComponent(moduleName)}/cached`, options)
        .then(res => res.json());

      if (Array.isArray(response)) {
        const hintsMap = {};
        response.forEach(hint => (hintsMap[hint.id] = hint));
        this[_.merge](hintsMap);
      }
    } catch (error) {
      this[_.stopUpdating]();
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  subscribe(cb) {
    if (typeof cb === `function`) {
      this[_.listeners].push(cb);
      return () => this[_.unsubscribe](cb);
    } else {
      throw new Error(`В subscribe должна быть передана функция`);
    }
  }

  /**
   * Обновляет хинт
   * @param data
   * @param data.id
   * @param data.text
   * @param data.icon
   * @returns {Promise<void>}
   */
  updateHint = async ({ id, text, icon }) => {
    this[_.startUpdating]();

    try {
      const url = `${WidgetEndpoint.HINTS_CRUD}/${window.encodeURIComponent(id)}`;
      const headers = new Headers();
      headers.append(`Content-Type`, `application/json`);
      const abortController = new window.AbortController();
      const options = {
        method: `POST`,
        headers,
        credentials: `include`,
        signal: abortController.signal,
        body: JSON.stringify({ text, icon })
      };
      window.setTimeout(() => abortController.abort(), 10000); // таймаут на апдейт хинта
      const newHint = await fetch(url, options).then(res => res.json());
      this[_.merge]({ [id]: { ...newHint } });
    } catch (e) {
      this[_.stopUpdating]();
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  [_.unsubscribe] = cb => {
    this[_.listeners] = this[_.listeners].filter(subscribedCb => subscribedCb !== cb);
  };

  [_.broadcast] = () => {
    for (let cb of this[_.listeners]) {
      try {
        cb({ dictionary: this.dictionary, isAdmin: this.isAdmin, isUpdating: this.isUpdating });
      } catch (e) {
        this[_.unsubscribe](cb);
      }
    }
  };

  [_.merge] = newDictionary => {
    if (typeof newDictionary === `object` && newDictionary !== null) {
      const mergedDictionary = { ...this.dictionary, ...newDictionary };
      if (this[_.database]) {
        this[_.database].put(OBJECT_STORE_NAME, mergedDictionary, HINTS_KEY);
      }
      this[_.dictionary] = mergedDictionary;
      this[_.isUpdating] = false;
      this[_.broadcast]();
    }
  };

  [_.startUpdating] = () => {
    this[_.isUpdating] = true;
    this[_.broadcast]();
  };

  [_.stopUpdating] = () => {
    this[_.isUpdating] = false;
    this[_.broadcast]();
  };
}

if (!window.EaistHintsService) {
  window.EaistHintsService = new EaistHintsService();
}
