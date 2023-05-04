import { Select } from 'antd';
import { CSSProperties } from 'react';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, useSlate } from 'slate-react';
import { determinSelectedElement } from '../utils';
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

const HEADING_VALUES = HEADING_OPTIONS.map((x) => x.value);

const HeadingSelect = () => {
  const editor = useSlate();

  const current = determinSelectedElement(editor, 'type', null, {
    shallow: true,
  });

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
          <h1 key={props.element.key} style={style} {...props.attributes}>
            {props.children}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 key={props.element.key} style={style} {...props.attributes}>
            {props.children}
          </h2>
        );
      case 'heading-three':
        return (
          <h3 key={props.element.key} style={style} {...props.attributes}>
            {props.children}
          </h3>
        );
      case 'heading-four':
        return (
          <h4 key={props.element.key} style={style} {...props.attributes}>
            {props.children}
          </h4>
        );
      case 'heading-five':
        return (
          <h5 key={props.element.key} style={style} {...props.attributes}>
            {props.children}
          </h5>
        );
      case 'heading-six':
        return (
          <h6 key={props.element.key} style={style} {...props.attributes}>
            {props.children}
          </h6>
        );
      case 'paragraph':
        return (
          <p key={props.element.key} style={style} {...props.attributes}>
            {props.children}
          </p>
        );
      default:
        return null;
    }
  }
}
