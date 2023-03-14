import { BaseEditor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { EditorIcon } from '../../components/EditorIcon';
import ToolbarButton from '../../components/ToolbarButton';
import { EditorPlugin } from '../base';
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
  'backgroundColor',
  'letterSpacing',
];

const FORMAT_NODE_PROPS = ['align'];

function clearMark(editor: BaseEditor) {
  let selection = editor.selection;
  if (selection) {
    FORMAT_MARKS.forEach((x) => editor.removeMark(x));
    Transforms.unsetNodes(editor, FORMAT_NODE_PROPS);
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
    render: () => <ClearFormatButton />,
  };
}
