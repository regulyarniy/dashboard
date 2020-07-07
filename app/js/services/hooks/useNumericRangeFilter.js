import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import { nanoid } from 'nanoid';
import { useQueryParams, StringParam } from 'use-query-params';

/**
 * Создает инпуты для диапазона чисел
 * @param {Object} [init]
 * @param {string} [init.name] Имя query param
 * @param {...any} init.rest аргументы для Input
 * @returns {{renderedComponent: *, valueFrom: (string|undefined|''), valueTo: (string|undefined|'')}}
 */
export const useNumericRangeFilter = (init = {}) => {
  const { name = `num${nanoid(2)}`, ...rest } = init;
  const [queryKeyFrom] = useState(`${name}From`);
  const [queryKeyTo] = useState(`${name}To`);
  const [query, setQuery] = useQueryParams({ [queryKeyFrom]: StringParam, [queryKeyTo]: StringParam });
  const [valueFrom, setValueFrom] = useState(query[queryKeyFrom]);
  const [valueTo, setValueTo] = useState(query[queryKeyTo]);

  const handleChangeFrom = newValue => {
    setValueFrom(newValue);
    setQuery({ [queryKeyFrom]: newValue });
  };

  const handleChangeTo = newValue => {
    setValueTo(newValue);
    setQuery({ [queryKeyTo]: newValue });
  };

  return {
    valueFrom,
    valueTo,
    renderedComponent: (
      <>
        <Input
          value={valueFrom || ``}
          onChange={handleChangeFrom}
          isClearable
          placeholder={`от`}
          type={`number`}
          min={`0`}
          max={valueTo || ``}
          {...rest}
        />
        <Input
          value={valueTo || ``}
          onChange={handleChangeTo}
          isClearable
          placeholder={`до`}
          type={`number`}
          min={`0`}
          max={valueFrom || ``}
          {...rest}
        />
      </>
    )
  };
};
