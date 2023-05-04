import type { ComponentType, ReactNode } from 'react';
import type * as Slate from 'slate';
import { createEditor, Element } from 'slate';
import {
  createEditor as createEditorFactory,
  createHyperscript,
} from 'slate-hyperscript';

import type { ListsSchema } from './types';
import { ListType } from './types';
import { withLists } from './withLists';

type AllOrNothing<T extends object> =
  | { [key in keyof T]: T[key] }
  | { [key in keyof T]?: never };

export const PARAGRAPH_TYPE = 'paragraph';
export const LINK_TYPE = 'link';
export const DIVIDER_TYPE = 'divider';
export const ORDERED_LIST_TYPE = ListType.ORDERED;
export const UNORDERED_LIST_TYPE = ListType.UNORDERED;
export const LIST_ITEM_TYPE = 'li';
export const LIST_ITEM_TEXT_TYPE = 'li-text';

export const Editor = 'editor' as any as ComponentType<
  Partial<Omit<Slate.BaseEditor, 'children'>> & {
    children: ReactNode;
  }
>;
export const Untyped = 'untyped' as any as ComponentType<{
  children?: ReactNode;
}>;
export const Anchor = 'anchor' as any as ComponentType<
  AllOrNothing<Slate.BasePoint>
>;
export const Focus = 'focus' as any as ComponentType<
  AllOrNothing<Slate.BasePoint>
>;
export const Cursor = 'cursor' as any as ComponentType;
export const Selection = 'selection' as any as ComponentType<{
  children: ReactNode;
}>;
export const Fragment = 'fragment' as any as ComponentType<{
  children: ReactNode;
}>;
export const Text = 'text' as any as ComponentType<{
  children?: ReactNode;
  [mark: string]: any;
}>;
export const Paragraph = PARAGRAPH_TYPE as any as ComponentType<{
  children: ReactNode;
}>;
export const Link = LINK_TYPE as any as ComponentType<{
  href: string;
  children?: ReactNode;
}>;
export const Divider = DIVIDER_TYPE as any as ComponentType<{
  children?: ReactNode;
}>;
export const OrderedList = ORDERED_LIST_TYPE as any as ComponentType<{
  children: ReactNode;
}>;
export const UnorderedList = UNORDERED_LIST_TYPE as any as ComponentType<{
  children: ReactNode;
}>;
export const ListItem = LIST_ITEM_TYPE as any as ComponentType<{
  children: ReactNode;
}>;
export const ListItemText = LIST_ITEM_TEXT_TYPE as any as ComponentType<{
  children: ReactNode;
}>;

const INLINE_ELEMENTS = [LINK_TYPE];
const VOID_ELEMENTS = [DIVIDER_TYPE];

const SCHEMA: ListsSchema = {
  isConvertibleToListTextNode(node) {
    return Element.isElementType(node, PARAGRAPH_TYPE);
  },
  isDefaultTextNode(node) {
    return Element.isElementType(node, PARAGRAPH_TYPE);
  },
  isListNode(node, type) {
    if (type) {
      return Element.isElementType(node, type);
    }
    return (
      Element.isElementType(node, ORDERED_LIST_TYPE) ||
      Element.isElementType(node, UNORDERED_LIST_TYPE)
    );
  },
  isListItemNode(node) {
    return Element.isElementType(node, LIST_ITEM_TYPE);
  },
  isListItemTextNode(node) {
    return Element.isElementType(node, LIST_ITEM_TEXT_TYPE);
  },
  createDefaultTextNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: PARAGRAPH_TYPE };
  },
  createListNode(type: ListType = ListType.UNORDERED, props = {}) {
    return { children: [{ text: '' }], ...props, type };
  },
  createListItemNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: LIST_ITEM_TYPE };
  },
  createListItemTextNode(props = {}) {
    return { children: [{ text: '' }], ...props, type: LIST_ITEM_TEXT_TYPE };
  },
};

export const jsx = createHyperscript({
  elements: {
    untyped: {},
    [PARAGRAPH_TYPE]: { type: PARAGRAPH_TYPE },
    [LINK_TYPE]: { type: LINK_TYPE },
    [DIVIDER_TYPE]: { type: DIVIDER_TYPE },
    [ORDERED_LIST_TYPE]: { type: ORDERED_LIST_TYPE },
    [UNORDERED_LIST_TYPE]: { type: UNORDERED_LIST_TYPE },
    [LIST_ITEM_TYPE]: { type: LIST_ITEM_TYPE },
    [LIST_ITEM_TEXT_TYPE]: { type: LIST_ITEM_TEXT_TYPE },
  },
  creators: {
    editor: createEditorFactory(function () {
      const decorators = [
        withInlineElements,
        withVoidElements,
        withLists(SCHEMA),
      ];

      return decorators.reduce(
        (editor, decorate) => decorate(editor),
        createEditor(),
      );
    }),
  },
});

function withVoidElements<T extends Slate.Editor>(
  editor: T,
  types: string[] = VOID_ELEMENTS,
): T {
  const { isVoid } = editor;
  editor.isVoid = function (node) {
    return (
      types.some((type) => Element.isElementType(node, type)) || isVoid(node)
    );
  };
  return editor;
}

function withInlineElements<T extends Slate.Editor>(
  editor: T,
  types: string[] = INLINE_ELEMENTS,
): T {
  const { isInline } = editor;
  editor.isInline = function (node) {
    return (
      types.some((type) => Element.isElementType(node, type)) || isInline(node)
    );
  };
  return editor;
}

export function noop() {
  return null;
}
