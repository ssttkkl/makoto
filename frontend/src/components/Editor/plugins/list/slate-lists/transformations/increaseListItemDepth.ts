import { Editor, Element, Node, Path, Transforms } from 'slate';

import { NESTED_LIST_PATH_INDEX } from '../constants';
import { getListType, getPrevSibling } from '../lib';
import type { ListsEditor } from '../types';

/**
 * Increases nesting depth of "list-item" at a given Path.
 */
export function increaseListItemDepth(
  editor: ListsEditor,
  listItemPath: Path,
): void {
  const previousListItem = getPrevSibling(editor, listItemPath);

  if (!previousListItem) {
    // The existence of previous "list-item" is necessary and sufficient for the operation to be possible.
    // See: https://en.wikipedia.org/wiki/Necessity_and_sufficiency
    return;
  }

  const [previousListItemNode, previousListItemPath] = previousListItem;

  if (!editor.isListItemNode(previousListItemNode)) {
    // Sanity check.
    return;
  }

  const previousListItemChildListPath = [
    ...previousListItemPath,
    NESTED_LIST_PATH_INDEX,
  ];
  const previousListItemHasChildList = Node.has(
    editor,
    previousListItemChildListPath,
  );

  Editor.withoutNormalizing(editor, () => {
    // Ensure there's a nested "list" in the previous sibling "list-item".
    if (!previousListItemHasChildList) {
      const listNodePath = Path.ancestors(listItemPath, { reverse: true })[0];
      const listNode = Node.get(editor, listNodePath);
      Transforms.insertNodes(
        editor,
        editor.createListNode(getListType(editor, listNode), { children: [] }),
        {
          at: previousListItemChildListPath,
        },
      );
    }

    const previousListItemChildList = Node.get(
      editor,
      previousListItemChildListPath,
    );

    if (
      Element.isElement(previousListItemChildList) &&
      editor.isListNode(previousListItemChildList)
    ) {
      const index = previousListItemHasChildList
        ? previousListItemChildList.children.length
        : 0;

      Transforms.moveNodes(editor, {
        at: listItemPath,
        to: [...previousListItemChildListPath, index],
      });
    }
  });
}
