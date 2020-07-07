import React, { useState, useMemo, useCallback } from 'react';
import { ArchivedSelectField, FILTERS_DEBOUNCE_IN_MS, HintsSorting } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParam, BooleanParam, StringParam, withDefault } from 'use-query-params';
import { useTextFilter } from '../../services/hooks/useTextFilter';
import actions from '../../store/actions';
import { useChangeSortingCallback } from '../../services/hooks/useChangeSortingCallback';
import { useDebouncedCallback, useMount, useUpdateEffect } from 'react-essential-tools';
import SortingButton from '../../components/SortingButton/SortingButton';
import css from '../styles.pcss';
import FilterButton from '../../components/FilterButton/FilterButton';
import StyledReactTable from '../../components/StyledReactTable/StyledReactTable';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import CellWithTruncate from '../../components/CellWithTruncate/CellWithTruncate';
import { useSelectFilter } from '../../services/hooks/useSelectFilter';
import { getCodeByName } from '../../services/utils';
import HintEditor from '../../components/HintEditor/HintEditor';
import HintActionsMenuCell from '../../components/HintActionsMenuCell/HintActionsMenuCell';
import { useToggleableTextFilter } from '../../services/hooks/useToggleableTextFilter';

const DefaultValue = { archive: null };
const getValueFromQuery = (key, value) => (value === undefined ? DefaultValue[key] : value);

const archivedFilterOptions = ArchivedSelectField.map(i => i.name);

const HintsPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, count, offset } = useSelector(state => state.hints);
  const { modulesStructure } = useSelector(state => state.config);

  const [sortAsc, setSortAsc] = useQueryParam(`sortAsc`, withDefault(BooleanParam, false));
  const [sortBy, setSortBy] = useQueryParam(`sortBy`, withDefault(StringParam, HintsSorting.MODULE));

  const { value: archiveFilterValueQuery, renderedComponent: archiveFilter } = useSelectFilter({
    name: `archive`,
    options: archivedFilterOptions,
    title: `Архив`,
    placeholder: `Любые`
  });
  const archiveFilterValue = useMemo(() => getValueFromQuery(`archive`, archiveFilterValueQuery), [
    archiveFilterValueQuery
  ]);

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

  const { value: textFilterValue, renderedComponent: textFilter } = useToggleableTextFilter({
    name: `text`
  });

  const filtersQuery = useMemo(
    () => ({
      moduleContains: moduleFilterValue || null,
      pageContains: pageFilterValue || null,
      fieldContains: fieldFilterValue || null,
      textContains: textFilterValue,
      onlyArchived: getCodeByName(ArchivedSelectField, archiveFilterValue)
    }),
    [moduleFilterValue, pageFilterValue, fieldFilterValue, textFilterValue, archiveFilterValue]
  );

  const [isFiltersOpened, setIsFiltersOpened] = useState(
    Object.values(filtersQuery).filter(i => (Array.isArray(i) ? i.length !== 0 : Boolean(i))).length > 0
  );

  const updateItems = ({ offset: newOffset = offset, sortBy: newSortBy = sortBy, sortAsc: newSortAsc = sortAsc }) =>
    dispatch(
      actions.hints.request({
        offset: newOffset,
        sortBy: newSortBy,
        sortAsc: newSortAsc,
        ...filtersQuery
      })
    );

  const [updateItemsWithDelay, cancelUpdateItemsWithDelay] = useDebouncedCallback(updateItems, FILTERS_DEBOUNCE_IN_MS);

  const resetItems = () => dispatch(actions.hints.reset());

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
            onClick={handleChangeSorting(HintsSorting.FIELD)}
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
            onClick={handleChangeSorting(HintsSorting.MODULE)}
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
            onClick={handleChangeSorting(HintsSorting.PAGE)}
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
            sorting={HintsSorting.TEXT}
            onClick={handleChangeSorting(HintsSorting.TEXT)}
          >
            Текст подсказки
          </SortingButton>
        ),
        id: `text`,
        style: { textAlign: `left` },
        accessor: `text`,
        renderFilter: textFilter,
        Cell: CellWithTruncate
      },
      {
        Header: ``,
        id: `menu`,
        style: { textAlign: `left`, overflow: `visible` },
        Cell: HintActionsMenuCell,
        minWidth: `70px`,
        maxWidth: `70px`
      }
    ],
    [sortBy, sortAsc, handleChangeSorting, filtersQuery]
  );

  const ExpanderComponent = useCallback(({ id }) => <HintEditor id={id} />, []);

  return (
    <section className={css.page}>
      <header className={css.header}>
        <h1 className={css.title}>
          Все подсказки{` `}
          <div className={css.headerSelect}>{archiveFilter}</div>
        </h1>

        <div className={css.headerWrapper}>
          <FilterButton onClick={handleToggleFilters} isActive={isFiltersOpened} className={css.filtersButton} />
        </div>
      </header>

      <StyledReactTable
        key={isLoading}
        data={items}
        columns={columns}
        isFiltersOpened={isFiltersOpened}
        Expander={ExpanderComponent}
      />

      {isLoading && <Spinner />}

      <footer className={css.footer}>
        <span>{`Итого: ${count.toLocaleString(`ru-RU`)}`}</span>
        <Pagination onUpdateOffset={handleUpdateOffset} offset={offset} count={count} />
      </footer>
    </section>
  );
};

HintsPage.propTypes = {};

export default HintsPage;
