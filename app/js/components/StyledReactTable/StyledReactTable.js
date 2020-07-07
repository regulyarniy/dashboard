import React, { Fragment, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTable, useExpanded } from 'react-table';
import css from './styles.pcss';
import cn from 'classnames';

const StyledReactTable = ({ columns, data, className, Expander, canExpandFn, isFiltersOpened }) => {
  const { getTableProps, headerGroups, rows, prepareRow, toggleAllRowsExpanded } = useTable(
    {
      columns,
      data,
      autoResetExpanded: false
    },
    useExpanded
  );

  // reset expanded rows on table data change
  useEffect(() => {
    toggleAllRowsExpanded(false);
  }, [data.length]);

  const columnsStyle = useMemo(
    () => `${columns.map(i => `minmax(${i.minWidth || `100px`}, ${i.maxWidth || `1fr`})`).join(` `)}`,
    [columns]
  );

  return (
    <div className={className} data-testid={`StyledReactTable`}>
      <div {...getTableProps()} className={css.table} style={{ gridTemplateColumns: columnsStyle }}>
        {headerGroups.map(headerGroup => (
          <Fragment key={headerGroup.getHeaderGroupProps().key}>
            {headerGroup.headers.map(column => (
              <div key={column.getHeaderProps().key} style={column.style} className={css.headingCell}>
                <div className={css.columnHeader}>{column.render(`Header`)}</div>
                {isFiltersOpened && (
                  <div className={css.filters} data-testid={`filters-${column.id}`}>
                    {column.renderFilter || null}
                  </div>
                )}
              </div>
            ))}
          </Fragment>
        ))}

        {rows.map(
          row =>
            prepareRow(row) || (
              <div key={`row-${row.getRowProps().key}`} className={css.row}>
                {/*normal cells*/}
                {row.cells.map(cell => {
                  const onClick = canExpandFn(row.original)
                    ? () => {
                        row.toggleRowExpanded(!row.isExpanded);
                      }
                    : () => {};
                  const cursor = canExpandFn(row.original) ? `pointer` : `default`;
                  const style = { cursor, ...(cell.column.style || {}) };
                  return (
                    <div
                      className={cn(css.cell, { [css.expanded]: row.isExpanded })}
                      onClick={onClick}
                      key={cell.getCellProps().key}
                      style={style}
                      title={cell.column.title || ``}
                    >
                      {cell.render(`Cell`)}
                    </div>
                  );
                })}

                {/*expanded cell*/}
                {row.isExpanded && (
                  <div
                    key={`${row.getRowProps().key}-expander`}
                    className={cn(css.expanderCell, css.expanded)}
                    style={{ gridColumnStart: 1, gridColumnEnd: -1 }}
                  >
                    <Expander id={row.original.id} row={row.original} />
                  </div>
                )}
              </div>
            )
        )}
      </div>
      {rows.length === 0 && <div className={css.noView}>Нет результатов</div>}
    </div>
  );
};

StyledReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
  Expander: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  canExpandFn: PropTypes.func,
  isFiltersOpened: PropTypes.bool,
  filters: PropTypes.array
};

StyledReactTable.defaultProps = {
  Expander: () => null,
  canExpandFn: () => true
};

export default StyledReactTable;
