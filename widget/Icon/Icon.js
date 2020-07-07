import { h, customElement, host } from 'atomico';
import { WEBCOMPONENT_PREFIX, IconType } from '../constants';
import css from 'style-loader!./styles.pcss';
import stylesheet from './styles.pcss';
import infoIcon from '../img/info.svg';
import exclamationIcon from '../img/exclamation.svg';
import questionIcon from '../img/question.svg';
import emptyIcon from '../img/empty.svg';
import editIcon from '../img/edit.svg';

const SVG = {
  [IconType.EXCLAMATION]: exclamationIcon,
  [IconType.INFO]: infoIcon,
  [IconType.QUESTION]: questionIcon,
  [IconType.EMPTY]: emptyIcon,
  [IconType.EDIT]: editIcon
};

const Icon = ({ hidden, type }) => {
  return (
    <host shadowDom={true}>
      <style>{stylesheet.toString()}</style>
      {<div className={css.icon} innerHTML={hidden ? `` : SVG[type]} />}
    </host>
  );
};

Icon.props = {
  hidden: { type: Boolean, value: false },
  type: String
};

const tagName = `${WEBCOMPONENT_PREFIX}-icon`;
customElement(tagName, Icon);
export default tagName;
