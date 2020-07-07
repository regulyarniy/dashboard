import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import css from './styles.css';
import { validateUrl } from '../../services/utils';
import cn from 'classnames';

const InputPopup = ({ position, onApply, onClose }) => {
  const [initialPosition] = useState(position);
  const [value, setValue] = useState(`https://`);
  const inputRef = useRef(null);

  const isValid = validateUrl(value);

  const handleKeyPress = event => {
    if (event.key === `Enter` && isValid) {
      onApply(value);
    } else if (event.key === `Escape`) {
      onClose();
    }
  };

  const stopPropagate = event => {
    event.stopPropagation();
  };

  const handleChange = event => setValue(event.target.value || ``);

  const handleBlur = () => {
    if (!value || !isValid) {
      onClose();
    } else {
      onApply(value);
    }
  };

  // оключаем скролл страницы когда появляется окошко ввода ссылки
  useEffect(() => {
    document.body.classList.add(css.noScroll);
    return () => {
      document.body.classList.remove(css.noScroll);
    };
  }, []);

  // устанавливаем фокус в поле после маунта
  useEffect(() => {
    setTimeout(() => inputRef.current.focus(), 100);
  }, []);

  return (
    <div
      className={css.popupWrapper}
      style={{
        left: initialPosition.left,
        top: `${parseInt(initialPosition.top) + 30}px`
      }}
      onClickCapture={stopPropagate}
    >
      <input
        ref={inputRef}
        className={cn(css.popupInput, { [css.notValid]: !isValid })}
        type="text"
        onKeyDown={handleKeyPress}
        onFocus={stopPropagate}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`URL вида: http(s)://ya.ru`}
      />
    </div>
  );
};

InputPopup.propTypes = {
  position: PropTypes.object.isRequired,
  onApply: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default InputPopup;
