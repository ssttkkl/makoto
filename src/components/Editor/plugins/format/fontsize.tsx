import { Select } from 'antd';
import { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps, useSlate } from 'slate-react';
import { LeafEditorPlugin } from '../base';
import { ToolbarItem } from '../types';
import { determinSelectedLeaf } from '../../utils';

const FONT_SIZES = [
  12, 14, 16, 18, 20, 24, 28, 30, 32, 36, 40, 48, 56, 64, 72, 96, 120, 144,
];
const FONT_SIZE_OPTIONS = FONT_SIZES.map((x) => ({
  value: x,
  label: x.toString(),
}));
const DEFAULT_FONT_SIZE = 14;

const FontSizeSelect = () => {
  const editor = useSlate();

  const current = determinSelectedLeaf(editor, 'fontSize', DEFAULT_FONT_SIZE);

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
    renderWriteable: () => <FontSizeSelect />,
  };

  applyStyle(props: RenderLeafProps, style: CSSProperties): void {
    if (props.leaf.fontSize) {
      style.fontSize = props.leaf.fontSize;
    }
  }
}
