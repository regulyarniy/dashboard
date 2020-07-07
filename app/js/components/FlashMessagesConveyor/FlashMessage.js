import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import css from './styles.pcss';
import { MessageType } from '../../constants';
import posed from 'react-pose';

// пропсы описаны на анимированном компоненте
// eslint-disable-next-line react/prop-types
export const FlashMessage = ({ type, message, onDelete }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(css.message, {
        [css.neutral]: type === MessageType.NEUTRAL,
        [css.error]: type === MessageType.ERROR,
        [css.success]: type === MessageType.SUCCESS,
        [css.warning]: type === MessageType.WARNING
      })}
    >
      {message}
      <button type="button" className={css.close} title="Скрыть" onClick={onDelete}>
        <e2-glyph name="clear" />
      </button>
    </div>
  );
};

const PosedFlashMessage = posed(forwardRef(FlashMessage))({
  enter: { opacity: 1, y: 0, transition: { type: `spring` } },
  exit: { opacity: 0, y: 50 }
});

PosedFlashMessage.propTypes = {
  type: PropTypes.oneOf(Object.values(MessageType)),
  message: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default PosedFlashMessage;
