import React from 'react';
import PropTypes from 'prop-types';
import css from './header.pcss';
import format from 'date-fns/format';
import locale from 'date-fns/locale/ru';
import Button from '../Button/Button';
import ArrowIcon from './arrow.svg';
import DoubleArrowIcon from './double-arrow.svg';
import cn from 'classnames';
import subMonths from 'date-fns/subMonths';
import addMonths from 'date-fns/addMonths';

const getYear = date => parseInt(format(date, `yyyy`, { locale }));

const getPrevMonthName = date => format(subMonths(date, 1), `LLLL`, { locale });

const getNextMonthName = date => format(addMonths(date, 1), `LLLL`, { locale });

const CustomHeader = ({ date, changeYear, decreaseMonth, increaseMonth }) => {
  const displayDate = date || new Date();
  const displayYear = getYear(displayDate);
  const prevYear = displayYear - 1;
  const nextYear = displayYear + 1;
  const decreaseYear = () => changeYear(prevYear);
  const increaseYear = () => changeYear(nextYear);

  return (
    <div className={css.header}>
      <div className={css.controls}>
        <Button onClick={decreaseYear} className={cn(css.button, css.decreaseYear)} title={prevYear}>
          <DoubleArrowIcon height={12} width={12} />
        </Button>

        <Button
          onClick={decreaseMonth}
          className={cn(css.button, css.decreaseMonth)}
          title={getPrevMonthName(displayDate)}
        >
          <ArrowIcon height={12} width={12} />
        </Button>
      </div>

      {format(displayDate, `LLLL yyyy`, { locale })}

      <div className={css.controls}>
        <Button
          onClick={increaseMonth}
          className={cn(css.button, css.increaseMonth)}
          title={getNextMonthName(displayDate)}
        >
          <ArrowIcon height={12} width={12} />
        </Button>

        <Button onClick={increaseYear} className={cn(css.button, css.increaseYear)} title={nextYear}>
          <DoubleArrowIcon height={12} width={12} />
        </Button>
      </div>
    </div>
  );
};

CustomHeader.propTypes = {
  date: PropTypes.object,
  changeYear: PropTypes.func.isRequired,
  decreaseMonth: PropTypes.func.isRequired,
  increaseMonth: PropTypes.func.isRequired
};

export default CustomHeader;
