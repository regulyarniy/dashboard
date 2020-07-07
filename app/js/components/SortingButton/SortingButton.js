import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import css from './styles.css';

const SortingButton = ({ onClick, className, children, sorting, isSortAsc, activeSorting, ...rest }) => {
  const isActive = sorting === activeSorting;

  const buttonClassName = cn(className, css.button, {
    [css.active]: isActive
  });

  const ascGlyphClassName = cn(css.chevron, css.up, {
    [css.chevronActive]: isActive && isSortAsc
  });

  const descGlyphClassName = cn(css.chevron, css.down, {
    [css.chevronActive]: isActive && !isSortAsc
  });

  const handleClick = event => {
    onClick();
    event.target.blur();
  };

  const sortingName = isSortAsc ? `по возрастанию` : `по убыванию`;

  const title = isActive ? `Сортировка: ${sortingName}` : `Клик для сортировки по этой колонке`;

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick}
      data-testid={`SortingButton`}
      {...rest}
      title={title}
    >
      {children}
      <e2-glyph name="chevron" class={ascGlyphClassName} />
      <e2-glyph name="chevron" class={descGlyphClassName} />
    </button>
  );
};

SortingButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  sorting: PropTypes.string.isRequired,
  isSortAsc: PropTypes.bool.isRequired,
  activeSorting: PropTypes.string.isRequired
};

SortingButton.defaultProps = {
  onClick: () => {}
};

export default SortingButton;
