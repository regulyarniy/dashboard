import { customElement, h, useState, useEffect, useRef } from 'atomico';
import { WEBCOMPONENT_PREFIX } from '../constants';
import Container from '../Container/Container';

const Store = ({ hintid }) => {
  const hints = window.EaistHintsService ? window.EaistHintsService.dictionary : {};
  const isAdmin = window.EaistHintsService ? window.EaistHintsService.isAdmin : false;
  const isUpdating = window.EaistHintsService ? window.EaistHintsService.isUpdating : false;
  const [store, updateStore] = useState({ hintid, hints, isAdmin, isUpdating });

  useEffect(() => {
    let unsubscribe = () => {};
    if (window.EaistHintsService) {
      unsubscribe = window.EaistHintsService.subscribe(({ dictionary, isAdmin, isUpdating }) =>
        updateStore({ ...store, isAdmin, hints: dictionary, isUpdating })
      );
    } else {
      throw new Error(`EaistHintsService not defined!`);
    }
    return unsubscribe;
  }, []);

  const containerRef = useRef(null);

  if (containerRef.current) {
    containerRef.current.store = store;
  }

  return (
    <host shadowDom={true}>
      <Container store={store} />
    </host>
  );
};

Store.props = {
  hintid: String
};

const tagName = `${WEBCOMPONENT_PREFIX}-store`;
customElement(tagName, Store);
export default tagName;
