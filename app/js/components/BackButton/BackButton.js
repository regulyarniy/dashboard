import React from 'react';
import Icon from './double-arrow.svg';
import Button from '../Button/Button';
import css from './styles.css';
import cn from 'classnames';
import PropTypes from 'prop-types';

const BackButton = ({ className, ...props }) => {
  return (
    <Button className={cn(className, css.button)} variant={`clear`} {...props}>
      <Icon className={css.icon} width={16} height={16} />
    </Button>
  );
};

BackButton.propTypes = {
  className: PropTypes.string
};

export default BackButton;
