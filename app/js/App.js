import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import RootPage from './pages/RootPage/RootPage';
import FlashMessagesConveyor from './components/FlashMessagesConveyor/FlashMessagesConveyor';
import { useMount } from 'react-essential-tools';
import Spinner from './components/Spinner/Spinner';

const Content = () => (
  <>
    <RootPage />
    <FlashMessagesConveyor />
  </>
);

const HotReloadableContent = hot(Content);

const App = () => {
  const [isDepsLoaded, setIsDepsLoaded] = useState(false);

  useMount(() => {
    window.Promise.all([
      // e2 web-elements
      import(/* webpackIgnore: true */ `/components/sidebar-v2Widget.js`),
      import(/* webpackIgnore: true */ `/components/headerWidget.js`),
      import(/* webpackIgnore: true */ `/components/glyph.js`)
    ])
      .then(() => {
        setIsDepsLoaded(true);
      })
      .catch(() => {
        setTimeout(() => window.location.reload(), 5000);
      });
  });

  return isDepsLoaded ? (
    <Provider store={store}>
      <HotReloadableContent />
    </Provider>
  ) : (
    <Spinner />
  );
};

App.propTypes = {};

export default App;
