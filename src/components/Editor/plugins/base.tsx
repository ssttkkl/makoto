import { CSSProperties } from 'react';
import { RenderLeafProps, RenderElementProps, ReactEditor } from 'slate-react';
import { ToolbarItem } from './types';

export abstract class EditorPlugin {
  abstract key: string;
  toolbarItem?: ToolbarItem;

  withEditor(editor: ReactEditor): ReactEditor {
    return editor;
  }
}

export abstract class LeafEditorPlugin extends EditorPlugin {
  /**
   * 该插件渲染叶子节点时的处理逻辑
   *
   * @param props 透传Slate的渲染参数
   * @param style 样式表，用于增加或修改样式
   *
   * @returns 若返回ReactElement，则中止处理并使用该元素用于渲染；否则继续处理
   */
  abstract processLeaf(
    props: RenderLeafProps,
    style: CSSProperties,
  ): React.ReactNode | void;
}

export abstract class ElementEditorPlugin extends EditorPlugin {
  /**
   * 该插件渲染元素节点时的处理逻辑
   *
   * @param props 透传Slate的渲染参数
   * @param style 样式表，用于增加或修改样式
   *
   * @returns 若返回ReactElement，则中止处理并使用该元素用于渲染；否则继续处理
   */
  abstract processElement(
    props: RenderElementProps,
    style: CSSProperties,
  ): React.ReactNode | void;
}
