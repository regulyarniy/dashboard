import React from 'react';
import { render } from '@testing-library/react';
import ExactNavLink from '../ExactNavLink';
import { Router } from '@reach/router';
import { renderWithRouter } from '../../../services/testUtils';

// eslint-disable-next-line react/prop-types
const TestRoute = ({ link, children }) => (
  <div>
    {link}
    {children}
  </div>
);

test(`рендерит ссылку с текстом`, () => {
  const link = <ExactNavLink to="/">testtext</ExactNavLink>;

  const { getByText } = render(
    <Router>
      <TestRoute path={`/`} link={link} />
    </Router>
  );

  expect(getByText(`testtext`)).not.toBeNull();
});

test(`добавляет класс в ссылку`, () => {
  const link = (
    <ExactNavLink to="/" className={`testclass`}>
      t
    </ExactNavLink>
  );

  const { container } = render(
    <Router>
      <TestRoute path={`/`} link={link} />
    </Router>
  );

  expect(container.querySelector(`.testclass`)).not.toBeNull();
});

test(`добавляет активный класс в ссылку на тот же роут`, () => {
  const link = (
    <ExactNavLink to="/" activeClassName={`activetestclass`}>
      t
    </ExactNavLink>
  );

  const { container } = render(
    <Router>
      <TestRoute path={`/`} link={link} />
    </Router>
  );

  expect(container.querySelector(`.activetestclass`)).not.toBeNull();
});

test(`не добавляет активный класс в ссылку на другом роуте`, () => {
  const link = (
    <ExactNavLink to="/test" activeClassName={`activetestclass`}>
      t
    </ExactNavLink>
  );

  const { container } = render(
    <Router>
      <TestRoute path={`/`} link={link} />
    </Router>
  );

  expect(container.querySelector(`a`)).not.toBeNull();
  expect(container.querySelector(`.activetestclass`)).toBeNull();
});

test(`без частичного совпадения: добавляет активный класс при совпадении роута`, () => {
  const link = (
    <ExactNavLink to="/nested" activeClassName={`activetestclass`} isPartiallyMatched={false}>
      t
    </ExactNavLink>
  );

  const { container } = renderWithRouter(
    <Router>
      <TestRoute path={`/`} link={null}>
        <TestRoute path={`nested`} link={link} />
      </TestRoute>
    </Router>,
    { route: `/nested` }
  );

  expect(container.querySelector(`.activetestclass`)).not.toBeNull();
});

test(`без частичного совпадения: не добавляет активный класс на роут, начинающийся со ссылки`, () => {
  const link = (
    <ExactNavLink to="/nested" activeClassName={`activetestclass`} isPartiallyMatched={false}>
      t
    </ExactNavLink>
  );

  const { container } = renderWithRouter(
    <Router>
      <TestRoute path={`/*`} link={null}>
        <TestRoute path={`nested`} link={link} />
      </TestRoute>
    </Router>,
    { route: `/nested/deep` }
  );

  expect(container.querySelector(`a`)).not.toBeNull();
  expect(container.querySelector(`.activetestclass`)).toBeNull();
});

test(`с частичным совпадением: добавляет активный класс на роут, начинающийся со ссылки`, () => {
  const link = (
    <ExactNavLink to="/nested" activeClassName={`activetestclass`} isPartiallyMatched={true}>
      t
    </ExactNavLink>
  );

  const { container } = renderWithRouter(
    <Router>
      <TestRoute path={`/*`} link={null}>
        <TestRoute path={`nested`} link={link} />
      </TestRoute>
    </Router>,
    { route: `/nested/deep` }
  );

  expect(container.querySelector(`a`)).not.toBeNull();
  expect(container.querySelector(`.activetestclass`)).not.toBeNull();
});
