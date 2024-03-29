import { CSSProperties } from 'react';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
import { ToolbarItem } from './types';

export abstract class EditorPlugin {
  abstract key: string;
  toolbarItem?: ToolbarItem;

  onKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    editor: ReactEditor,
    writeable: boolean,
  ): boolean {
    return false;
  }

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
   */
  applyStyle(props: RenderLeafProps, style: CSSProperties): void {}

  /**
   * 该插件渲染叶子节点时的处理逻辑
   *
   * @param props 透传Slate的渲染参数
   * @param style 样式表
   *
   * @returns 若返回ReactNode，中止处理并使用该元素用于渲染；否则继续处理
   */
  render(props: RenderLeafProps, style: CSSProperties): React.ReactNode | null {
    return null;
  }
}

export abstract class ElementEditorPlugin extends EditorPlugin {
  /**
   * 该插件渲染元素节点时的处理逻辑
   *
   * @param props 透传Slate的渲染参数
   * @param style 样式表，用于增加或修改样式
   */
  applyStyle(props: RenderLeafProps, style: CSSProperties): void {}

  /**
   * 该插件渲染元素节点时的处理逻辑
   *
   * @param props 透传Slate的渲染参数
   * @param style 样式表
   *
   * @returns 若返回ReactNode，中止处理并使用该元素用于渲染；否则继续处理
   */
  render(
    props: RenderElementProps,
    style: CSSProperties,
  ): React.ReactNode | null {
    return null;
  }
}
