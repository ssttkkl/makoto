import { Select } from 'antd';
import isHotkey from 'is-hotkey';
import { CSSProperties, KeyboardEvent } from 'react';
import {
  Transforms,
  Range,
  Selection as SlateSeletion,
  Editor,
  Point,
} from 'slate';
import { ReactEditor, RenderElementProps, useSlate } from 'slate-react';
import { determineSelectedElement } from '../utils';
import { ElementEditorPlugin } from './base';
import { ToolbarItem } from './types';

const HEADING_OPTIONS = [
  {
    value: 'heading-one',
    label: '一级标题',
  },
  {
    value: 'heading-two',
    label: '二级标题',
  },
  {
    value: 'heading-three',
    label: '三级标题',
  },
  {
    value: 'heading-four',
    label: '四级标题',
  },
  {
    value: 'heading-five',
    label: '五级标题',
  },
  {
    value: 'heading-six',
    label: '六级标题',
  },
  {
    value: 'paragraph',
    label: '正文',
  },
];

export const HEADING_VALUES = HEADING_OPTIONS.map((x) => x.value);

const HeadingSelect = () => {
  const editor = useSlate();

  let current = determineSelectedElement(editor, 'type', {
    shallow: true,
  });

  if (HEADING_VALUES.findIndex((x) => x === current) === -1) {
    current = null;
  }

  return (
    <Select
      style={{ width: 120 }}
      bordered={false}
      value={current}
      options={HEADING_OPTIONS}
      onChange={(v) => {
        Transforms.setNodes(
          editor,
          { type: v },
          {
            match: (node) =>
              HEADING_VALUES.findIndex((x) => x === node.type) >= 0,
          },
        );
      }}
    />
  );
};

export class HeadingPlugin extends ElementEditorPlugin {
  key: string = 'heading';
  toolbarItem: ToolbarItem = {
    title: '大纲级别',
    renderWriteable: () => <HeadingSelect />,
  };

  render(props: RenderElementProps, style: CSSProperties): React.ReactNode {
    switch (props.element.type) {
      case 'heading-one':
        return (
          <h1 style={style} {...props.attributes}>
            {props.children}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 style={style} {...props.attributes}>
            {props.children}
          </h2>
        );
      case 'heading-three':
        return (
          <h3 style={style} {...props.attributes}>
            {props.children}
          </h3>
        );
      case 'heading-four':
        return (
          <h4 style={style} {...props.attributes}>
            {props.children}
          </h4>
        );
      case 'heading-five':
        return (
          <h5 style={style} {...props.attributes}>
            {props.children}
          </h5>
        );
      case 'heading-six':
        return (
          <h6 style={style} {...props.attributes}>
            {props.children}
          </h6>
        );
      case 'paragraph':
        return (
          <p style={style} {...props.attributes}>
            {props.children}
          </p>
        );
      default:
        return null;
    }
  }

  override onKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    editor: ReactEditor,
    writeable: boolean,
  ): boolean {
    // 当处于标题的行尾按下回车时，插入一行正文
    if (isHotkey('enter', event) && writeable) {
      if (editor.selection && !Range.isExpanded(editor.selection)) {
        const current = determineSelectedElement(editor, 'type', {
          shallow: true,
        });
        if (
          current !== 'paragraph' &&
          HEADING_VALUES.findIndex((x) => x === current) !== -1
        ) {
          const point = Editor.end(
            editor,
            editor.selection.anchor.path.slice(0, -1),
          );
          const atLastChar = Point.compare(point, editor.selection.focus);
          if (atLastChar === 0) {
            const node = editor.getFragment()[0];
            Transforms.insertNodes(editor, {
              ...node,
              type: 'paragraph',
              children: [{ text: '' }],
            });
            return true;
          }
        }
      }
    }
    return false;
  }
}
