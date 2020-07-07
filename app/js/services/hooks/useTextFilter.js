import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import { nanoid } from 'nanoid';
import { useQueryParam, StringParam } from 'use-query-params';

/**
 * Создает инпут для текстового фильтра
 * @param {Object} [init]
 * @param {string} [init.name] Имя query param
 * @param {...any} init.rest аргументы для Input
 * @returns {{renderedComponent: *, value: string}}
 */
export const useTextFilter = (init = {}) => {
  const { name = `txt${nanoid(2)}`, ...rest } = init;
  const [queryKey] = useState(name);
  const [queryValue, setQueryValue] = useQueryParam(queryKey, StringParam);
  const [value, setValue] = useState(queryValue);

  const handleChange = newValue => {
    setValue(newValue);
    setQueryValue(newValue);
  };

  return {
    value,
    renderedComponent: (
      <Input value={value} onChange={handleChange} isClearable placeholder={`Введите значение`} {...rest} />
    )
  };
};
