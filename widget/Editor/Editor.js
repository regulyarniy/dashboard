import { h, customElement, host, useState, useRef, useEffect, useEvent } from 'atomico';
import { IconTitle, IconType, WEBCOMPONENT_PREFIX } from '../constants';
import stylesheet from './styles.pcss';
import css from 'style-loader!./styles.pcss';
import { init, exec } from 'pell';
import Icon from '../Icon/Icon';
import { hasTextContent } from '../hasTextContent';

const queryCommandState = command => document.queryCommandState(command);

const boldButtonMarkup = `<svg width="10" height="10" fill="#737b84"  version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181.395 181.395" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 181.395 181.395"><g><path d="m20.618,181.395v-181.395h62.293c22.506,0 40.074,4.174 52.699,12.521 12.623,8.346 18.936,20.785 18.936,37.313 0,8.639-2.033,16.318-6.104,23.049-4.07,6.729-10.34,11.795-18.813,15.199 10.631,2.408 18.479,7.246 23.547,14.514 5.064,7.268 7.6,15.637 7.6,25.104 0,17.691-5.939,31.064-17.814,40.115-11.879,9.055-28.904,13.58-51.082,13.58h-71.262zm42.235-105.772h20.93c9.551-0.166 16.695-2.014 21.43-5.545 4.734-3.529 7.102-8.699 7.102-15.51 0-7.725-2.41-13.35-7.225-16.881-4.82-3.529-12.211-5.295-22.178-5.295h-20.059v43.231zm0,27.908v45.473h29.027c8.971,0 15.699-1.766 20.184-5.297 4.484-3.529 6.729-8.947 6.729-16.256 0-7.891-1.932-13.85-5.795-17.879-3.861-4.027-10.111-6.041-18.748-6.041h-31.397z"/></g></svg>`;
const italicButtonMarkup = `<svg width="10" height="10" fill="#737b84"  version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181.5 181.5" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 181.5 181.5"><g><path d="M93.368,181.5H51.856L88.132,0h41.512L93.368,181.5z"/></g></svg>`;
const underlineButtonMarkup = `<svg width="10" height="10" fill="#737b84"  version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 230" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 230 230"><g><path d="M61.638,164.165C75.236,175.39,93.257,181,115.458,181c21.955,0,39.679-5.61,53.239-16.835   C182.254,152.942,189,137.13,189,116.731V0h-42v116.731c0,11.06-2.501,19.212-8.03,24.454c-5.529,5.244-13.284,7.864-23.524,7.864   c-10.322,0-18.312-2.642-23.965-7.926C85.829,135.841,83,127.711,83,116.731V0H41v116.731C41,137.13,48.039,152.942,61.638,164.165   z"/><rect width="230" y="197" height="33"/></g></svg>`;
const linkButtonMarkup = `<svg width="13" height="13" fill="#737b84"  id="Layer" enable-background="new 0 0 64 64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="m19 40c1.104 0 2-.896 2-2s-.896-2-2-2c-3.86 0-7-3.14-7-7 0-1.873.728-3.628 2.059-4.95 1.313-1.322 3.068-2.05 4.941-2.05h10c3.86 0 7 3.14 7 7 0 .258-.015.509-.048.78-.174 1.574-.885 3.052-2.017 4.176-.532.54-1.137.974-1.797 1.289-.997.476-1.419 1.669-.944 2.666.476.996 1.669 1.419 2.667.943 1.08-.516 2.063-1.219 2.908-2.075 1.763-1.75 2.885-4.08 3.156-6.539.051-.413.075-.819.075-1.24 0-6.065-4.935-11-11-11h-10c-2.947 0-5.709 1.147-7.77 3.221-2.083 2.07-3.23 4.832-3.23 7.779 0 6.065 4.935 11 11 11z"/><path d="m45 28c-1.104 0-2 .896-2 2s.896 2 2 2c3.86 0 7 3.141 7 7 0 1.873-.728 3.628-2.059 4.95-1.313 1.322-3.068 2.05-4.941 2.05h-10c-3.86 0-7-3.141-7-7 0-.258.015-.509.048-.78.174-1.574.885-3.052 2.017-4.176.532-.54 1.136-.974 1.796-1.289.997-.476 1.419-1.67.944-2.667s-1.669-1.418-2.667-.944c-1.081.516-2.064 1.22-2.908 2.076-1.763 1.75-2.885 4.08-3.156 6.538-.05.415-.074.821-.074 1.242 0 6.065 4.935 11 11 11h10c2.946 0 5.709-1.147 7.77-3.221 2.083-2.07 3.23-4.833 3.23-7.779 0-6.065-4.935-11-11-11z"/></svg>`;

const Editor = ({ text, hintid, icon, isUpdating }) => {
  const { updateHint } = window.EaistHintsService;
  const [module, page, field] = hintid.split(`:`);

  const [editorState, setEditorState] = useState(text || ``);
  const [iconState, setIconState] = useState(
    [IconType.INFO, IconType.QUESTION, IconType.EXCLAMATION].includes(icon) ? icon : IconType.INFO
  );

  const toggleEdit = useEvent(`ToggleEdit`, { bubbles: true, composed: true });

  const editorRef = useRef(null);

  const handleSave = () => {
    updateHint({ id: hintid, text: hasTextContent(editorState) ? editorState : ``, icon: iconState });
  };

  const handleChangeIcon = iconType => () => setIconState(iconType);

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = init({
        element: editorRef.current,
        onChange: html => setEditorState(html),
        actions: [
          {
            name: `bold`,
            icon: boldButtonMarkup,
            title: `Сделать жирным выделенный текст`,
            state: () => queryCommandState(`bold`),
            result: () => exec(`bold`)
          },
          {
            name: `italic`,
            icon: italicButtonMarkup,
            title: `Сделать наклонным выделенный текст`,
            state: () => queryCommandState(`italic`),
            result: () => exec(`italic`)
          },
          {
            name: `underline`,
            icon: underlineButtonMarkup,
            title: `Сделать подчеркнутым выделенный текст`,
            state: () => queryCommandState(`underline`),
            result: () => exec(`underline`)
          },
          {
            name: `link`,
            icon: linkButtonMarkup,
            title: `Создать ссылку из выделенного текста`,
            result: () => {
              const url = window.prompt(`Введите URL`);
              if (url) {
                exec(`createLink`, url);
              }
            }
          }
        ],
        classes: {
          actionbar: `pell-actionbar`,
          button: `pell-button`,
          content: `pell-content`,
          selected: `pell-button-selected`
        }
      });
      editorInstance.content.setAttribute(`spellcheck`, `false`);
      editorInstance.content.innerHTML = text && hasTextContent(text) ? text : ``;
    }
  }, []);

  return (
    <host shadowDom={true}>
      <style>{stylesheet.toString()}</style>
      <label className={css.label}>
        Иконка
        <div className={css.radioGroup}>
          {[IconType.INFO, IconType.QUESTION, IconType.EXCLAMATION].map(type => (
            <e2-radio-option
              className={css.radioWrapper}
              key={type}
              value={type}
              selected={iconState === type}
              onchange={handleChangeIcon(type)}
              title={IconTitle[type]}
            >
              <Icon type={type} />
            </e2-radio-option>
          ))}
        </div>
      </label>
      <label className={css.label}>Текст подсказки</label>
      <div ref={editorRef} className={`pell`} />
      <label className={css.label}>
        <a
          className={css.link}
          href={`/hints/logs?module=${module}&page=${page}&field=${field}`}
          target="_blank"
          rel="noreferrer"
        >
          История изменений
        </a>
      </label>
      <div className={css.controls}>
        <e2-button className={css.controlButton} type="neutral" onmouseup={toggleEdit}>
          <span>Закрыть</span>
        </e2-button>
        <e2-button className={css.controlButton} type="positive" onmouseup={handleSave}>
          <span>Сохранить</span>
        </e2-button>
      </div>
      {isUpdating && <e2-loader local={true} />}
    </host>
  );
};

Editor.props = {
  text: String,
  hintid: String,
  icon: String,
  isUpdating: Boolean
};

const tagName = `${WEBCOMPONENT_PREFIX}-editor`;
customElement(tagName, Editor);
export default tagName;
