import { h, customElement, host, useEffect, useRef, useState } from 'atomico';
import { WEBCOMPONENT_PREFIX, IconType } from '../constants';
import css from 'style-loader!./styles.pcss';
import stylesheet from './styles.pcss';
import Icon from '../Icon/Icon';
import TooltipContent from '../TooltipContent/TooltipContent';
import { createPopper } from '@popperjs/core';
import { hasTextContent } from '../hasTextContent';

const HIDE_DELAY_IN_MS = 150;

const Container = ({ store }) => {
  const { dictionary, isAdmin } = window.EaistHintsService;
  const hintid = store.hintid;
  const hintText = dictionary[hintid] && dictionary[hintid].text;
  const isIconHidden = !isAdmin && !hasTextContent(hintText);
  const hintIconType =
    isAdmin && !hasTextContent(hintText)
      ? IconType.EMPTY
      : (dictionary[hintid] && dictionary[hintid].icon) || IconType.INFO;
  const isUpdating = store.isUpdating;
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing(!isEditing);

  const isShowTooltipNeeded = isAdmin || Boolean(hintText);

  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const showTooltip = () => {
    if (isShowTooltipNeeded) {
      resetTimeout();
      setIsTooltipShown(true);
    }
  };
  const hideTooltip = () => {
    if (!isEditing) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setIsTooltipShown(false);
        setIsEditing(false);
      }, HIDE_DELAY_IN_MS);
    }
  };

  // tooltip init on redraw
  useEffect(() => {
    if (containerRef.current && tooltipRef.current) {
      const popperInstance = createPopper(containerRef.current, tooltipRef.current, {
        placement: `bottom-start`,
        modifiers: [
          {
            name: `offset`,
            options: {
              offset: [0, 8]
            }
          }
        ]
      });
      return popperInstance.destroy;
    }
  }, [store]);

  // click outside listener on mount
  useEffect(() => {
    const listener = event => {
      if (
        event &&
        event.target &&
        event.target instanceof window.Element &&
        event.target.getAttribute(`hintid`) !== hintid // на document всегда всплывает клик c target основного хоста shadowRoot
      ) {
        hideTooltip();
      }
    };
    window.document.addEventListener(`click`, listener);
    return () => {
      window.document.removeEventListener(`click`, listener);
    };
  }, []);

  return (
    <host shadowDom={true}>
      <style>{stylesheet.toString()}</style>
      <div
        className={css.container}
        aria-describedby="tooltip"
        ref={containerRef}
        onmouseenter={showTooltip}
        onmouseleave={hideTooltip}
      >
        <Icon hidden={isIconHidden} type={hintIconType} />
      </div>
      <div
        className={`${css.tooltip} ${isTooltipShown ? css.show : css.hide}`}
        role="tooltip"
        ref={tooltipRef}
        onmouseenter={showTooltip}
        onmouseleave={hideTooltip}
      >
        <TooltipContent
          text={hintText}
          icon={hintIconType}
          isAdmin={isAdmin}
          hintid={hintid}
          isUpdating={isUpdating}
          isEditing={isEditing}
          onToggleEdit={toggleEdit}
        />
      </div>
    </host>
  );
};

Container.props = {
  store: Object
};

const tagName = `${WEBCOMPONENT_PREFIX}-container`;
customElement(tagName, Container);
export default tagName;
