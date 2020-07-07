import React, { useMemo } from 'react';
import css from './styles.pcss';
import PropTypes from 'prop-types';
import { MessageType } from '../../constants';
import FlashMessage from './FlashMessage';
import actions from '../../store/actions';
import { connect } from 'react-redux';
import { PoseGroup } from 'react-pose';

const mapStateToProps = state => ({
  messages: state.messages
});

const mapDispatchToProps = {
  messagesDelete: actions.messages.remove
};

export const FlashMessagesConveyor = ({ messages, messagesDelete }) => {
  const messagesLayout = useMemo(
    () =>
      messages.map(message => {
        const handleDelete = () => messagesDelete({ id: message.id });
        return <FlashMessage key={message.id} onDelete={handleDelete} message={message.message} type={message.type} />;
      }),
    [messages]
  );

  return (
    <div className={css.conveyor}>
      <PoseGroup>{messagesLayout}</PoseGroup>
    </div>
  );
};

FlashMessagesConveyor.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.oneOf(Object.values(MessageType)),
      id: PropTypes.string
    })
  ).isRequired,
  messagesDelete: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessagesConveyor);
