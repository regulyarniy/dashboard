import { h, customElement, host } from 'atomico';
import { WEBCOMPONENT_PREFIX } from './constants';
import Store from './Store/Store';
import './EaistHintsService/EaistHintsService';
import css from 'style-loader!./Container/styles.pcss';
import stylesheet from './Container/styles.pcss';
import '../app/js/server';

window.Promise.all([
  // e2 web-elements
  import(/* webpackIgnore: true */ `/components/radio.js`),
  import(/* webpackIgnore: true */ `/components/button.js`),
  import(/* webpackIgnore: true */ `/components/loader.js`)
])
  .then(() => {
    const Widget = ({ hintid }) => {
      return (
        <host shadowDom={true}>
          <Store hintid={hintid} />
        </host>
      );
    };

    Widget.props = {
      hintid: String
    };

    customElement(`${WEBCOMPONENT_PREFIX}-widget`, Widget);
  })
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(`Не удалось загрузить зависимости, необходимые для виджета подсказок!`, e);

    // рендерим пустой контейнер в виджете
    const Widget = () => {
      return (
        <host shadowDom={true}>
          <style>{stylesheet.toString()}</style>
          <div className={css.container} />
        </host>
      );
    };

    customElement(`${WEBCOMPONENT_PREFIX}-widget`, Widget);
  });
