import React from 'react';
import PropTypes from 'prop-types';
import css from './styles.css';
import cn from 'classnames';

const HistoryExpander = ({ row: { changes } }) => {
  if (!changes || changes.length === 0) {
    return null;
  }

  return (
    <div className={css.container}>
      <div className={cn(css.row, css.header)}>
        <div className={css.cell}>Поле</div>
        <div className={css.cell}>Старое значение</div>
        <div className={css.cell}>Новое значение</div>
      </div>
      {changes.map(({ fieldName, oldValue, newValue }) => {
        return (
          <div key={fieldName} className={css.row}>
            <div className={css.cell} title={fieldName}>
              {fieldName}
            </div>
            <div className={css.cell} title={oldValue}>
              {oldValue === `null` ? `нет значения` : oldValue}
            </div>
            <div className={css.cell} title={newValue}>
              {newValue === `null` ? `нет значения` : newValue}
            </div>
          </div>
        );
      })}
    </div>
  );
};

HistoryExpander.propTypes = {
  row: PropTypes.object.isRequired
};

export default HistoryExpander;
