import React from 'react';
import PropTypes from 'prop-types';
import pageCss from '../styles.pcss';
import HintEditor from '../../components/HintEditor/HintEditor';
import BackButton from '../../components/BackButton/BackButton';
import Button from '../../components/Button/Button';
import { MODULE_NAME } from '../../constants';
import { navigate } from '@reach/router';

const handleNavigateBack = () => window.history.back();

const SingleHintPage = ({ id }) => {
  const decodedId = window.decodeURIComponent(id);

  const [module, page, field] = id.split(`:`);
  const logsHref = `/${MODULE_NAME}/logs?module=${module}&page=${page}&field=${field}`;
  const handleClickHistory = event => {
    event.preventDefault();
    event.stopPropagation();
    navigate(logsHref);
  };

  return (
    <section className={pageCss.page}>
      <header className={pageCss.header}>
        <h1 className={pageCss.title}>
          <BackButton onClick={handleNavigateBack} className={pageCss.backButton} title={`Назад`} />
          Подсказка: {decodedId}
        </h1>
        <Button variant={`neutral`} onClick={handleClickHistory}>
          История изменений
        </Button>
      </header>

      <HintEditor id={decodedId} />
    </section>
  );
};

SingleHintPage.propTypes = {
  id: PropTypes.string
};

export default SingleHintPage;
