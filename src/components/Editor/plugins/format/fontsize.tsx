import { Select } from 'antd';
import { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps, useSlate } from 'slate-react';
import { LeafEditorPlugin } from '../base';
import { ToolbarItem } from '../types';

const FONT_SIZES = [
  12, 14, 16, 18, 20, 24, 28, 30, 32, 36, 40, 48, 56, 64, 72, 96, 120, 144,
];
const FONT_SIZE_OPTIONS = FONT_SIZES.map((x) => ({
  value: x,
  label: x.toString(),
}));
const DEFAULT_FONT_SIZE = 14;

const FontSizeSelect = () => {
  let current: number | null | undefined = undefined;
  const editor = useSlate();

  // 判断选中区域是否都是同一字号，并赋值给current
  const selection = editor.selection;
  if (selection !== null) {
    const frag = Editor.fragment(editor, selection);
    for (const x of frag) {
      if (x.children) {
        for (const y of x.children) {
          const fontSize = y.fontSize ?? DEFAULT_FONT_SIZE;
          if (current === undefined) {
            current = fontSize;
          } else if (current !== fontSize) {
            current = null;
          }
        }
      }
    }
  }

  return (
    <Select
      style={{ width: 80 }}
      bordered={false}
      value={current}
      options={FONT_SIZE_OPTIONS}
      onChange={(v) => {
        Editor.addMark(editor, 'fontSize', v);
      }}
    />
  );
};

export class FontSizePlugin extends LeafEditorPlugin {
  key: string = 'fontSize';
  toolbarItem: ToolbarItem = {
    title: '字号',
    render: () => <FontSizeSelect />,
  };

  processLeaf(props: RenderLeafProps, style: CSSProperties): void {
    if (props.leaf.fontSize) {
      style.fontSize = props.leaf.fontSize;
    }
  }
}
