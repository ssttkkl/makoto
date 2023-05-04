import isHotkey from 'is-hotkey';
import { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { EditorIcon } from '../../components/EditorIcon';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class SuperscriptPlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'superscript';
  override title: string = '上标';
  override incompatibleFormat: string[] = ['subscript'];

  override renderBtnChildren() {
    return <EditorIcon type="icon-superscript-" />;
  }

  override onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: Editor,
    writeable: boolean,
  ): boolean {
    if (isHotkey('ctrl+shift+=')(event) && writeable) {
      this.toggleMark(editor);
      return true;
    }
    return false;
  }

  override applyStyle(props: RenderLeafProps, style: CSSProperties) {
    style.textDecoration = style.textDecoration || '';
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.top = '-0.5em';
      style.position = 'relative';
      style.fontSize = '75%';
      style.lineHeight = 0;
      style.verticalAlign = 'baseline';
    }
  }
}
