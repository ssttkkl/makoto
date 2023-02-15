import { UnderlineOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import { RenderLeafProps } from 'slate-react';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class UnderlinePlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'underline';
  override title: string = '下划线';

  override renderBtnChildren() {
    return <UnderlineOutlined />;
  }

  override processLeaf(props: RenderLeafProps, style: CSSProperties) {
    style.textDecoration = style.textDecoration || '';
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.textDecoration += ' underline';
    }
  }
}
