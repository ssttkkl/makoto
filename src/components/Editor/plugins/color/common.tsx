import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { determineLeaf } from '../../utils';
import { Button, Popover, Space } from 'antd';
import ToolbarButton from '../../components/ToolbarButton';
import { CirclePicker } from 'react-color';

export const ColorPickerButton: React.FC<{
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
