import React from 'react';
import ReactDatePicker from 'react-datepicker';
import registerDatepickerLocale from './registerDatepickerLocale';
import './styles.pcss';
import CustomHeader from './CustomHeader';
import PropTypes from 'prop-types';

registerDatepickerLocale();

const TIME_INTERVAL_IN_MIN = 10; // интервал точности задания времени для датапикера

const commonProps = {
  timeFormat: `HH:mm`,
  timeIntervals: TIME_INTERVAL_IN_MIN,
  timeCaption: `время`,
  popperPlacement: `top-end`,
  dateFormat: `dd-MM-yy`,
  popperModifiers: {
    offset: {
      enabled: true,
      offset: `5px, 10px`
    },
    preventOverflow: {
      enabled: true,
      escapeWithReference: true,
      boundariesElement: `viewport`
    }
  }
};

const DatePicker = ({ ...rest }) => {
  return <ReactDatePicker {...commonProps} renderCustomHeader={CustomHeader} {...rest} />;
};

DatePicker.propTypes = {
  adjustDateOnChange: PropTypes.bool,
  allowSameDay: PropTypes.bool,
  ariaLabelledBy: PropTypes.string,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarClassName: PropTypes.string,
  calendarContainer: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  customInput: PropTypes.element,
  customInputRef: PropTypes.string,
  dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  dateFormatCalendar: PropTypes.string,
  dayClassName: PropTypes.func,
  timeClassName: PropTypes.func,
  disabled: PropTypes.bool,
  disabledKeyboardNavigation: PropTypes.bool,
  dropdownMode: PropTypes.oneOf([`scroll`, `select`]),
  endDate: PropTypes.instanceOf(Date),
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  fixedHeight: PropTypes.bool,
  formatWeekNumber: PropTypes.func,
  highlightDates: PropTypes.array,
  id: PropTypes.string,
  includeDates: PropTypes.array,
  includeTimes: PropTypes.array,
  injectTimes: PropTypes.array,
  inline: PropTypes.bool,
  isClearable: PropTypes.bool,
  locale: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ locale: PropTypes.object })]),
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  monthsShown: PropTypes.number,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onWeekSelect: PropTypes.func,
  onClickOutside: PropTypes.func,
  onChangeRaw: PropTypes.func,
  onFocus: PropTypes.func,
  onInputClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMonthChange: PropTypes.func,
  onYearChange: PropTypes.func,
  onInputError: PropTypes.func,
  open: PropTypes.bool,
  onCalendarOpen: PropTypes.func,
  onCalendarClose: PropTypes.func,
  openToDate: PropTypes.instanceOf(Date),
  peekNextMonth: PropTypes.bool,
  placeholderText: PropTypes.string,
  popperContainer: PropTypes.func,
  popperClassName: PropTypes.string, // <PopperComponent/> props
  popperModifiers: PropTypes.object, // <PopperComponent/> props
  popperProps: PropTypes.object,
  preventOpenOnFocus: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  scrollableYearDropdown: PropTypes.bool,
  scrollableMonthYearDropdown: PropTypes.bool,
  selected: PropTypes.instanceOf(Date),
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  showMonthDropdown: PropTypes.bool,
  showPreviousMonths: PropTypes.bool,
  showMonthYearDropdown: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  showYearDropdown: PropTypes.bool,
  strictParsing: PropTypes.bool,
  forceShowMonthNavigation: PropTypes.bool,
  showDisabledMonthNavigation: PropTypes.bool,
  startDate: PropTypes.instanceOf(Date),
  startOpen: PropTypes.bool,
  tabIndex: PropTypes.number,
  timeCaption: PropTypes.string,
  title: PropTypes.string,
  todayButton: PropTypes.node,
  useWeekdaysShort: PropTypes.bool,
  formatWeekDay: PropTypes.func,
  value: PropTypes.string,
  weekLabel: PropTypes.string,
  withPortal: PropTypes.bool,
  yearDropdownItemNumber: PropTypes.number,
  shouldCloseOnSelect: PropTypes.bool,
  showTimeInput: PropTypes.bool,
  showMonthYearPicker: PropTypes.bool,
  showQuarterYearPicker: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
  showTimeSelectOnly: PropTypes.bool,
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
  minTime: PropTypes.instanceOf(Date),
  maxTime: PropTypes.instanceOf(Date),
  excludeTimes: PropTypes.array,
  useShortMonthInDropdown: PropTypes.bool,
  clearButtonTitle: PropTypes.string,
  previousMonthButtonLabel: PropTypes.string,
  nextMonthButtonLabel: PropTypes.string,
  previousYearButtonLabel: PropTypes.string,
  nextYearButtonLabel: PropTypes.string,
  timeInputLabel: PropTypes.string,
  renderCustomHeader: PropTypes.func,
  renderDayContents: PropTypes.func,
  wrapperClassName: PropTypes.string,
  inlineFocusSelectedMonth: PropTypes.bool,
  onDayMouseEnter: PropTypes.func,
  onMonthMouseLeave: PropTypes.func,
  showPopperArrow: PropTypes.bool
};

export default DatePicker;
