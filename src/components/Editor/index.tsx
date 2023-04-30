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
import ItalicPlugin from './plugins/format/italic';
import { ElementEditorPlugin, LeafEditorPlugin } from './plugins/base';
import UnderlinePlugin from './plugins/format/underline';
import StrikethroughPlugin from './plugins/format/strikethrough';
import SuperscriptPlugin from './plugins/format/superscript';
import SubscriptPlugin from './plugins/format/subscript';
import ClearFormatPlugin from './plugins/format/clear-format';
import { FontSizePlugin } from './plugins/format/fontsize';
import {
  AlignStartPlugin,
  AlignCenterPlugin,
  AlignEndPlugin,
  AlignJustifyPlugin,
  AlignPlugin,
} from './plugins/align';
import { ForegroundPlugin } from './plugins/color/foreground';
import {
  DecreaseIndentPlugin,
  IncreaseIndentPlugin,
  IndentPlugin,
} from './plugins/indent';
import UndoPlugin from './plugins/history/undo';
import RedoPlugin from './plugins/history/redo';
import { BackgroundPlugin } from './plugins/color/background';
import { RemoteCursorOverlay } from './components/Overlay';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { OnlinePlugin } from './plugins/online';
import { UserStatesPlugin } from './plugins/user-states';
import { HeadingPlugin } from './plugins/heading';

const PLUGINS: EditorPluginGroup[] = [
  {
    key: 'clear',
    plugins: [new UndoPlugin(), new RedoPlugin(), new ClearFormatPlugin()],
  },
  {
    key: 'font',
    plugins: [
      new FontSizePlugin(),
      new BoldPlugin(),
      new ItalicPlugin(),
      new UnderlinePlugin(),
      new StrikethroughPlugin(),
      new SuperscriptPlugin(),
      new SubscriptPlugin(),
    ],
  },
  {
    key: 'color',
    plugins: [new ForegroundPlugin(), new BackgroundPlugin()],
  },
  {
    key: 'paragraph',
    plugins: [
      new HeadingPlugin(),
      new IndentPlugin(),
      new IncreaseIndentPlugin(),
      new DecreaseIndentPlugin(),
      new AlignPlugin(),
      AlignStartPlugin,
      AlignCenterPlugin,
      AlignEndPlugin,
      AlignJustifyPlugin,
    ],
  },
  {
    key: 'online',
    plugins: [new OnlinePlugin()],
  },
  {
    key: 'user-states',
    plugins: [new UserStatesPlugin()],
  },
];

export interface EditorProps {
  editor: ReactEditor;
  value: Descendant[];
  onChange?: (value: Descendant[]) => void;
  writeable?: boolean;
}

const Element: React.FC<RenderElementProps> = (props) => {
  const style: CSSProperties = {};

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
    if (plugin instanceof ElementEditorPlugin) {
      const element = plugin.processElement(props, style);
      if (element !== undefined) {
        return element;
      }
    }
  }

  return (
    // @ts-ignore
    <p key={props.element.key} {...props.attributes} style={style}>
      {props.children}
    </p>
  );
};

const Leaf: React.FC<RenderLeafProps> = (props) => {
  const style: CSSProperties = {};

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
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
  editor: originEditor,
  value,
  onChange,
  writeable,
}) => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const overlayClassname = useEmotionCss(() => ({
    position: 'relative',
  }));

  const toolbarClassname = useEmotionCss(() => ({
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: 'white',
  }));

  let editor = originEditor;

  PLUGINS.flatMap((x) => x.plugins).forEach((plugin) => {
    editor = plugin.withEditor(editor);
  });

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <RemoteCursorOverlay className={overlayClassname}>
        <Toolbar
          plugins={PLUGINS}
          writeable={writeable}
          className={toolbarClassname}
        />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          autoFocus
          readOnly={writeable !== true}
        />
      </RemoteCursorOverlay>
    </Slate>
  );
};

export default Editor;
