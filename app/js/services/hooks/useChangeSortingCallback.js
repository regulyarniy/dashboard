import { useCallback } from 'react';

/**
 * Возвращает колбек для кнопок сортировки
 * @param {Object} obj
 * @param obj.sortBy
 * @param obj.setSortBy
 * @param obj.sortAsc
 * @param obj.setSortAsc
 * @param {function} obj.updateItems
 * @returns {function(*=): function(...[*]=)}
 */
export const useChangeSortingCallback = ({ sortBy, setSortBy, sortAsc, setSortAsc, updateItems }) => {
  return useCallback(
    newSortBy => () => {
      // если сортируем по другой колонке, то сбрасывыем sortAsc
      const newSortAsc = sortBy !== newSortBy ? false : !sortAsc;
      // обновляем query params
      if (sortAsc !== newSortAsc) {
        setSortAsc(newSortAsc);
      }
      if (sortBy !== newSortBy) {
        setSortBy(newSortBy);
      }
      updateItems({ offset: 0, sortBy: newSortBy, sortAsc: newSortAsc });
    },
    [sortBy, setSortBy, sortAsc, setSortAsc, updateItems]
  );
};
