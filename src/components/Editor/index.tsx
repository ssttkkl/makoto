import React, { useCallback, CSSProperties } from 'react';
import { Descendant } from 'slate';
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from 'slate-react';
import Toolbar from './components/Toolbar';
import { EditorPluginGroup } from './plugins/types';
import BoldPlugin from './plugins/format/bold';
import './index.css';
import ItalicPlugin from './plugins/format/italic';
import { ElementEditorPlugin, LeafEditorPlugin } from './plugins/base';
import UnderlinePlugin from './plugins/format/underline';
import StrikethroughPlugin from './plugins/format/strikethrough';
import SuperscriptPlugin from './plugins/format/superscript';
import SubscriptPlugin from './plugins/format/subscript';
import ClearFormatPlugin from './plugins/format/clear-format';

const plugins: EditorPluginGroup[] = [
  {
    key: 'font',
    plugins: [
      new BoldPlugin(),
      new ItalicPlugin(),
      new UnderlinePlugin(),
      new StrikethroughPlugin(),
      new SuperscriptPlugin(),
      new SubscriptPlugin(),
      new ClearFormatPlugin(),
    ],
  },
];

export interface EditorProps {
  editor: ReactEditor;
  value: Descendant[];
  onChange?: (value: Descendant[]) => void;
}

const Element: React.FC<RenderElementProps> = (props) => {
  const style: CSSProperties = {};

  for (const plugin of plugins.flatMap((group) => group.plugins)) {
    if (plugin instanceof ElementEditorPlugin) {
      const element = plugin.processElement(props, style);
      if (element !== undefined) {
        return element;
      }
    }
  }

  return (
    // @ts-ignore
    <div key={props.element.key} {...props.attributes} style={style}>
      {props.children}
    </div>
  );
};

const Leaf: React.FC<RenderLeafProps> = (props) => {
  const style: CSSProperties = {};

  for (const plugin of plugins.flatMap((group) => group.plugins)) {
    if (plugin instanceof LeafEditorPlugin) {
      const element = plugin.processLeaf(props, style);
      if (element !== undefined) {
        return element;
      }
    }
  }

  return (
    // @ts-ignore
    <span key={props.leaf.key} {...props.attributes} style={style}>
      {props.children}
    </span>
  );
};

const Editor: React.FC<EditorProps> = ({
  editor,
  value,
  onChange: _onChange,
}) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const onChange = (v: Descendant[]) => {
    console.log(v);
    if (_onChange) {
      _onChange(v);
    }
  };

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Toolbar plugins={plugins} className="editor-toolbar" />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        autoFocus
      />
    </Slate>
  );
};

export default Editor;
