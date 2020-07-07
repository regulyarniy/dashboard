import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import { nanoid } from 'nanoid';
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import ToggleInputButton from '../../components/ToggleInputButton/ToggleInputButton';

/**
 * Создает инпут для текстового фильтра, который можно отключить
 * @param {Object} [init]
 * @param {string} [init.name] Имя query param
 * @param {...any} init.rest аргументы для Input
 * @returns {{renderedComponent: *, value: string}}
 */
export const useToggleableTextFilter = (init = {}) => {
  const { name = `txt${nanoid(2)}`, ...rest } = init;
  const [queryKey] = useState(name);
  const [queryValue, setQueryValue] = useQueryParam(queryKey, withDefault(StringParam, null));
  const [isActive, setIsActive] = useState(queryValue !== null);
  const [value, setValue] = useState(queryValue);

  const handleChange = newValue => {
    setValue(newValue);
    setQueryValue(newValue);
  };

  const toggle = () => {
    if (isActive) {
      setIsActive(false);
      handleChange(null);
    } else {
      setIsActive(true);
      handleChange(``);
    }
  };

  return {
    value,
    renderedComponent: (
      <div style={{ display: `flex` }}>
        <Input
          value={value}
          onChange={handleChange}
          isClearable
          placeholder={`Введите значение`}
          disabled={!isActive}
          {...rest}
        />
        <ToggleInputButton isActive={isActive} onClick={toggle} />
      </div>
    )
  };
};
