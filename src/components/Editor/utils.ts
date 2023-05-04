import { Descendant, Editor, Element, Text } from 'slate';

// 判断该区域中某属性是否都是同一个值
export function determineLeaf<T>(
  fragment: Descendant[],
  format: string,
): T | null | undefined {
  let current: T | null | undefined = undefined;
  for (const x of fragment) {
    if (Text.isText(x)) {
      const value = x[format];
      if (current === undefined) {
        current = value;
      }
      if (value !== undefined && current !== value) {
        return null;
      }
    } else {
      const value: T | null | undefined = determineLeaf(x.children, format);
      if (current === undefined) {
        current = value;
      }
      if (value !== undefined && current !== value) {
        return null;
      }
    }
  }

  return current;
}

export function determineSelectedLeaf<T>(
  editor: Editor,
  format: string,
): T | null | undefined {
  let current: T | null | undefined = undefined;
  const selection = editor.selection;
  if (selection !== null) {
    const fragment = Editor.fragment(editor, selection);
    current = determineLeaf(fragment, format);
  }
  return current;
}

// 判断该区域中某属性是否都是同一个值
export function determineElement<T>(
  fragment: Descendant[],
  format: string,
  opts?: { shallow?: boolean },
): T | null | undefined {
  let current: T | null | undefined = undefined;
  for (const x of fragment) {
    if (Element.isElement(x)) {
      const value = x[format];
      if (current === undefined) {
        current = value;
      }
      if (value !== undefined && current !== value) {
        return null;
      }

      if (opts?.shallow !== true) {
        const value2: T | null | undefined = determineElement(
          x.children,
          format,
          opts,
        );
        if (current === undefined) {
          current = value2;
        }
        if (value2 !== undefined && current !== value2) {
          return null;
        }
      }
    }
  }

  return current;
}

export function determineSelectedElement<T>(
  editor: Editor,
  format: string,
  opts?: { shallow?: boolean },
): T | null | undefined {
  let current: T | null | undefined = undefined;
  const selection = editor.selection;
  if (selection !== null) {
    const fragment = Editor.fragment(editor, selection);
    current = determineElement(fragment, format, opts);
  }
  return current;
}
