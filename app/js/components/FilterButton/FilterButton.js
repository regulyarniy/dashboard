import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import FilterIcon from './filter.svg';
import cn from 'classnames';
import css from './styles.css';

const FilterButton = ({ onClick, isActive, className }) => {
  return (
    <Button
      onClick={onClick}
      variant={`clear`}
      title={isActive ? `Свернуть фильтры` : `Открыть фильтры`}
      className={className}
    >
      <FilterIcon height={25} width={25} className={cn(css.icon, { [css.active]: isActive })} />
    </Button>
  );
};

FilterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string
};

export default FilterButton;
