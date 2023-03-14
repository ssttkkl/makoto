import { Descendant } from 'slate';

// 判断该区域中某属性是否都是同一个值
export function determineLeaf<T>(
  fragment: Descendant[],
  format: string,
  defaultFormat: T,
): T | null {
  let current: T | null | undefined = undefined;
  for (const x of fragment) {
    if (x.children) {
      for (const y of x.children) {
        const value = y[format] ?? defaultFormat;
        if (current === undefined) {
          current = value;
        } else if (current !== value) {
          current = null;
        }
      }
    }
  }

  if (current === undefined) {
    current = defaultFormat;
  }

  return current;
}

// 判断该区域中某属性是否都是同一个值
export function determineElement<T>(
  fragment: Descendant[],
  format: string,
  defaultFormat: T,
): T | null {
  let current: T | null | undefined = undefined;
  for (const x of fragment) {
    const value = x[format] ?? defaultFormat;
    if (current === undefined) {
      current = value;
    } else if (current !== value) {
      current = null;
    }
  }

  if (current === undefined) {
    current = defaultFormat;
  }

  return current;
}
