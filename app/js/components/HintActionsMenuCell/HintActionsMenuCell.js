import React from 'react';
import PropTypes from 'prop-types';
import { useMenuState, Menu, MenuItem, MenuButton } from 'reakit/Menu';
import css from './styles.pcss';
import tableCss from '../StyledReactTable/styles.pcss';
import MenuIcon from './menu.svg';
import cn from 'classnames';
import { navigate } from '@reach/router';
import { MODULE_NAME } from '../../constants';

const linkProps = { as: `a`, target: `_blank` };

const HintActionsMenuCell = ({
  cell: {
    row: {
      original: { id }
    }
  }
}) => {
  const menuState = useMenuState({ orientation: `vertical`, placement: `auto-start` });

  const handleOpenMenu = event => event.stopPropagation();

  const hintHref = `/${MODULE_NAME}/hint/${id}`;
  const handleOpenHint = event => {
    event.preventDefault();
    event.stopPropagation();
    navigate(hintHref);
  };

  const [module, page, field] = id.split(`:`);
  const logsHref = `/${MODULE_NAME}/logs?module=${module}&page=${page}&field=${field}`;
  const handleOpenLogs = event => {
    event.preventDefault();
    event.stopPropagation();
    navigate(logsHref);
  };

  return (
    <div className={cn(css.container, tableCss.onHoverCell)} data-testid="HintActionsMenuCell">
      <MenuButton {...menuState} className={css.button} title="Действия" onClick={handleOpenMenu}>
        <MenuIcon width={20} height={20} />
      </MenuButton>
      <Menu {...menuState} hideOnClickOutside aria-label="Меню" className={css.menu}>
        <MenuItem {...menuState} focusable className={css.item} onClick={handleOpenHint} {...linkProps} href={hintHref}>
          Открыть
        </MenuItem>
        <MenuItem {...menuState} focusable className={css.item} onClick={handleOpenLogs} {...linkProps} href={logsHref}>
          История изменений
        </MenuItem>
      </Menu>
    </div>
  );
};

HintActionsMenuCell.propTypes = {
  cell: PropTypes.object.isRequired
};

export default HintActionsMenuCell;
