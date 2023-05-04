import { BoldOutlined } from '@ant-design/icons';
import isHotkey from 'is-hotkey';
import { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class BoldPlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'bold';
  override title: string = '加粗';

  override renderBtnChildren() {
    return <BoldOutlined />;
  }

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor,
    writeable: boolean,
  ): boolean {
    if (isHotkey('ctrl+b')(event) && writeable) {
      this.toggleMark(editor);
      return true;
    }
    return false;
  }

  override applyStyle(props: RenderLeafProps, style: CSSProperties): void {
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.fontWeight = 'bold';
    }
  }
}
