import React from 'react';
import PropTypes from 'prop-types';
import css from './styles.css';

const Link = ({ contentState, entityKey, clickLink, children }) => {
  const { url } = contentState.getEntity(entityKey).getData();
  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    clickLink(entityKey);
  };
  return (
    <a href={url} onClick={handleClick} title={`Удалить ссылку на ${url}`} className={css.link}>
      {children}
    </a>
  );
};

Link.propTypes = {
  contentState: PropTypes.object.isRequired,
  entityKey: PropTypes.string.isRequired,
  clickLink: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default Link;
