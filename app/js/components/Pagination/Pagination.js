import React from 'react';
import PropTypes from 'prop-types';
import css from './styles.css';
import { PAGINATION_LIMIT } from '../../constants';
import Button from '../Button/Button';
import cn from 'classnames';

const Pagination = ({ onUpdateOffset, offset, count }) => {
  const maxPageIndex =
    count % PAGINATION_LIMIT === 0 ? count / PAGINATION_LIMIT - 1 : Math.trunc(count / PAGINATION_LIMIT);
  const pageIndex = offset / PAGINATION_LIMIT;
  const canPreviousPage = offset > 0;
  const canNextPage = pageIndex < maxPageIndex;
  const goNextPage = () => onUpdateOffset({ offset: offset + PAGINATION_LIMIT });
  const goPreviousPage = () => onUpdateOffset({ offset: offset - PAGINATION_LIMIT });
  const goToPage = newPageIndex => () => onUpdateOffset({ offset: newPageIndex * PAGINATION_LIMIT });

  return (
    <div className={css.pagination} data-testid={`Pagination`}>
      <Button
        onClick={goToPage(0)}
        disabled={!canPreviousPage}
        title={`К первой`}
        variant={`clear`}
        className={cn(css.button, css.first)}
      />

      <Button
        onClick={goPreviousPage}
        disabled={!canPreviousPage}
        title={`Предыдущая`}
        variant={`clear`}
        className={cn(css.button, css.prev)}
      />

      <span>
        Страница {` `}
        <strong>
          {pageIndex + 1} из {maxPageIndex + 1 || 1}
        </strong>
      </span>

      <Button
        onClick={goNextPage}
        disabled={!canNextPage}
        title={`Следующая`}
        variant={`clear`}
        className={cn(css.button, css.next)}
      />

      <Button
        onClick={goToPage(maxPageIndex)}
        disabled={!canNextPage}
        title={`К последней`}
        variant={`clear`}
        className={cn(css.button, css.last)}
      />
    </div>
  );
};

Pagination.propTypes = {
  onUpdateOffset: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired
};

export default Pagination;
