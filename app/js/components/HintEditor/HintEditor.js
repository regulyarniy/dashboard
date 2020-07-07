import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './styles.pcss';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { formatISODateISOToMoscowTZWithSeconds } from '../../services/utils';
import actions from '../../store/actions';
import Preloader from './Preloader';
import RichEditor from '../RichEditor/RichEditor';
import Radio from '../Radio/Radio';
import { IconType } from '../../constants';
import ExclamationIcon from './exclamation.svg';
import InfoIcon from './info.svg';
import QuestionIcon from './question.svg';
import cn from 'classnames';

const HintEditor = ({ id }) => {
  const dispatch = useDispatch();
  const { items, loadingIds } = useSelector(state => state.hints);

  const [editedHint, setEditedHint] = useState({
    id: ``,
    module: ``,
    page: ``,
    field: ``,
    updateDate: new Date().toISOString(),
    text: ``,
    icon: ``
  });

  const hint = items.find(h => h.id === id);
  const isLoading = loadingIds.includes(id);

  useEffect(() => {
    if (hint === undefined) {
      dispatch(actions.hints.requestById({ id }));
    }
    if (hint !== undefined) {
      setEditedHint({ ...hint, icon: hint.icon || IconType.INFO });
    }
  }, [hint]);

  if (hint === undefined) {
    return <Preloader />;
  }

  const handleSubmit = event => {
    event.preventDefault();
    dispatch(actions.hints.updateById({ id, text: editedHint.text, icon: editedHint.icon }));
  };

  const handleChangeIcon = icon => () => setEditedHint({ ...editedHint, icon });

  const handleChangeText = text => setEditedHint({ ...editedHint, text });

  return isLoading ? (
    <Preloader />
  ) : (
    <section className={css.editor}>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.layout}>
          <div className={css.half}>
            <label className={css.label}>
              Подсистема
              <div className={css.line}>
                <Input disabled value={editedHint.module} />
              </div>
            </label>
            <label className={css.label}>
              Экран
              <div className={css.line}>
                <Input disabled value={editedHint.page} />
              </div>
            </label>
            <label className={css.label}>
              Поле
              <div className={css.line}>
                <Input disabled value={editedHint.field} />
              </div>
            </label>
            <label className={css.label}>
              Дата обновления
              <div className={css.line}>
                <Input disabled value={formatISODateISOToMoscowTZWithSeconds(editedHint.updateDate)} />
              </div>
            </label>
          </div>

          <div className={css.half}>
            <label className={css.label}>
              Иконка
              <div className={cn(css.line, css.wrap)}>
                <div className={css.radioWrapper} title={`Информация`}>
                  <Radio
                    data-testid={IconType.INFO}
                    onChange={handleChangeIcon(IconType.INFO)}
                    checked={[undefined, IconType.INFO].includes(editedHint.icon)}
                  />
                  <InfoIcon width={20} height={20} />
                </div>
                <div className={css.radioWrapper} title={`Вопрос`}>
                  <Radio
                    data-testid={IconType.QUESTION}
                    onChange={handleChangeIcon(IconType.QUESTION)}
                    checked={editedHint.icon === IconType.QUESTION}
                  />
                  <QuestionIcon width={20} height={20} />
                </div>
                <div className={css.radioWrapper} title={`Внимание`}>
                  <Radio
                    data-testid={IconType.EXCLAMATION}
                    onChange={handleChangeIcon(IconType.EXCLAMATION)}
                    checked={editedHint.icon === IconType.EXCLAMATION}
                  />
                  <ExclamationIcon width={20} height={20} />
                </div>
              </div>
            </label>

            <div className={css.lineWrapper}>
              <RichEditor
                key={editedHint.id}
                initialContent={editedHint.text || ``}
                label={`Текст подсказки`}
                onChange={handleChangeText}
              />
            </div>
          </div>
        </div>

        <div className={css.controls}>
          <Button onClick={handleSubmit} variant={`primary`}>
            Сохранить
          </Button>
        </div>
      </form>
    </section>
  );
};

HintEditor.propTypes = {
  id: PropTypes.string
};

export default HintEditor;
