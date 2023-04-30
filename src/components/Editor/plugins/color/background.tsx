import { CSSProperties } from 'react';
import { RenderLeafProps } from 'slate-react';
import { LeafEditorPlugin } from '../base';
import { ToolbarItem } from '../types';

import * as antColors from '@ant-design/colors';
import { HighlightOutlined } from '@ant-design/icons';
import { ColorPickerButton } from './common';

const BACKGROUND_COLORS = [
  antColors.red[3],
  antColors.volcano[3],
  antColors.orange[3],
  antColors.gold[3],
  antColors.yellow[3],
  antColors.lime[3],
  antColors.green[3],
  antColors.cyan[3],
  antColors.blue[3],
  antColors.geekblue[3],
  antColors.purple[3],
  antColors.magenta[3],
  antColors.gray[3],
] as string[];

export class BackgroundPlugin extends LeafEditorPlugin {
  key: string = 'backgroundColor';
  toolbarItem: ToolbarItem = {
    title: '背景颜色',
    renderWriteable: () => (
      <ColorPickerButton
        format="backgroundColor"
        title="背景颜色"
        renderIcon={(color) => {
          if (color !== '#FFFFFFFF') {
            return <HighlightOutlined style={{ color }} />;
          } else {
            return <HighlightOutlined />;
          }
        }}
        colors={BACKGROUND_COLORS}
        defaultColor={'#FFFFFFFF'}
      />
    ),
  };

  applyStyle(props: RenderLeafProps, style: CSSProperties): void {
    if (props.leaf.backgroundColor) {
      style.backgroundColor = props.leaf.backgroundColor;
    }
  }
}
