import React from 'react';
import PropTypes from 'prop-types';
import css from './styles.pcss';
import cn from 'classnames';
import { Button as AccessibleButton } from 'reakit/Button';

const Variant = {
  CLEAR: `clear`,
  PRIMARY: `primary`,
  SECONDARY: `secondary`,
  NEUTRAL: `neutral`,
  WARNING: `warning`,
  DANGER: `danger`
};

const Button = ({ variant, onClick, children, type, disabled, className, ...rest }) => {
  return (
    <AccessibleButton
      className={cn(className, {
        [css.base]: variant !== undefined,
        [css.clear]: variant === Variant.CLEAR,
        [css.primary]: variant === Variant.PRIMARY,
        [css.secondary]: variant === Variant.SECONDARY,
        [css.neutral]: variant === Variant.NEUTRAL,
        [css.warning]: variant === Variant.WARNING,
        [css.danger]: variant === Variant.DANGER
      })}
      type={type}
      onClick={onClick}
      {...rest}
      disabled={disabled}
    >
      {children}
    </AccessibleButton>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(Object.values(Variant)),
  children: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

Button.defaultProps = {
  type: `button`,
  disabled: false,
  children: ``,
  onClick: () => {}
};

export default Button;
