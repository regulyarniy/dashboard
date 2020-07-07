import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import css from './styles.pcss';

const Input = ({
  type,
  onChange,
  value,
  placeholder,
  className,
  wrapperClassName,
  hasError,
  disabled,
  isClearable,
  ...rest
}) => {
  const handleChange = event => {
    onChange(event.target.value);
  };

  const handleClear = event => {
    event.preventDefault();
    event.stopPropagation();
    onChange(``);
  };

  return (
    <div className={cn(wrapperClassName, css.wrapper)}>
      <input
        className={cn(className, css.input, {
          [css.hasError]: hasError,
          [css.clearable]: isClearable
        })}
        type={type}
        onChange={handleChange}
        value={value || ``}
        placeholder={placeholder || ``}
        disabled={disabled}
        {...rest}
      />
      {isClearable && value && <button className={css.clear} type="button" onClick={handleClear} title="Очистить" />}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  hasError: PropTypes.bool,
  disabled: PropTypes.bool,
  isClearable: PropTypes.bool
};

Input.defaultProps = {
  type: `text`,
  placeholder: ``,
  hasError: false,
  disabled: false,
  isClearable: false,
  onChange: () => {}
};

export default Input;
