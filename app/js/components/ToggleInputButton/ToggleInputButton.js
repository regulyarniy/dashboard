import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import FilterIcon from './filter.svg';
import cn from 'classnames';
import css from './styles.css';

const ToggleInputButton = ({ onClick, isActive, className }) => {
  return (
    <Button onClick={onClick} variant={`clear`} title={isActive ? `Отключить` : `Включить`} className={className}>
      <FilterIcon height={25} width={25} className={cn(css.icon, { [css.active]: isActive })} />
    </Button>
  );
};

ToggleInputButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string
};

export default ToggleInputButton;
