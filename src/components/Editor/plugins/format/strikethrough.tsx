import { StrikethroughOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import { RenderLeafProps } from 'slate-react';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class StrikethroughPlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'strikethrough';
  override title: string = '删除线';

  override renderBtnChildren() {
    return <StrikethroughOutlined />;
  }

  override applyStyle(props: RenderLeafProps, style: CSSProperties) {
    style.textDecoration = style.textDecoration || '';
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.textDecoration += ' line-through';
    }
  }
}
