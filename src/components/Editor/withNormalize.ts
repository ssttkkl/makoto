import { Editor, Element, Transforms } from 'slate';

export const withNewLineAtEnd = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Editor.isEditor(node)) {
      const { children } = node;

      // 保证最后有一行空行
      let addNewLine = false;

      if (children.length === 0) {
        addNewLine = true;
      } else {
        const lastElement = children[children.length - 1];
        if (
          !Element.isElement(lastElement) ||
          lastElement.type !== 'paragraph'
        ) {
          addNewLine = true;
        } else if (
          lastElement.children.length !== 1 ||
          lastElement.children[0].text !== ''
        ) {
          addNewLine = true;
        }
      }

      if (addNewLine) {
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: '' }] },
          { at: [children.length] },
        );
      }
    }

    normalizeNode(entry);
  };

  return editor;
};
