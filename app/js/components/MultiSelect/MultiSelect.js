import React from 'react';
import PropTypes from 'prop-types';
import css from './styles.pcss';
import { useMenuState, Menu, MenuItem, MenuButton } from 'reakit/Menu';
import { Button } from 'reakit';
import cn from 'classnames';
import Checkbox from '../Checkbox/Checkbox';

const MultiSelect = ({ options, values, onChange, isClearable, ...rest }) => {
  const menuState = useMenuState({ orientation: `vertical` });

  const handleChange = option => event => {
    event.preventDefault();
    event.stopPropagation();
    const newValues = values.includes(option) ? values.filter(i => i !== option) : [...values, option];
    onChange(newValues);
  };

  const handleClear = () => onChange([]);

  const disclosureLabel = `${values.length || `не`} выбрано`;

  return (
    <div className={css.container} {...rest}>
      <MenuButton
        {...menuState}
        className={cn(css.disclosure, {
          [css.opened]: menuState.visible,
          [css.empty]: values.length === 0,
          [css.clearable]: isClearable
        })}
        title={disclosureLabel}
      >
        {disclosureLabel}
      </MenuButton>

      {isClearable && values.length > 0 && (
        <Button type={`button`} title={`Очистить`} className={css.clearButton} onClick={handleClear} />
      )}

      <Menu {...menuState} hideOnClickOutside preventBodyScroll aria-label="Варианты" className={css.menu}>
        {options.map(option => (
          <MenuItem
            {...menuState}
            key={`option-${option}`}
            focusable
            onClick={handleChange(option)}
            className={css.item}
            title={option}
          >
            <Checkbox checked={values.includes(option)} />
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  isClearable: PropTypes.bool
};

MultiSelect.defaultProps = {
  values: [],
  placeholder: `Сделайте свой выбор`,
  isClearable: false
};

export default MultiSelect;
