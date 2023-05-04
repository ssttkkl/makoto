import { ItalicOutlined } from '@ant-design/icons';
import isHotkey from 'is-hotkey';
import { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class ItalicPlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'italic';
  override title: string = '斜体';

  override renderBtnChildren() {
    return <ItalicOutlined />;
  }

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor,
    writeable: boolean,
  ): boolean {
    if (isHotkey('ctrl+i')(event) && writeable) {
      this.toggleMark(editor);
      return true;
    }
    return false;
  }

  override applyStyle(props: RenderLeafProps, style: CSSProperties) {
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.fontStyle = 'italic';
    }
  }
}
