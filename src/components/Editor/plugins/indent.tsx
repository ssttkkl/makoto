import { CSSProperties } from 'react';
import { Transforms } from 'slate';
import { RenderElementProps, useSlate } from 'slate-react';
import { EditorIcon } from '../components/EditorIcon';
import ToolbarButton from '../components/ToolbarButton';
import { EditorPlugin, ElementEditorPlugin } from './base';
import { ToolbarItem } from './types';

export class IndentPlugin extends ElementEditorPlugin {
  key: string = 'indent';

  processElement(props: RenderElementProps, style: CSSProperties): void {
    if (props.element.indent) {
      style['paddingLeft'] = props.element.indent * 2 + 'em';
    }
  }
}

const IndentToolbarButton: React.FC<{
  delta: number;
  children?: React.ReactNode;
}> = ({ delta, children }) => {
  const editor = useSlate();

  return (
    <ToolbarButton
      onClick={() => {
        for (let matchIndent = 0; matchIndent <= 16; matchIndent++) {
          let newIndent = matchIndent + delta;
          if (newIndent > 16) newIndent = 16;
          if (newIndent < 0) newIndent = 0;

          Transforms.setNodes(
            editor,
            { indent: newIndent, flag: true },
            {
              match: (node) => {
                if (node.text !== undefined || node.flag) {
                  return false;
                } else if (node.indent === undefined) {
                  return matchIndent === 0;
                } else {
                  return node.indent === matchIndent;
                }
              },
            },
          );
        }
        Transforms.unsetNodes(editor, 'flag');
      }}
    >
      {children}
    </ToolbarButton>
  );
};

export class DecreaseIndentPlugin extends EditorPlugin {
  key: string = 'decreaseIndent';
  toolbarItem: ToolbarItem = {
    title: '减少缩进',
    renderWriteable: () => (
      <IndentToolbarButton delta={-1}>
        <EditorIcon type="icon-indent-decrease" />
      </IndentToolbarButton>
    ),
  };
}

export class IncreaseIndentPlugin extends EditorPlugin {
  key: string = 'increaseIndent';
  toolbarItem: ToolbarItem = {
    title: '增加缩进',
    renderWriteable: () => (
      <IndentToolbarButton delta={1}>
        <EditorIcon type="icon-indent-increase" />
      </IndentToolbarButton>
    ),
  };
}
