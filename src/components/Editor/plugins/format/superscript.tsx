import { CSSProperties } from 'react';
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

  override processLeaf(props: RenderLeafProps, style: CSSProperties) {
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
