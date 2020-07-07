import React from 'react';
import PropTypes from 'prop-types';
import css from './styles.css';

const CellWithTruncate = ({ cell: { value } }) => {
  return (
    <div className={css.truncate} title={value}>
      {value}
    </div>
  );
};

CellWithTruncate.propTypes = {
  cell: PropTypes.object.isRequired
};

export default CellWithTruncate;
