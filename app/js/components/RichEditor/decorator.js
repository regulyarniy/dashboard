import { CompositeDecorator } from 'draft-js';
import Link from './Link';

function getEntity(character) {
  return character.getEntity();
}

function entityFilter(character, entityType, contentState) {
  const entityKey = getEntity(character);
  return entityKey !== null && contentState.getEntity(entityKey).getType() === entityType;
}

function findEntities(entityType, contentBlock, callback, contentState) {
  return contentBlock.findEntityRanges(character => entityFilter(character, entityType, contentState), callback);
}

export const decorator = ({ clickLink }) =>
  new CompositeDecorator([
    {
      strategy: (contentBlock, callback, contentState) => {
        return findEntities(`LINK`, contentBlock, callback, contentState);
      },
      component: Link,
      props: { clickLink }
    }
  ]);
