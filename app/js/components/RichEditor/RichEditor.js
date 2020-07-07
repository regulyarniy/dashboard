import React, { useRef, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, RichUtils } from 'draft-js';
import css from './styles.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import BoldIcon from './bold.svg';
import ItalicIcon from './italic.svg';
import UnderlineIcon from './underline.svg';
import LinkIcon from './link.svg';
import InputPopup from './InputPopup';
import { decorator } from './decorator';
import { removeEntity } from './removeEntity';
import { getEntitySelectionState } from './getEntitySelectionState';
import Button from '../Button/Button';
import cn from 'classnames';

const InlineStyle = {
  BOLD: `BOLD`,
  ITALIC: `ITALIC`,
  UNDERLINE: `UNDERLINE`
};

const toHTML = convertToHTML({
  // eslint-disable-next-line react/display-name
  styleToHTML: style => {
    switch (style) {
      case InlineStyle.BOLD:
        return <b />;
      case InlineStyle.ITALIC:
        return <i />;
      case InlineStyle.UNDERLINE:
        return <u />;
    }
  },
  blockToHTML: block => {
    if (block.type === `unstyled`) {
      return <div />;
    }
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === `LINK`) {
      return (
        <a href={entity.data.url} target={`_blank`}>
          {originalText}
        </a>
      );
    }
    return originalText;
  }
});

const fromHTML = convertFromHTML({
  htmlToStyle: (nodeName, node, currentStyle) => {
    switch (nodeName) {
      case `b`:
        return currentStyle.add(InlineStyle.BOLD);
      case `i`:
        return currentStyle.add(InlineStyle.ITALIC);
      case `u`:
        return currentStyle.add(InlineStyle.UNDERLINE);
      default:
        return currentStyle;
    }
  },
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === `a`) {
      return createEntity(`LINK`, `MUTABLE`, { url: node.href });
    }
  }
});

function getPosition() {
  try {
    const range = window.getSelection().getRangeAt(0);
    return range.getBoundingClientRect();
  } catch (e) {
    return document.body.getBoundingClientRect();
  }
}

const RichEditor = ({ initialContent, onChange, label, disabled, hasError }) => {
  const [editorState, setEditorState] = useState(EditorState.createWithContent(fromHTML(initialContent)));
  const [isLinkEditorOpened, setIsLinkEditorOpened] = useState(false);
  const editorRef = useRef(null);

  const position = useMemo(() => {
    return getPosition();
  }, [editorState]);

  const focusEditor = () => editorRef.current.focus();

  const handleChange = newState => {
    const state = EditorState.set(newState, {
      decorator: decorator({ clickLink: handleClickLink })
    });
    setEditorState(state);
    onChange(toHTML(state.getCurrentContent()));
  };

  //apply decorator after mount
  useEffect(() => {
    handleChange(editorState);
  }, []);

  const toggleInlineStyle = style => event => {
    event.stopPropagation();
    const state = RichUtils.toggleInlineStyle(editorState, style);
    handleChange(state);
  };

  const handleOpenLinkEditor = event => {
    event.preventDefault();
    setIsLinkEditorOpened(true);
  };

  const handleCloseLinkEditor = () => setIsLinkEditorOpened(false);

  const handleAddLink = url => {
    const currentContent = editorState.getCurrentContent();
    const contentWithEntity = currentContent.createEntity(`LINK`, `MUTABLE`, {
      url
    });
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    const selection = editorState.getSelection();
    const state = RichUtils.toggleLink(editorState, selection, entityKey);
    handleChange(state);
    handleCloseLinkEditor();
  };

  // remove link
  const handleClickLink = entityKey => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const selectionForEntity = getEntitySelectionState(currentContent, selection, entityKey);
    const stateWithSelection = EditorState.acceptSelection(editorState, selectionForEntity);
    const state = removeEntity(stateWithSelection);
    handleChange(state);
  };

  const isControlsEnabled = !disabled && !editorState.getSelection().isCollapsed(); // isCollapsed когда не выбран текст

  return (
    <div className={css.container} onClick={focusEditor}>
      {label}
      <div className={css.controls}>
        <Button
          onClick={toggleInlineStyle(InlineStyle.BOLD)}
          title="Сделать жирным выделенный текст"
          disabled={!isControlsEnabled}
          variant={`clear`}
          className={css.button}
        >
          <BoldIcon width={10} height={10} />
        </Button>
        <Button
          onClick={toggleInlineStyle(InlineStyle.ITALIC)}
          title="Сделать наклонным выделенный текст"
          disabled={!isControlsEnabled}
          variant={`clear`}
          className={css.button}
        >
          <ItalicIcon width={10} height={10} />
        </Button>
        <Button
          onClick={toggleInlineStyle(InlineStyle.UNDERLINE)}
          title="Сделать подчеркнутым выделенный текст"
          disabled={!isControlsEnabled}
          variant={`clear`}
          className={css.button}
        >
          <UnderlineIcon width={10} height={10} />
        </Button>
        <Button
          onClick={handleOpenLinkEditor}
          title="Создать ссылку из выделенного текста"
          disabled={!isControlsEnabled}
          variant={`clear`}
          className={css.button}
        >
          <LinkIcon width={20} height={20} />
        </Button>
      </div>
      <div className={cn(css.textArea, { [css.hasError]: hasError, [css.disabled]: disabled })}>
        <Editor ref={editorRef} editorState={editorState} onChange={handleChange} readOnly={disabled} />
        {isLinkEditorOpened && (
          <InputPopup position={position} onApply={handleAddLink} onClose={handleCloseLinkEditor} />
        )}
      </div>
    </div>
  );
};

RichEditor.propTypes = {
  initialContent: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool
};

export default RichEditor;
