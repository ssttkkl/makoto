import { UndoOutlined } from '@ant-design/icons';
import { YHistoryEditor } from '@slate-yjs/core';
import { useSlate } from 'slate-react';
import ToolbarButton from '../../components/ToolbarButton';
import { EditorPlugin } from '../base';
import { ToolbarItem } from '../types';

const UndoButton: React.FC = () => {
  const editor = useSlate();

  return (
    <ToolbarButton
      disabled={!YHistoryEditor.canUndo(editor)}
      onClick={() => {
        editor.undo();
      }}
    >
      <UndoOutlined />
    </ToolbarButton>
  );
};

export default class UndoPlugin extends EditorPlugin {
  key: string = 'undo';
  toolbarItem: ToolbarItem = {
    title: '撤销',
    render: () => <UndoButton />,
  };
}
