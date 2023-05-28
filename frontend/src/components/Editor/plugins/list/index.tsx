import { UnorderedListOutlined, OrderedListOutlined } from '@ant-design/icons';
import {
  withLists,
  ListType,
  ListsEditor,
  withListsReact,
} from './slate-lists';
import isHotkey from 'is-hotkey';
import { CSSProperties } from 'react';
import { Editor, Element, Node } from 'slate';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';
import ToolbarButton from '../../components/ToolbarButton';
import { EditorPlugin, ElementEditorPlugin } from '../base';
import { ToolbarItem } from '../types';
import {
  canDeleteBackward,
  isCursorInEmptyListItem,
  getListItemsInRange,
} from './slate-lists/lib';
import {
  increaseDepth,
  decreaseDepth,
  splitListItem,
  wrapInList,
  unwrapList,
} from './slate-lists/transformations';
import { determineSelectedElement } from '../../utils';

export class ListPlugin extends ElementEditorPlugin {
  key = 'list';

  override render(
    props: RenderElementProps,
    style: CSSProperties,
  ): React.ReactNode | null {
    const { element, attributes, children } = props;
    switch (element.type) {
      case 'ordered-list':
        return (
          <ol {...attributes} style={style}>
            {children}
          </ol>
        );
      case 'unordered-list':
        return (
          <ul {...attributes} style={style}>
            {children}
          </ul>
        );
      case 'list-item':
        return (
          <li {...attributes} style={style}>
            {children}
          </li>
        );
      case 'list-item-text':
        return (
          <div {...attributes} style={style}>
            {children}
          </div>
        );
    }
    return null;
  }

  override withEditor(editor: ReactEditor): ReactEditor & ListsEditor {
    const withListsPlugin = withLists({
      isConvertibleToListTextNode(node: Node) {
        return Element.isElementType(node, 'paragraph');
      },
      isDefaultTextNode(node: Node) {
        return Element.isElementType(node, 'paragraph');
      },
      isListNode(node: Node, type?: ListType) {
        if (type) {
          return Element.isElementType(node, type);
        }
        return (
          Element.isElementType(node, 'ordered-list') ||
          Element.isElementType(node, 'unordered-list')
        );
      },
      isListItemNode(node: Node) {
        return Element.isElementType(node, 'list-item');
      },
      isListItemTextNode(node: Node) {
        return Element.isElementType(node, 'list-item-text');
      },
      createDefaultTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: 'paragraph' };
      },
      createListNode(type: ListType = ListType.UNORDERED, props = {}) {
        const nodeType =
          type === ListType.ORDERED ? 'ordered-list' : 'unordered-list';
        return { children: [{ text: '' }], ...props, type: nodeType };
      },
      createListItemNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: 'list-item' };
      },
      createListItemTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: 'list-item-text' };
      },
    });
    return withListsReact(withListsPlugin(editor));
  }

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: ReactEditor,
    writeable: boolean,
  ): boolean {
    if (!writeable) {
      return false;
    }

    let handled = false;

    if (isHotkey('tab', event.nativeEvent)) {
      increaseDepth(editor);
      handled = true;
    }

    if (isHotkey('shift+tab', event.nativeEvent)) {
      decreaseDepth(editor);
      handled = true;
    }

    if (
      isHotkey('backspace', event.nativeEvent) &&
      !canDeleteBackward(editor)
    ) {
      decreaseDepth(editor);
      handled = true;
    }

    if (isHotkey('enter', event.nativeEvent)) {
      if (isCursorInEmptyListItem(editor)) {
        decreaseDepth(editor);
        handled = true;
      } else {
        const listItemsInSelection = getListItemsInRange(
          editor,
          editor.selection,
        );
        if (listItemsInSelection.length > 0) {
          splitListItem(editor);
          handled = true;
        }
      }
    }

    if (handled) {
      // Slate does not always trigger normalization when one would expect it to.
      // So we want to force it after we perform lists operations, as it fixes
      // many unexpected behaviors.
      // https://github.com/ianstormtaylor/slate/issues/3758
      Editor.normalize(editor, { force: true });
    }

    return handled;
  }
}

const InsertUnorderedList: React.FC = () => {
  const editor = useSlate();
  const isActive =
    determineSelectedElement(editor, 'type', { shallow: true }) ===
    'unordered-list';
  return (
    <ToolbarButton
      isActive={isActive}
      onClick={() => {
        if (!isActive) {
          wrapInList(editor, ListType.UNORDERED);
        } else {
          unwrapList(editor);
        }
      }}
    >
      <UnorderedListOutlined />
    </ToolbarButton>
  );
};
export class InsertUnorderedListPlugin extends EditorPlugin {
  key = 'unordered-list';
  toolbarItem: ToolbarItem = {
    title: '无序列表',
    renderWriteable: () => <InsertUnorderedList />,
  };
}

const InsertOrderedList: React.FC = () => {
  const editor = useSlate();
  const isActive =
    determineSelectedElement(editor, 'type', { shallow: true }) ===
    'ordered-list';
  return (
    <ToolbarButton
      isActive={isActive}
      onClick={() => {
        if (!isActive) {
          wrapInList(editor, ListType.ORDERED);
        } else {
          unwrapList(editor);
        }
      }}
    >
      <OrderedListOutlined />
    </ToolbarButton>
  );
};

export class InsertOrderedListPlugin extends EditorPlugin {
  key = 'ordered-list';
  toolbarItem: ToolbarItem = {
    title: '有序列表',
    renderWriteable: () => <InsertOrderedList />,
  };
}
