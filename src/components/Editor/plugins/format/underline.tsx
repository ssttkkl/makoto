import { UnderlineOutlined } from '@ant-design/icons';
import isHotkey from 'is-hotkey';
import { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class UnderlinePlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'underline';
  override title: string = '下划线';

  override renderBtnChildren() {
    return <UnderlineOutlined />;
  }

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor,
    writeable: boolean,
  ): boolean {
    if (isHotkey('ctrl+u')(event) && writeable) {
      this.toggleMark(editor);
      return true;
    }
    return false;
  }

  override applyStyle(props: RenderLeafProps, style: CSSProperties) {
    style.textDecoration = style.textDecoration || '';
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.textDecoration += ' underline';
    }
  }
}
