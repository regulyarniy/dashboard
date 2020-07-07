import React, { useState } from 'react';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import { nanoid } from 'nanoid';
import { useQueryParam, ArrayParam } from 'use-query-params';

/**
 * Создает мультиселект для некольких значений
 * @param {Object} [init]
 * @param {Array} [init.options]
 * @param {string} [init.name] Имя query param
 * @param {...any} init.rest аргументы для MultiSelect
 * @returns {{values: Array, renderedComponent: *}}
 */
export const useMultiSelectFilter = (init = {}) => {
  const { options = [], name = `ms${nanoid(2)}`, ...rest } = init;
  const [queryKey] = useState(name);
  const [queryValue, setQueryValue] = useQueryParam(queryKey, ArrayParam);
  const [values, setValues] = useState(queryValue);

  const handleChange = newValues => {
    setValues(newValues);
    setQueryValue(newValues);
  };

  return {
    values,
    renderedComponent: <MultiSelect onChange={handleChange} values={values} options={options} isClearable {...rest} />
  };
};
