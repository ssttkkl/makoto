import { BoldOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import { RenderLeafProps } from 'slate-react';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class BoldPlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'bold';
  override title: string = '加粗';

  override renderBtnChildren() {
    return <BoldOutlined />;
  }

  override applyStyle(props: RenderLeafProps, style: CSSProperties): void {
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.fontWeight = 'bold';
    }
  }
}
