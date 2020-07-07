import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import css from './styles.pcss';
import { MODULE_NAME } from '../../constants';

const EaistSidebar = ({ location, navigate }) => {
  const { pathname } = location;

  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.onSelect = navigate;
    }
  }, [sidebarRef.current]);

  return (
    <div className={css.sidebar}>
      <e2-sidebar-v2 ref={sidebarRef} selected={pathname}>
        <e2-sidebar-v2-tab title="Подсказки" value={`/${MODULE_NAME}`}>
          <e2-sidebar-v2-tab title="Все подсказки" value={`/all`} />
          <e2-sidebar-v2-tab title="История изменений" value={`/logs`} />
        </e2-sidebar-v2-tab>
      </e2-sidebar-v2>
    </div>
  );
};

EaistSidebar.propTypes = {
  isCollapsed: PropTypes.bool,
  location: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired
};

export default EaistSidebar;
