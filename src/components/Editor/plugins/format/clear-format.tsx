import { BaseEditor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { EditorIcon } from '../../components/EditorIcon';
import ToolbarButton from '../../components/ToolbarButton';
import { EditorPlugin } from '../base';
import { HEADING_VALUES } from '../heading';
import { unwrapList } from '../list/slate-lists/transformations';
import { ToolbarItem } from '../types';

const FORMAT_MARKS = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'superscript',
  'subscript',
  'fontSize',
  'lineHeight',
  'color',
  'foregroundColor',
  'backgroundColor',
  'letterSpacing',
];

const FORMAT_NODE_PROPS = ['indent', 'align'];

function clearMark(editor: BaseEditor) {
  let selection = editor.selection;
  if (selection) {
    // 叶子节点适用的格式
    FORMAT_MARKS.forEach((x) => editor.removeMark(x));

    // 元素节点适用的格式
    Transforms.unsetNodes(editor, FORMAT_NODE_PROPS);

    // heading
    Transforms.setNodes(
      editor,
      { type: 'paragraph' },
      {
        match: (node) =>
          HEADING_VALUES.findIndex((x) => x === node.type) !== -1,
      },
    );

    // 列表
    unwrapList(editor);

    editor.onChange();
  }
}

const ClearFormatButton: React.FC = () => {
  const editor = useSlate();

  return (
    <ToolbarButton
      onClick={() => {
        clearMark(editor);
      }}
    >
      <EditorIcon type="icon-format-clear" />
    </ToolbarButton>
  );
};

export default class ClearFormatPlugin extends EditorPlugin {
  key: string = 'clear-format';
  toolbarItem: ToolbarItem = {
    title: '清除样式',
    renderWriteable: () => <ClearFormatButton />,
  };
}
