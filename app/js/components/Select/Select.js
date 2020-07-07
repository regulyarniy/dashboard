import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import css from './styles.pcss';
import { useMenuState, Menu, MenuItem, MenuButton } from 'reakit/Menu';
import { Button } from 'reakit';
import cn from 'classnames';
import Input from '../Input/Input';

const Select = ({ options, value, onChange, placeholder, isClearable, isSearchable, ...rest }) => {
  const menuState = useMenuState({ orientation: `vertical` });
  const [search, setSearch] = useState(``);

  const handleSearchChange = value => {
    setSearch(value);
  };

  const filteredOptions = useMemo(() => options.filter(o => o.toLowerCase().includes(search.toLowerCase())), [search]);

  const handleChange = option => event => {
    event.preventDefault();
    menuState.hide();
    onChange(option);
  };

  const hasValue = value !== null;

  return (
    <div className={css.container} {...rest}>
      <MenuButton
        {...menuState}
        className={cn(css.disclosure, {
          [css.opened]: menuState.visible,
          [css.empty]: !hasValue,
          [css.clearable]: isClearable
        })}
      >
        {hasValue ? value : placeholder}
      </MenuButton>

      {isClearable && hasValue && (
        <Button type={`button`} title={`Очистить`} className={css.clearButton} onClick={handleChange(null)} />
      )}

      <Menu
        {...menuState}
        preventBodyScroll
        aria-label="Варианты"
        className={cn(css.menu, { [css.searchable]: isSearchable })}
      >
        {isSearchable && menuState.visible && (
          <div className={css.searchBox}>
            <Input value={search} onChange={handleSearchChange} placeholder={`поиск`} />
          </div>
        )}
        <div className={css.scrollableBox}>
          {filteredOptions.map(option => (
            <MenuItem
              {...menuState}
              key={`option-${option}`}
              focusable
              onClick={handleChange(option)}
              className={cn(css.item, {
                [css.selected]: option === value
              })}
              title={option}
            >
              {option}
            </MenuItem>
          ))}
        </div>
      </Menu>
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.instanceOf(null)]), // null or string
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool
};

Select.defaultProps = {
  value: null,
  placeholder: `Сделайте свой выбор`,
  isClearable: false,
  isSearchable: false
};

export default Select;
