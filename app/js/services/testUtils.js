import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore } from '../store';
import { LocationProvider, createHistory, createMemorySource } from '@reach/router';

export const renderWithRouter = (ui, { route = `/`, history = createHistory(createMemorySource(route)) } = {}) => {
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
};

// eslint-disable-next-line react/prop-types
const TestProvider = ({ store, children }) => <Provider store={store}>{children}</Provider>;

export function renderWithStore(ui, { store, ...otherOpts }) {
  return render(<TestProvider store={store}>{ui}</TestProvider>, otherOpts);
}

export function getTestStore() {
  const store = makeStore();
  const origDispatch = store.dispatch;
  store.dispatch = jest.fn(origDispatch);
  return store;
}

export const wait = milliseconds => new Promise(resolve => setTimeout(() => resolve(), milliseconds));
