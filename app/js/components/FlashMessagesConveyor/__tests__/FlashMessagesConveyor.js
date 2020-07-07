import React from 'react';
import 'regenerator-runtime/runtime';
import { render, fireEvent } from '@testing-library/react';
import { FlashMessagesConveyor } from '../FlashMessagesConveyor';
import { getRandomString } from '../../../services/utils';

const defaultProps = {
  messages: new Array(15).fill(0).map(() => ({ id: getRandomString(5), message: getRandomString() })),
  messagesDelete: jest.fn()
};

beforeEach(() => {
  jest.resetAllMocks();
});

test(`рендерит сообщения`, () => {
  const { queryByText } = render(<FlashMessagesConveyor {...defaultProps} />);

  defaultProps.messages.forEach(message => {
    expect(queryByText(message.message)).not.toBeNull();
  });
});

test(`добавляет обработчик в каждое сообщение на удаление по id`, () => {
  const { queryByText } = render(<FlashMessagesConveyor {...defaultProps} />);

  defaultProps.messages.forEach(message => {
    const messageElem = queryByText(message.message);
    const button = messageElem.querySelector(`button`);
    fireEvent.click(button);
    expect(defaultProps.messagesDelete).lastCalledWith({
      id: message.id
    });
  });
});
