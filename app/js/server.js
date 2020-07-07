import { HintsSorting, Endpoint, HistoryAction, LogsSorting } from './constants';
import { Server, Model, Factory, belongsTo, hasMany, RestSerializer } from 'miragejs';
import faker from 'faker/locale/ru';
import { isAfter, isBefore } from 'date-fns';

const Field = {
  [HintsSorting.FIELD]: `field`,
  [HintsSorting.MODULE]: `module`,
  [HintsSorting.PAGE]: `page`,
  [HintsSorting.TEXT]: `text`,
  [LogsSorting.CHANGE_DATE]: `actionDate`,
  [LogsSorting.CHANGE_TYPE]: `actionType`,
  [LogsSorting.USERNAME]: `userName`
};

const modulesStructure = [
  { moduleName: `Подсказки`, pages: [`История`, `Виджет`, `Все подсказки`] },
  {
    moduleName: `Реестр ошибок`,
    pages: [`История ошибок`, `Шаблоны`, `Виджет`, `Конфликтующие шаблоны`, `Статистика`, `История изменений`]
  },
  { moduleName: `Электронный магазин`, pages: [`Товары, работы и услуги`, `Избранное`, `Котировочные сессии`] },
  { moduleName: `КС`, pages: [`КС страница`] },
  { moduleName: `РК`, pages: [`РК страница`] },
  { moduleName: `Вики`, pages: [`Вики страница`] }
];

new Server({
  serializers: {
    application: RestSerializer,
    log: RestSerializer.extend({
      include: [`hint`, `changes`]
    })
  },

  models: {
    hint: Model.extend({
      logs: hasMany()
    }),
    log: Model.extend({
      hint: belongsTo(),
      changes: hasMany()
    }),
    change: Model.extend({
      log: belongsTo()
    })
  },

  factories: {
    hint: Factory.extend({
      module() {
        return faker.random.arrayElement(modulesStructure.map(m => m.moduleName));
      },
      page() {
        return faker.random.arrayElement(modulesStructure.find(m => m.moduleName === this.module).pages);
      },
      field() {
        return faker.random
          .word()
          .toLowerCase()
          .split(` `)[0];
      },
      id() {
        return `${this.module}:${this.page}:${this.field}`;
      },
      updateDate() {
        return faker.date.past(1);
      },
      afterCreate(hint, server) {
        // 50 % что будет поле archiveDate
        if (faker.random.boolean()) {
          hint.update({ archiveDate: faker.date.past(2) });
        }
        // 87.5 % что будет поле text
        if (faker.random.boolean() || faker.random.boolean() || faker.random.boolean()) {
          hint.update({ text: faker.random.words(70) });
        }
        const log = server.create(`log`, {
          changeType: HistoryAction.CREATE,
          changeDate: faker.date.past(1),
          userId: 0,
          userName: `Системная операция`,
          hint
        });
        server.create(`change`, {
          fieldName: `Все поля`,
          newValue: `Созданы`,
          log
        });
      }
    }),
    log: Factory,
    change: Factory
  },

  fixtures: {
    hints: [
      {
        id: `Подсказки:Виджет:input1`,
        module: `Подсказки`,
        page: `Виджет`,
        field: `input1`,
        text: `abcde`,
        icon: `INFO`,
        updateDate: `2020-06-15T01:48:39.414Z`
      },
      {
        id: `Подсказки:Виджет:textarea`,
        module: `Подсказки`,
        page: `Виджет`,
        field: `textarea`,
        text: `textarea`,
        updateDate: `2020-06-15T01:48:39.414Z`
      },
      {
        id: `Подсказки:Виджет:checkbox`,
        module: `Подсказки`,
        page: `Виджет`,
        field: `checkbox`,
        icon: `INFO`,
        text: `checkbox<b>box</b>`,
        updateDate: `2020-06-15T01:48:39.414Z`
      }
    ]
  },

  routes() {
    this.passthrough();

    // авторизация
    this.get(Endpoint.EAIST_CONTEXT, () => {
      return {
        lastCustomer: 1,
        userId: 621044,
        withSubOrdinate: false,
        customers: [1],
        year: 2020,
        budgetPeriod: `2020-2022`,
        userName: `Sysadm Sysadm Sysadm`,
        login: `sysadm`,
        customerShortName: `Правительство Москвы`,
        jobName: `Правительство Москвы`,
        userSurname: `Sysadm`,
        userFirtsname: `Sysadm`,
        userPatronymic: `Sysadm`,
        userEmail: `temp@eaist2-f.mos.ru`,
        enableUspp: false,
        useAs2: true,
        ppUseAs2: true,
        tpUseAs2: true,
        notificationUseAs2: true,
        jointProcedureUseAs2: true,
        globalAdmin: true,
        signProcedureSvr: false,
        armMrgEnabled: true,
        oivAgreementEnabled: true,
        municipal: false,
        mrgIntegrationReviewEnabled: false,
        eisAuthHelpDocUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        roles: [],
        grbsRole: true,
        accessRules: {
          RO_USER: { READ: true, MODIFY: true, CHOOSE: true, ADMIN: true },
          HINTS_ADMIN: { READ: true, MODIFY: true, CHOOSE: false, ADMIN: false }
        },
        userActive: true
      };
    });

    // авторизация
    this.get(Endpoint.EAIST_AVAILABLE_SUBSYSTEMS, () => {
      return [];
    });

    // конфиг модуля
    this.get(Endpoint.CONFIG, () => {
      return modulesStructure;
    });

    // получить список хинтов по модулю(с кешом)
    this.get(
      `${Endpoint.HINTS_GET_CACHED}/:moduleName/cached`,
      (schema, request) => {
        const moduleName = request.params.moduleName;

        return schema.hints.all().filter(h => h.module === moduleName).models;
      },
      { timing: 2000 }
    );

    // получить таблицу подсказок
    this.post(Endpoint.HINTS_GET_ALL, (schema, request) => {
      let {
        limit,
        offset,
        sortBy,
        sortAsc,
        moduleContains,
        pageContains,
        fieldContains,
        textContains,
        onlyArchived
      } = JSON.parse(request.requestBody);

      const items = schema.hints
        .all()
        .filter(h => (moduleContains === null ? true : h.module.toLowerCase().includes(moduleContains.toLowerCase())))
        .filter(h => (pageContains === null ? true : h.page.toLowerCase().includes(pageContains.toLowerCase())))
        .filter(h => (fieldContains === null ? true : h.field.toLowerCase().includes(fieldContains.toLowerCase())))
        .filter(h => {
          if (textContains === null) {
            return true;
          } else if (textContains === ``) {
            return h.text === `` || h.text === undefined;
          } else {
            return h.text ? h.text.toLowerCase().includes(textContains.toLowerCase()) : false;
          }
        })
        .filter(h => {
          if (onlyArchived === null) {
            return true;
          }
          return onlyArchived ? h.archiveDate !== undefined : h.archiveDate === undefined;
        })
        .sort((a, b) => {
          const fieldName = Field[sortBy];

          const isSorting = sortAsc ? a[fieldName] < b[fieldName] : a[fieldName] >= b[fieldName];
          return isSorting ? -1 : 1;
        }).models;

      return {
        items: items.slice(offset, offset + limit),
        count: items.length,
        offset
      };
    });

    // получить хинт
    this.get(`${Endpoint.HINTS_CRUD}/:id`, (schema, request) => {
      let id = request.params.id;

      return schema.hints.findBy({ id }).attrs;
    });

    // обновить хинт
    this.post(`${Endpoint.HINTS_CRUD}/:id`, (schema, request) => {
      let id = request.params.id;
      let { text, icon } = JSON.parse(request.requestBody);

      const hint = schema.hints.findBy({ id });
      const oldHint = JSON.parse(JSON.stringify(hint));
      hint.update({
        text,
        icon,
        updateDate: new Date().toISOString()
      });
      const log = this.create(`log`, {
        changeType: HistoryAction.UPDATE,
        changeDate: new Date().toISOString(),
        userId: 0,
        userName: `Сисадмин`,
        hint
      });
      if (oldHint.text !== hint.text) {
        this.create(`change`, {
          fieldName: `Текст подсказки`,
          newValue: hint.text,
          oldValue: oldHint.text,
          log
        });
      }
      if (oldHint.icon !== hint.icon) {
        this.create(`change`, {
          fieldName: `Иконка`,
          newValue: hint.icon,
          oldValue: oldHint.icon,
          log
        });
      }

      return hint.attrs;
    });

    // получить таблицу логов
    this.post(Endpoint.LOGS_GET_ALL, (schema, request) => {
      let {
        limit,
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
      } = JSON.parse(request.requestBody);

      const items = schema.logs
        .all()
        .filter(h =>
          moduleContains === null ? true : h.hint.module.toLowerCase().includes(moduleContains.toLowerCase())
        )
        .filter(h => (pageContains === null ? true : h.hint.page.toLowerCase().includes(pageContains.toLowerCase())))
        .filter(h => (fieldContains === null ? true : h.hint.field.toLowerCase().includes(fieldContains.toLowerCase())))
        .filter(h =>
          userNameContains === null ? true : h.userName.toLowerCase().includes(userNameContains.toLowerCase())
        )
        .filter(h => (actionTypes === null || actionTypes.length === 0 ? true : actionTypes.includes(h.actionType)))
        .filter(h => (actionDateBegin === null ? true : isBefore(new Date(actionDateBegin), new Date(h.actionDate))))
        .filter(h => (actionDateEnd === null ? true : isAfter(new Date(actionDateEnd), new Date(h.actionDate))))
        .models.map(log => {
          return {
            ...log.attrs,
            module: log.hint.module,
            page: log.hint.page,
            field: log.hint.field,
            changes: log.changes.models
          };
        })
        .sort((a, b) => {
          const fieldName = Field[sortBy];

          if (sortBy === LogsSorting.CHANGE_DATE) {
            const isSorting = sortAsc
              ? new Date(a[fieldName]).getTime() < new Date(b[fieldName]).getTime()
              : new Date(a[fieldName]).getTime() >= new Date(b[fieldName]).getTime();
            return isSorting ? -1 : 1;
          }

          const isSorting = sortAsc ? a[fieldName] < b[fieldName] : a[fieldName] >= b[fieldName];
          return isSorting ? -1 : 1;
        });

      return {
        items: items.slice(offset, offset + limit),
        count: items.length,
        offset
      };
    });
  },

  seeds(server) {
    server.loadFixtures();
    server.createList(`hint`, 100);
  }
});
