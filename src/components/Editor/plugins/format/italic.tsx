import { ItalicOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import { RenderLeafProps } from 'slate-react';
import { ToggleToolbarEditorPlugin } from './toggle';

export default class ItalicPlugin extends ToggleToolbarEditorPlugin {
  override key: string = 'italic';
  override title: string = '斜体';

  override renderBtnChildren() {
    return <ItalicOutlined />;
  }

  override processLeaf(props: RenderLeafProps, style: CSSProperties) {
    // @ts-ignore
    if (props.leaf[this.key]) {
      style.fontStyle = 'italic';
    }
  }
}
