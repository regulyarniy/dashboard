import { SelectionState } from 'draft-js';
import getRangesForDraftEntity from 'draft-js/lib/getRangesForDraftEntity';

export const getEntitySelectionState = (contentState, selectionState, entityKey) => {
  const selectionKey = selectionState.getAnchorKey();
  const selectionOffset = selectionState.getAnchorOffset();
  const block = contentState.getBlockForKey(selectionKey);
  const blockKey = block.getKey();

  let entitySelection = selectionState;
  getRangesForDraftEntity(block, entityKey).forEach(range => {
    if (range.start <= selectionOffset && selectionOffset <= range.end) {
      entitySelection = new SelectionState({
        anchorOffset: range.start,
        anchorKey: blockKey,
        focusOffset: range.end,
        focusKey: blockKey,
        isBackward: false,
        hasFocus: selectionState.getHasFocus()
      });
    }
  });
  return entitySelection;
};
