import type { Editor } from 'slate';

import {
  canDeleteBackward,
  getListItemsInRange,
  getListsInRange,
  getListType,
  getNestedList,
  getParentList,
  getParentListItem,
  isCursorAtStartOfListItem,
  isCursorInEmptyListItem,
  isInList,
  isListItemContainingText,
} from './lib';
import {
  decreaseDepth,
  decreaseListItemDepth,
  increaseDepth,
  increaseListItemDepth,
  mergeListWithPreviousSiblingList,
  moveListItemsToAnotherList,
  moveListToListItem,
  setListType,
  splitListItem,
  unwrapList,
  wrapInList,
} from './transformations';
import type { ListsEditor as Type } from './types';

export type ListsEditor = Type; // Workaround name collision

/* eslint-disable @typescript-eslint/no-redeclare */
export const ListsEditor = {
  isListsEditor<T extends Editor>(editor: T): editor is T & ListsEditor {
    return 'isListNode' in editor;
  },

  canDeleteBackward,
  decreaseDepth,
  decreaseListItemDepth,
  getListItemsInRange,
  getListsInRange,
  getListType,
  getNestedList,
  getParentList,
  getParentListItem,
  increaseDepth,
  increaseListItemDepth,
  isCursorAtStartOfListItem,
  isCursorInEmptyListItem,
  isInList,
  isListItemContainingText,
  mergeListWithPreviousSiblingList,
  moveListItemsToAnotherList,
  moveListToListItem,
  setListType,
  splitListItem,
  unwrapList,
  wrapInList,
};
