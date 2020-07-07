import React from 'react';
import HintEditor from '../HintEditor';
import actions from '../../../store/actions';
import { fireEvent } from '@testing-library/react';
import { getTestStore, renderWithStore } from '../../../services/testUtils';

jest.mock(`../Preloader.js`, () => () => <div data-testid={`Preloader`} />);

test(`рендерится без ошибок`, () => {
  const store = getTestStore();
  renderWithStore(<HintEditor />, { store });
});

test(`если нет хинта с id в сторе, то запрашивает его при маунте`, () => {
  const store = getTestStore();
  const testId = `testId`;
  renderWithStore(<HintEditor id={testId} />, { store });

  expect(store.dispatch).toHaveBeenLastCalledWith(
    expect.objectContaining({
      type: actions.hints.requestById.type,
      payload: { id: testId }
    })
  );
});

test(`если нет хинта с id в сторе, то показывает прелоадер`, () => {
  const store = getTestStore();
  const testId = `testId`;
  const { queryByTestId } = renderWithStore(<HintEditor id={testId} />, { store });

  expect(queryByTestId(`Preloader`)).toBeVisible();
});

test(`если хинт загружается, то показывает прелоадер`, () => {
  const store = getTestStore();
  const testId = `testId`;
  const { queryByTestId } = renderWithStore(<HintEditor id={testId} />, { store });

  store.dispatch(actions.hints.setStateForTests({ loadingIds: [testId], items: [{ id: testId }] }));

  expect(queryByTestId(`Preloader`)).toBeVisible();
});

test(`если другие хинты загружаются, но данный хинт есть в сторе, то не показывает прелоадер`, () => {
  const store = getTestStore();
  const testId = `testId`;
  const { queryByTestId } = renderWithStore(<HintEditor id={testId} />, { store });

  store.dispatch(actions.hints.setStateForTests({ loadingIds: [`id1`, `id2`], items: [{ id: testId }] }));

  expect(queryByTestId(`Preloader`)).toBeNull();
});

test(`показывает поле "подсистема"`, () => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId, module: `Подсистема123` }] }));

  const { getByDisplayValue } = renderWithStore(<HintEditor id={testId} />, { store });

  expect(getByDisplayValue(`Подсистема123`)).toBeVisible();
});

test(`показывает поле "экран"`, () => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId, page: `Экран123` }] }));

  const { getByDisplayValue } = renderWithStore(<HintEditor id={testId} />, { store });

  expect(getByDisplayValue(`Экран123`)).toBeVisible();
});

test(`показывает поле "поле"`, () => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId, field: `Поле123` }] }));

  const { getByDisplayValue } = renderWithStore(<HintEditor id={testId} />, { store });

  expect(getByDisplayValue(`Поле123`)).toBeVisible();
});

test(`показывает дату обновления хинта в московской таймзоне`, () => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId, updateDate: `2020-07-02T04:40:36.071Z` }] }));

  const { getByDisplayValue } = renderWithStore(<HintEditor id={testId} />, { store });

  expect(getByDisplayValue(`02.07.20 07:40:36`)).toBeVisible();
});

test.each([
  [undefined, `INFO`],
  [`INFO`, `INFO`],
  [`QUESTION`, `QUESTION`],
  [`EXCLAMATION`, `EXCLAMATION`]
])(`выбрана соответсвующая иконка`, (icon, inputDataTestId) => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId, icon }] }));

  const { queryByTestId } = renderWithStore(<HintEditor id={testId} />, { store });

  expect(queryByTestId(inputDataTestId)).toBeChecked();
});

test(`показывает текст хинта`, () => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId, text: `Тестовый хинт` }] }));

  const { getByText } = renderWithStore(<HintEditor id={testId} />, { store });

  expect(getByText(`Тестовый хинт`)).toBeVisible();
});

test(`оправляет в стор новую иконку`, () => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId, icon: `INFO` }] }));

  const { getByTestId, getByText } = renderWithStore(<HintEditor id={testId} />, { store });
  const otherIconCheckbox = getByTestId(`QUESTION`);
  fireEvent.click(otherIconCheckbox);
  const saveButton = getByText(`Сохранить`);
  fireEvent.click(saveButton);

  expect(store.dispatch).toHaveBeenLastCalledWith(
    expect.objectContaining({
      type: actions.hints.updateById.type,
      payload: expect.objectContaining({ id: testId, icon: `QUESTION` })
    })
  );
});

test(`оправляет в стор новый текст`, () => {
  const store = getTestStore();
  const testId = `testId`;
  store.dispatch(actions.hints.setStateForTests({ items: [{ id: testId }] }));

  const { getByText } = renderWithStore(<HintEditor id={testId} />, { store });
  const saveButton = getByText(`Сохранить`);
  fireEvent.click(saveButton);

  // редактор всегда добавляет дивы
  expect(store.dispatch).toHaveBeenLastCalledWith(
    expect.objectContaining({
      type: actions.hints.updateById.type,
      payload: expect.objectContaining({ id: testId, text: `<div></div>` })
    })
  );
});
