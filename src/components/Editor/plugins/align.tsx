import { CSSProperties, ReactNode } from 'react';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, useSlate } from 'slate-react';
import { EditorIcon } from '../components/EditorIcon';
import ToolbarButton from '../components/ToolbarButton';
import { determineElement } from '../utils';
import { ElementEditorPlugin } from './base';
import { ToolbarItem } from './types';

type Align = 'start' | 'center' | 'end' | 'justify';

const DEFAULT_ALIGN = 'start';

const AlignStartButton: React.FC<{
  align: Align;
  icon: ReactNode;
}> = ({ align, icon }) => {
  const editor = useSlate();

  // 判断选中区域是否都是同一对齐，并赋值给current
  let current: Align | null = DEFAULT_ALIGN;
  const selection = editor.selection;
  if (selection !== null) {
    const fragment = Editor.fragment(editor, selection);
    current = determineElement(fragment, 'align', DEFAULT_ALIGN);
  }

  return (
    <ToolbarButton
      isActive={align === current}
      onClick={() => {
        Transforms.setNodes(editor, { align });
      }}
    >
      {icon}
    </ToolbarButton>
  );
};

class AlignPlugin extends ElementEditorPlugin {
  key: string;
  toolbarItem: ToolbarItem;

  constructor(key: string, title: string, align: Align, icon: ReactNode) {
    super();
    this.key = key;
    this.toolbarItem = {
      title,
      render: () => <AlignStartButton icon={icon} align={align} />,
    };
  }

  processElement(props: RenderElementProps, style: CSSProperties): void {
    if (props.element.align) {
      style['textAlign'] = props.element.align;
    }
  }
}

export const AlignStartPlugin = new AlignPlugin(
  'alignStart',
  '左对齐',
  'start',
  <EditorIcon type="icon-align-left" />,
);
export const AlignCenterPlugin = new AlignPlugin(
  'alignCenter',
  '居中对齐',
  'center',
  <EditorIcon type="icon-align-center" />,
);
export const AlignEndPlugin = new AlignPlugin(
  'alignEnd',
  '右对齐',
  'end',
  <EditorIcon type="icon-align-right" />,
);
export const AlignJustifyPlugin = new AlignPlugin(
  'alignJustify',
  '两端对齐',
  'justify',
  <EditorIcon type="icon-align-justify" />,
);
