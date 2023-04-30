import { Select } from 'antd';
import { CSSProperties } from 'react';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, useSlate } from 'slate-react';
import { determineElement } from '../utils';
import { ElementEditorPlugin } from './base';
import { ToolbarItem } from './types';

const HEADING_OPTIONS = [
  {
    value: 'h1',
    label: '一级标题',
  },
  {
    value: 'h2',
    label: '二级标题',
  },
  {
    value: 'h3',
    label: '三级标题',
  },
  {
    value: 'h4',
    label: '四级标题',
  },
  {
    value: 'h5',
    label: '五级标题',
  },
  {
    value: 'h6',
    label: '六级标题',
  },
  {
    value: 'p',
    label: '正文',
  },
];

const DEFAULT_HEADING = 'p';

const HeadingSelect = () => {
  const editor = useSlate();

  // 判断选中区域是否都是同一字号，并赋值给current
  let current: string | null = DEFAULT_HEADING;
  const selection = editor.selection;
  if (selection !== null) {
    const fragment = Editor.fragment(editor, selection);
    current = determineElement(fragment, 'heading', DEFAULT_HEADING);
  }

  return (
    <Select
      style={{ width: 120 }}
      bordered={false}
      value={current}
      options={HEADING_OPTIONS}
      onChange={(v) => {
        if (v === 'p') {
          Transforms.unsetNodes(editor, 'heading');
        } else {
          Transforms.setNodes(editor, { heading: v });
        }
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

  processElement(
    props: RenderElementProps,
    style: CSSProperties,
  ): React.ReactNode {
    if (props.element.type !== 'paragraph') {
      return null;
    }

    switch (props.element.heading) {
      case 'h1':
        return (
          <h1 key={props.element.key} {...props.attributes}>
            {props.children}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={props.element.key} {...props.attributes}>
            {props.children}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={props.element.key} {...props.attributes}>
            {props.children}
          </h3>
        );
      case 'h4':
        return (
          <h4 key={props.element.key} {...props.attributes}>
            {props.children}
          </h4>
        );
      case 'h5':
        return (
          <h5 key={props.element.key} {...props.attributes}>
            {props.children}
          </h5>
        );
      case 'h6':
        return (
          <h6 key={props.element.key} {...props.attributes}>
            {props.children}
          </h6>
        );
      default:
        return (
          <p key={props.element.key} {...props.attributes}>
            {props.children}
          </p>
        );
    }
  }
}
