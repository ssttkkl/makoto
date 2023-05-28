import { CSSProperties, ReactNode } from 'react';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, useSlate } from 'slate-react';
import { EditorIcon } from '../components/EditorIcon';
import ToolbarButton from '../components/ToolbarButton';
import { determineSelectedElement } from '../utils';
import { EditorPlugin, ElementEditorPlugin } from './base';
import { ToolbarItem } from './types';

type Align = 'start' | 'center' | 'end' | 'justify';

const DEFAULT_ALIGN = 'start';

const AlignToolbarButton: React.FC<{
  align: Align;
  icon: ReactNode;
}> = ({ align, icon }) => {
  const editor = useSlate();

  const current = determineSelectedElement(editor, 'align') ?? DEFAULT_ALIGN;

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

export class AlignPlugin extends ElementEditorPlugin {
  key: string = 'align';

  applyStyle(props: RenderElementProps, style: CSSProperties): void {
    if (props.element.align) {
      style['textAlign'] = props.element.align;
    }
  }
}

class SetAlignPlugin extends EditorPlugin {
  key: string;
  toolbarItem: ToolbarItem;

  constructor(key: string, title: string, align: Align, icon: ReactNode) {
    super();
    this.key = key;
    this.toolbarItem = {
      title,
      renderWriteable: () => <AlignToolbarButton icon={icon} align={align} />,
    };
  }
}

export const AlignStartPlugin = new SetAlignPlugin(
  'alignStart',
  '左对齐',
  'start',
  <EditorIcon type="icon-align-left" />,
);
export const AlignCenterPlugin = new SetAlignPlugin(
  'alignCenter',
  '居中对齐',
  'center',
  <EditorIcon type="icon-align-center" />,
);
export const AlignEndPlugin = new SetAlignPlugin(
  'alignEnd',
  '右对齐',
  'end',
  <EditorIcon type="icon-align-right" />,
);
export const AlignJustifyPlugin = new SetAlignPlugin(
  'alignJustify',
  '两端对齐',
  'justify',
  <EditorIcon type="icon-align-justify" />,
);
