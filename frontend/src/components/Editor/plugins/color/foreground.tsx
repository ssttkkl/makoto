import { CSSProperties } from 'react';
import { RenderLeafProps } from 'slate-react';
import { LeafEditorPlugin } from '../base';
import { ToolbarItem } from '../types';

import * as antColors from '@ant-design/colors';
import { FontColorsOutlined } from '@ant-design/icons';
import { ColorPickerButton } from './common';

const DEFAULT_FOREGROUND_COLOR = antColors.gray[9];
const FOREGROUND_COLORS = [
  antColors.red.primary,
  antColors.volcano.primary,
  antColors.orange.primary,
  antColors.gold.primary,
  antColors.yellow.primary,
  antColors.lime.primary,
  antColors.green.primary,
  antColors.cyan.primary,
  antColors.blue.primary,
  antColors.geekblue.primary,
  antColors.purple.primary,
  antColors.magenta.primary,
  antColors.gray.primary,
  DEFAULT_FOREGROUND_COLOR,
] as string[];

export class ForegroundPlugin extends LeafEditorPlugin {
  key: string = 'foregroundColor';
  toolbarItem: ToolbarItem = {
    title: '文字颜色',
    renderWriteable: () => (
      <ColorPickerButton
        format="foregroundColor"
        title="文字颜色"
        renderIcon={(color) => <FontColorsOutlined style={{ color }} />}
        colors={FOREGROUND_COLORS}
        defaultColor={DEFAULT_FOREGROUND_COLOR}
      />
    ),
  };

  applyStyle(props: RenderLeafProps, style: CSSProperties): void {
    if (props.leaf.foregroundColor) {
      style.color = props.leaf.foregroundColor;
    } else {
      style.color = DEFAULT_FOREGROUND_COLOR;
    }
  }
}
