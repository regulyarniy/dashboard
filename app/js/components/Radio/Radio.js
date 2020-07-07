import React from 'react';
import PropTypes from 'prop-types';
import css from './styles.pcss';
import cn from 'classnames';

const Radio = ({ children, disabled, onChange, ...rest }) => {
  const classesMap = {
    [css.disabled]: disabled
  };

  return (
    <label className={cn(css.label, classesMap)}>
      <input className={cn(css.hidden, css.native)} type="radio" onChange={onChange} disabled={disabled} {...rest} />
      <span className={cn(css.radio, classesMap)} />
      {children}
    </label>
  );
};

Radio.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool
};

Radio.defaultProps = {
  onChange: () => {}
};

export default Radio;
