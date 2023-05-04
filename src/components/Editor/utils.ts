import { Descendant, Editor, Element, Text } from 'slate';

// 判断该区域中某属性是否都是同一个值
export function determineLeaf<T>(
  fragment: Descendant[],
  format: string,
  defaultFormat: T,
): T | null {
  let current: T | null | undefined = undefined;
  for (const x of fragment) {
    if (Text.isText(x)) {
      const value = x[format] ?? defaultFormat;
      if (current === undefined) {
        current = value;
      } else if (current !== value) {
        return null;
      }
    } else {
      const value = determineLeaf(x.children, format, current ?? defaultFormat);
      if (current === undefined) {
        current = value;
      } else if (current !== value) {
        return null;
      }
    }
  }

  if (current === undefined) {
    current = defaultFormat;
  }

  return current;
}

export function determinSelectedLeaf<T>(
  editor: Editor,
  format: string,
  defaultFormat: T,
): T | null {
  let current: T | null = defaultFormat;
  const selection = editor.selection;
  if (selection !== null) {
    const fragment = Editor.fragment(editor, selection);
    current = determineLeaf(fragment, format, defaultFormat);
  }
  return current;
}

// 判断该区域中某属性是否都是同一个值
export function determineElement<T>(
  fragment: Descendant[],
  format: string,
  defaultFormat: T,
  opts?: { shallow?: boolean },
): T | null {
  let current: T | null | undefined = undefined;
  for (const x of fragment) {
    if (Element.isElement(x)) {
      const value = x[format] ?? defaultFormat;
      if (current === undefined) {
        current = value;
      } else if (current !== value) {
        return null;
      }

      if (opts?.shallow === false) {
        const value = determineElement(
          x.children,
          format,
          current ?? defaultFormat,
        );
        if (current === undefined) {
          current = value;
        } else if (current !== value) {
          return null;
        }
      }
    }
  }

  if (current === undefined) {
    current = defaultFormat;
  }

  return current;
}

export function determinSelectedElement<T>(
  editor: Editor,
  format: string,
  defaultFormat: T,
  opts?: { shallow?: boolean },
): T | null {
  let current: T | null = defaultFormat;
  const selection = editor.selection;
  if (selection !== null) {
    const fragment = Editor.fragment(editor, selection);
    current = determineElement(fragment, format, defaultFormat, opts);
  }
  return current;
}
