import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { EditorPlugin } from './base';

export class SelectAllPlugin extends EditorPlugin {
  key = 'select-all';

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: ReactEditor,
  ): boolean {
    if (isHotkey('ctrl+a')(event)) {
      Transforms.setSelection(editor, {
        anchor: { path: [], offset: 0 },
        focus: { path: [], offset: 0 },
      });
      return true;
    }
    return false;
  }
}
