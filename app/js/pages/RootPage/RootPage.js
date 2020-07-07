import React, { useEffect } from 'react';
import EaistMenus from '../../components/EaistMenus/EaistMenus';
import css from './styles.pcss';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../store/actions';
import Spinner from '../../components/Spinner/Spinner';
import { Router, Redirect, Location, globalHistory } from '@reach/router';
import { MODULE_NAME } from '../../constants';
import HintsPage from '../HintsPage/HintsPage';
import SingleHintPage from '../SingleHintPage/SingleHintPage';
import LogsPage from '../LogsPage/LogsPage';
import { QueryParamProvider } from 'use-query-params';

const RootPage = () => {
  const dispatch = useDispatch();

  // запрашиваем контекст при маунте
  useEffect(() => {
    dispatch(actions.eaist.requestContext());
    dispatch(actions.config.request());
  }, []);

  const eaistContext = useSelector(state => state.eaist.context);
  const isConfigLoaded = useSelector(state => state.config.isLoaded);

  return (
    <Location>
      {({ location, navigate }) => (
        <div className={css.container}>
          {eaistContext && isConfigLoaded ? (
            <>
              <EaistMenus location={location} navigate={navigate} />
              <div className={css.content}>
                <QueryParamProvider reachHistory={globalHistory}>
                  <Router basepath={`/${MODULE_NAME}`} location={location}>
                    <Redirect from="/" to={`/${MODULE_NAME}/all/`} noThrow />

                    <HintsPage path="all/*" />
                    <LogsPage path="logs/*" />

                    <SingleHintPage path="hint/:id" />
                  </Router>
                </QueryParamProvider>
              </div>
            </>
          ) : (
            <Spinner />
          )}
        </div>
      )}
    </Location>
  );
};

RootPage.propTypes = {};

export default RootPage;
