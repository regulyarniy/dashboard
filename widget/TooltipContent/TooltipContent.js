import { h, customElement, host, useEvent } from 'atomico';
import { IconType, WEBCOMPONENT_PREFIX } from '../constants';
import stylesheet from './styles.pcss';
import css from 'style-loader!./styles.pcss';
import Icon from '../Icon/Icon';
import Editor from '../Editor/Editor';

const TooltipContent = ({ text, isAdmin, hintid, icon, isUpdating, isEditing }) => {
  const toggleEdit = useEvent(`ToggleEdit`, { bubbles: true, composed: true });

  return (
    <host shadowDom={true}>
      <style>{stylesheet.toString()}</style>
      {isAdmin && (
        <div className={css.content}>
          <button className={css.edit} onclick={toggleEdit} disabled={isUpdating}>
            <Icon type={IconType.EDIT} />
          </button>
          {isEditing ? (
            <Editor text={text} hintid={hintid} icon={icon} isUpdating={isUpdating} />
          ) : isUpdating ? (
            <div className={css.loading}>Загружается...</div>
          ) : (
            <div innerHTML={text} />
          )}
        </div>
      )}
      {!isAdmin && <div className={css.content} innerHTML={text} />}
    </host>
  );
};

TooltipContent.props = {
  text: String,
  isAdmin: Boolean,
  hintid: String,
  icon: String,
  isUpdating: Boolean,
  isEditing: Boolean
};

const tagName = `${WEBCOMPONENT_PREFIX}-tooltip-content`;
customElement(tagName, TooltipContent);
export default tagName;
