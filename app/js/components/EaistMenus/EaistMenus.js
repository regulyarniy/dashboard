import React, { Fragment } from 'react';
import css from './styles.pcss';
import EaistSidebar from '../EaistSidebar/EaistSidebar';
import PropTypes from 'prop-types';
import cn from 'classnames';

export const EaistMenus = ({ location, navigate }) => {
  return (
    <Fragment>
      <div className={cn(css.header)}>
        <e2-header noforcelogout />
      </div>
      <EaistSidebar location={location} navigate={navigate} />
    </Fragment>
  );
};

EaistMenus.propTypes = {
  location: PropTypes.object,
  navigate: PropTypes.func
};

export default EaistMenus;
