import isHotkey from 'is-hotkey';
import { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { EditorIcon } from '../../components/EditorIcon';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class SubscriptPlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'subscript';
  override title: string = '下标';
  override incompatibleFormat: string[] = ['superscript'];

  override renderBtnChildren() {
    return <EditorIcon type="icon-subscript-" />;
  }

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor,
    writeable: boolean,
  ): boolean {
    if (isHotkey('ctrl+=')(event) && writeable) {
      this.toggleMark(editor);
      return true;
    }
    return false;
  }

  override applyStyle(props: RenderLeafProps, style: CSSProperties) {
    style.textDecoration = style.textDecoration || '';
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.bottom = '-0.25em';
      style.position = 'relative';
      style.fontSize = '75%';
      style.lineHeight = 0;
      style.verticalAlign = 'baseline';
    }
  }
}
