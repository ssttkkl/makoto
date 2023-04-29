import { ButtonProps } from 'antd';
import React from 'react';
import { BaseEditor, Editor } from 'slate';
import { useSlate } from 'slate-react';
import ToolbarButton from '../../components/ToolbarButton';
import { LeafEditorPlugin } from '../base';
import { ToolbarItem } from '../types';

function isMarkActive(editor: BaseEditor, format: string) {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
}

function toggleMark(
  editor: BaseEditor,
  format: string,
  incompatibleFormat: string[] = [],
) {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
    incompatibleFormat.forEach((x) => {
      Editor.removeMark(editor, x);
    });
  }
}

const ToggleButton: React.FC<
  {
    format: string;
    incompatibleFormat?: string[];
  } & ButtonProps
> = ({ format, incompatibleFormat, ...props }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  return (
    <ToolbarButton
      isActive={isActive}
      onClick={() => {
        toggleMark(editor, format, incompatibleFormat ?? []);
      }}
      {...props}
    />
  );
};

export abstract class ToggleToolbarEditorPlugin extends LeafEditorPlugin {
  title: string = '';
  btnProps: Omit<ButtonProps, 'children'> | undefined = undefined;
  incompatibleFormat: string[] = [];
  override toolbarItem: ToolbarItem;

  constructor() {
    super();
    this.toolbarItem = {
      title: this.title,
      renderWriteable: () => {
        return (
          <ToggleButton
            key={this.key}
            format={this.key}
            incompatibleFormat={this.incompatibleFormat}
            {...this.btnProps}
          >
            {this.renderBtnChildren()}
          </ToggleButton>
        );
      },
    };
  }

  renderBtnChildren(): React.ReactElement | undefined {
    return undefined;
  }
}
