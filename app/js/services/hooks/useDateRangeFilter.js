import React, { useState } from 'react';
import DatePicker from '../../components/DatePicker/DatePicker';
import { nanoid } from 'nanoid';
import { useQueryParams, DateTimeParam } from 'use-query-params';

/**
 * Создает инпуты для фильтра дат в таблицах
 * @param {Object} [init]
 * @param {string} [init.name] Имя query param
 * @returns {{dateBegin: (Date|null), dateEnd: (Date|null), renderedComponent: *}}
 */
export const useDateRangeFilter = (init = {}) => {
  const { name = `dt${nanoid(2)}` } = init;
  const [queryKeyBegin] = useState(`${name}B`);
  const [queryKeyEnd] = useState(`${name}E`);
  const [query, setQuery] = useQueryParams({ [queryKeyBegin]: DateTimeParam, [queryKeyEnd]: DateTimeParam });
  const [dateBegin, setDateBegin] = useState(query[queryKeyBegin]);
  const [dateEnd, setDateEnd] = useState(query[queryKeyEnd]);

  const handleChangeBegin = date => {
    setDateBegin(date);
    setQuery({ [queryKeyBegin]: date });
  };

  const handleChangeEnd = date => {
    setDateEnd(date);
    setQuery({ [queryKeyEnd]: date });
  };

  return {
    dateBegin,
    dateEnd,
    renderedComponent: (
      <>
        <DatePicker
          showTimeSelect
          selected={dateBegin}
          onChange={handleChangeBegin}
          selectsStart
          startDate={dateBegin}
          endDate={dateEnd}
          placeholderText={`от`}
          isClearable
        />
        <DatePicker
          showTimeSelect
          selected={dateEnd}
          onChange={handleChangeEnd}
          selectsEnd
          startDate={dateBegin}
          endDate={dateEnd}
          placeholderText={`до`}
          isClearable
        />
      </>
    )
  };
};
