import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as AccessibleCheckbox } from 'reakit/Checkbox';
import cn from 'classnames';
import css from './styles.pcss';

const Checkbox = ({ children, checked, disabled, undeterminated, onChange, ...rest }) => {
  const classesMap = {
    [css.unchecked]: !checked,
    [css.disabled]: disabled,
    [css.undeterminated]: undeterminated
  };

  return (
    <label className={cn(css.label, classesMap)}>
      <AccessibleCheckbox className={css.hidden} checked={checked} onChange={onChange} disabled={disabled} {...rest} />
      <span className={cn(css.checkbox, classesMap)} />
      {children}
    </label>
  );
};

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
  labelClassName: PropTypes.string,
  disabled: PropTypes.bool,
  undeterminated: PropTypes.bool
};

Checkbox.defaultProps = {
  onChange: () => {}
};

export default Checkbox;
