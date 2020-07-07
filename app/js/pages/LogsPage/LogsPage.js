import React, { useMemo, useState } from 'react';
import { FILTERS_DEBOUNCE_IN_MS, HintsSorting, HistoryActions, LogsSorting } from '../../constants';
import { useTextFilter } from '../../services/hooks/useTextFilter';
import { useMultiSelectFilter } from '../../services/hooks/useMultiSelectFilter';
import { useDateRangeFilter } from '../../services/hooks/useDateRangeFilter';
import { formatISODateISOToMoscowTZWithSeconds, getCodeByName, getNameByCode } from '../../services/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParam, BooleanParam, StringParam, withDefault } from 'use-query-params';
import actions from '../../store/actions';
import { useDebouncedCallback, useMount, useUpdateEffect } from 'react-essential-tools';
import { useChangeSortingCallback } from '../../services/hooks/useChangeSortingCallback';
import SortingButton from '../../components/SortingButton/SortingButton';
import CellWithTruncate from '../../components/CellWithTruncate/CellWithTruncate';
import HistoryExpander from '../../components/HistoryExpander/HistoryExpander';
import css from '../styles.pcss';
import StyledReactTable from '../../components/StyledReactTable/StyledReactTable';
import FilterButton from '../../components/FilterButton/FilterButton';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import { useSelectFilter } from '../../services/hooks/useSelectFilter';

const LogsPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, count, offset } = useSelector(state => state.logs);
  const { modulesStructure } = useSelector(state => state.config);

  const [sortAsc, setSortAsc] = useQueryParam(`sortAsc`, withDefault(BooleanParam, false));
  const [sortBy, setSortBy] = useQueryParam(`sortBy`, withDefault(StringParam, LogsSorting.CHANGE_DATE));

  const { value: fieldFilterValue, renderedComponent: fieldFilter } = useTextFilter({
    name: `field`
  });

  const allModulesOptions = useMemo(() => modulesStructure.map(m => m.moduleName), [modulesStructure]);
  const { value: moduleFilterValue, renderedComponent: moduleFilter } = useSelectFilter({
    options: allModulesOptions,
    name: `module`,
    isSearchable: true
  });

  const allPagesOptions = useMemo(
    () => modulesStructure.reduce((result, module) => [...new Set([...result, ...module.pages])], []),
    [modulesStructure]
  );
  const pickedModuleStructure = modulesStructure.find(m => m.moduleName === moduleFilterValue);
  const pagesOptions = pickedModuleStructure ? pickedModuleStructure.pages : allPagesOptions;
  const { value: pageFilterValue, renderedComponent: pageFilter } = useSelectFilter({
    options: pagesOptions,
    name: `page`,
    isSearchable: true
  });

  const { value: userNameFilterValue, renderedComponent: userNameFilter } = useTextFilter({
    name: `userName`
  });

  const { values: actionTypesFilterValues, renderedComponent: actionTypesFilter } = useMultiSelectFilter({
    name: `actionTypes`,
    options: HistoryActions.map(i => i.name)
  });

  const {
    dateBegin: actionDateFilterBegin,
    dateEnd: actionDateFilterEnd,
    renderedComponent: actionDateFilter
  } = useDateRangeFilter({ name: `actionDate` });

  const filtersQuery = useMemo(
    () => ({
      moduleContains: moduleFilterValue || null,
      pageContains: pageFilterValue || null,
      fieldContains: fieldFilterValue || null,
      userNameContains: userNameFilterValue || null,
      actionTypes:
        actionTypesFilterValues && actionTypesFilterValues.length > 0
          ? actionTypesFilterValues.map(name => getCodeByName(HistoryActions, name))
          : [],
      actionDateBegin: actionDateFilterBegin ? actionDateFilterBegin.toISOString() : null,
      actionDateEnd: actionDateFilterEnd ? actionDateFilterEnd.toISOString() : null
    }),
    [
      moduleFilterValue,
      pageFilterValue,
      fieldFilterValue,
      userNameFilterValue,
      actionTypesFilterValues,
      actionDateFilterBegin,
      actionDateFilterEnd
    ]
  );

  const [isFiltersOpened, setIsFiltersOpened] = useState(
    Object.values(filtersQuery).filter(i => (Array.isArray(i) ? i.length !== 0 : Boolean(i))).length > 0
  );

  const updateItems = ({ offset: newOffset = offset, sortBy: newSortBy = sortBy, sortAsc: newSortAsc = sortAsc }) =>
    dispatch(
      actions.logs.request({
        offset: newOffset,
        sortBy: newSortBy,
        sortAsc: newSortAsc,
        ...filtersQuery
      })
    );

  const [updateItemsWithDelay, cancelUpdateItemsWithDelay] = useDebouncedCallback(updateItems, FILTERS_DEBOUNCE_IN_MS);

  const resetItems = () => dispatch(actions.logs.reset());

  const handleChangeSorting = useChangeSortingCallback({ sortBy, sortAsc, setSortBy, setSortAsc, updateItems });

  const handleUpdateOffset = ({ offset }) => updateItems({ offset });

  const handleToggleFilters = () => setIsFiltersOpened(!isFiltersOpened);

  // update on mount
  useMount(() => {
    updateItems({});
  });

  // reset on unmount
  useMount(() => resetItems);

  // filters change
  useUpdateEffect(() => {
    cancelUpdateItemsWithDelay();
    updateItemsWithDelay({ offset: 0, sortAsc, sortBy, ...filtersQuery });
  }, [filtersQuery]);

  const columns = useMemo(
    () => [
      {
        Header: (
          <SortingButton
            isSortAsc={sortAsc}
            activeSorting={sortBy}
            sorting={HintsSorting.FIELD}
            onClick={handleChangeSorting(LogsSorting.FIELD)}
          >
            Поле подсказки
          </SortingButton>
        ),
        id: `field`,
        style: { textAlign: `left` },
        accessor: `field`,
        renderFilter: fieldFilter,
        Cell: CellWithTruncate
      },
      {
        Header: (
          <SortingButton
            isSortAsc={sortAsc}
            activeSorting={sortBy}
            sorting={HintsSorting.MODULE}
            onClick={handleChangeSorting(LogsSorting.MODULE)}
          >
            Подсистема
          </SortingButton>
        ),
        id: `module`,
        style: { textAlign: `left` },
        accessor: `module`,
        renderFilter: moduleFilter,
        Cell: CellWithTruncate
      },
      {
        Header: (
          <SortingButton
            isSortAsc={sortAsc}
            activeSorting={sortBy}
            sorting={HintsSorting.PAGE}
            onClick={handleChangeSorting(LogsSorting.PAGE)}
          >
            Экран
          </SortingButton>
        ),
        id: `page`,
        style: { textAlign: `left` },
        accessor: `page`,
        renderFilter: pageFilter,
        Cell: CellWithTruncate
      },
      {
        Header: (
          <SortingButton
            isSortAsc={sortAsc}
            activeSorting={sortBy}
            sorting={LogsSorting.USERNAME}
            onClick={handleChangeSorting(LogsSorting.USERNAME)}
          >
            ФИО Администратора
          </SortingButton>
        ),
        accessor: `username`,
        style: { textAlign: `left` },
        renderFilter: userNameFilter
      },
      {
        Header: (
          <SortingButton
            isSortAsc={sortAsc}
            activeSorting={sortBy}
            sorting={LogsSorting.CHANGE_TYPE}
            onClick={handleChangeSorting(LogsSorting.CHANGE_TYPE)}
          >
            Действие
          </SortingButton>
        ),
        id: `changeType`,
        accessor: ({ changeType }) => getNameByCode(HistoryActions, changeType),
        renderFilter: actionTypesFilter,
        minWidth: `200px`,
        maxWidth: `200px`
      },
      {
        Header: (
          <SortingButton
            activeSorting={sortBy}
            isSortAsc={sortAsc}
            sorting={LogsSorting.CHANGE_DATE}
            onClick={handleChangeSorting(LogsSorting.CHANGE_DATE)}
          >
            Дата изменений
          </SortingButton>
        ),
        style: { textAlign: `right` },
        id: `changeDate`,
        accessor: ({ changeDate }) => formatISODateISOToMoscowTZWithSeconds(changeDate),
        renderFilter: actionDateFilter,
        minWidth: `190px`,
        maxWidth: `190px`
      }
    ],
    [sortBy, sortAsc, handleChangeSorting, filtersQuery]
  );

  return (
    <section className={css.page}>
      <header className={css.header}>
        <h1 className={css.title}>История изменений</h1>
        <div className={css.headerWrapper}>
          <FilterButton onClick={handleToggleFilters} isActive={isFiltersOpened} className={css.filtersButton} />
        </div>
      </header>

      <StyledReactTable
        key={isLoading}
        data={items}
        columns={columns}
        Expander={HistoryExpander}
        isFiltersOpened={isFiltersOpened}
      />

      {isLoading && <Spinner />}

      <footer className={css.footer}>
        <span>{`Итого: ${count.toLocaleString(`ru-RU`)}`}</span>
        <Pagination onUpdateOffset={handleUpdateOffset} offset={offset} count={count} />
      </footer>
    </section>
  );
};

LogsPage.propTypes = {};

export default LogsPage;
