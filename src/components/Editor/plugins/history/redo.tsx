import { RedoOutlined } from '@ant-design/icons';
import { YHistoryEditor } from '@slate-yjs/core';
import isHotkey from 'is-hotkey';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import ToolbarButton from '../../components/ToolbarButton';
import { EditorPlugin } from '../base';
import { ToolbarItem } from '../types';

const RedoButton: React.FC = () => {
  const editor = useSlate();

  return (
    <ToolbarButton
      disabled={!YHistoryEditor.canRedo(editor)}
      onClick={() => {
        editor.redo();
      }}
    >
      <RedoOutlined />
    </ToolbarButton>
  );
};

export default class RedoPlugin extends EditorPlugin {
  key: string = 'redo';
  toolbarItem: ToolbarItem = {
    title: '重做',
    renderWriteable: () => <RedoButton />,
  };

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor,
    writeable: boolean,
  ): boolean {
    if (
      isHotkey('ctrl+y')(event) &&
      writeable &&
      YHistoryEditor.canUndo(editor)
    ) {
      editor.undo();
      return true;
    }
    return false;
  }
}
