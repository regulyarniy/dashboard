import React, { useState } from 'react';
import Select from '../../components/Select/Select';
import { nanoid } from 'nanoid';
import { useQueryParam, StringParam } from 'use-query-params';

/**
 * Создает мультиселект для некольких значений
 * @param {Object} [init]
 * @param {Array} [init.options]
 * @param {string} [init.name] Имя query param
 * @param {...any} init.rest аргументы для Select
 * @returns {{value: string, renderedComponent: *}}
 */
export const useSelectFilter = (init = {}) => {
  const { options = [], name = `sel${nanoid(2)}`, ...rest } = init;
  const [queryKey] = useState(name);
  const [queryValue, setQueryValue] = useQueryParam(queryKey, StringParam);
  const [value, setValue] = useState(queryValue);

  const handleChange = newValue => {
    setValue(newValue);
    setQueryValue(newValue);
  };

  return {
    value,
    renderedComponent: <Select onChange={handleChange} value={value} options={options} isClearable {...rest} />
  };
};
