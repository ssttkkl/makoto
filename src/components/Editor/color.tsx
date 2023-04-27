import React, { CSSProperties } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps, useSlate } from 'slate-react';
import { LeafEditorPlugin } from './plugins/base';
import { ToolbarItem } from './plugins/types';
import { determineLeaf } from './utils';
import { Button, Popover, Space } from 'antd';
import ToolbarButton from './components/ToolbarButton';
import { CirclePicker } from 'react-color';

import * as antColors from '@ant-design/colors';
import { FontColorsOutlined, HighlightOutlined } from '@ant-design/icons';

const ColorPickerButton: React.FC<{
  format: string;
  title: string;
  renderIcon: (color: string) => React.ReactNode;
  colors: string[];
  defaultColor: string;
}> = ({ format, title, renderIcon, colors, defaultColor }) => {
  const editor = useSlate();

  let current: string = defaultColor;
  const selection = editor.selection;
  if (selection !== null) {
    const fragment = Editor.fragment(editor, selection);
    current = determineLeaf(fragment, format, defaultColor) ?? defaultColor;
  }

  const picker = (
    <CirclePicker
      circleSize={20}
      color={current}
      colors={colors}
      onChange={(color) => {
        if (color) {
          Editor.addMark(editor, format, color.hex);
        }
      }}
    />
  );

  return (
    <Popover
      content={picker}
      title={
        <Space direction="horizontal">
          <span>{title}</span>
          <Button
            type="text"
            size="small"
            onClick={() => {
              editor.removeMark(format);
            }}
          >
            清除
          </Button>
        </Space>
      }
      trigger="click"
    >
      <ToolbarButton>{renderIcon(current)}</ToolbarButton>
    </Popover>
  );
};

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
    render: () => (
      <ColorPickerButton
        format="foregroundColor"
        title="文字颜色"
        renderIcon={(color) => <FontColorsOutlined style={{ color }} />}
        colors={FOREGROUND_COLORS}
        defaultColor={DEFAULT_FOREGROUND_COLOR}
      />
    ),
  };

  processLeaf(props: RenderLeafProps, style: CSSProperties): void {
    if (props.leaf.foregroundColor) {
      style.color = props.leaf.foregroundColor;
    } else {
      style.color = DEFAULT_FOREGROUND_COLOR;
    }
  }
}

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
    render: () => (
      <ColorPickerButton
        format="backgroundColor"
        title="背景颜色"
        renderIcon={() => <HighlightOutlined />}
        colors={BACKGROUND_COLORS}
        defaultColor={'#FFFFFFFF'}
      />
    ),
  };

  processLeaf(props: RenderLeafProps, style: CSSProperties): void {
    if (props.leaf.backgroundColor) {
      style.backgroundColor = props.leaf.backgroundColor;
    }
  }
}
