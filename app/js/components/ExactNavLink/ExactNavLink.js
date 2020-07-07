import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from '@reach/router';

const ExactNavLink = ({ className, activeClassName, isPartiallyMatched, ...rest }) => {
  const isActive = ({ isCurrent, isPartiallyCurrent }) => {
    const propsWithActiveClassName = {
      className: cn(className, activeClassName)
    };

    const propsWithDefaultClassName = { className };

    if (isCurrent || (isPartiallyMatched && isPartiallyCurrent)) {
      return propsWithActiveClassName;
    } else {
      return propsWithDefaultClassName;
    }
  };

  return <Link getProps={isActive} {...rest} />;
};

ExactNavLink.propTypes = {
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  isPartiallyMatched: PropTypes.bool
};

ExactNavLink.defaultProps = {
  isPartiallyMatched: true
};

export default ExactNavLink;
