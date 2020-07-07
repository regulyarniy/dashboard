import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FlashMessage from '../FlashMessage';
import { MessageType } from '../../../constants';
import { getRandomString } from '../../../services/utils';

const defaultProps = {
  type: MessageType.NEUTRAL,
  message: `testText`,
  onDelete: jest.fn()
};

beforeEach(() => {
  jest.resetAllMocks();
});

test(`в сообщении отображается переданный текст`, () => {
  const randomString = getRandomString();
  const { container } = render(<FlashMessage {...defaultProps} message={randomString} />);

  expect(container.firstChild.textContent).toBe(randomString);
});

test(`по кнопке закрытия вызывается onDelete`, () => {
  const { queryByTitle } = render(<FlashMessage {...defaultProps} />);

  const hideButton = queryByTitle(/скрыть/i);
  fireEvent.click(hideButton);

  expect(defaultProps.onDelete).toHaveBeenCalled();
});
