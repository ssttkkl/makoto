import isHotkey from 'is-hotkey';
import { Editor, Transforms } from 'slate';
import { EditorPlugin } from './base';

export class SelectAllPlugin extends EditorPlugin {
  key = 'select-all';

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor,
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
