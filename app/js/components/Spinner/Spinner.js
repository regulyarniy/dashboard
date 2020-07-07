import React from 'react';
import css from './styles.pcss';

const Spinner = () => {
  return (
    <>
      <div className={css.overlay} />
      <div className={css.indicator} />
    </>
  );
};

export default Spinner;
