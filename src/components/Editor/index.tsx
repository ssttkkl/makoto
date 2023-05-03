import React, {
  createContext,
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createEditor, Descendant } from 'slate';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
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
  AlignCenterPlugin,
  AlignEndPlugin,
  AlignJustifyPlugin,
  AlignPlugin,
  AlignStartPlugin,
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
import { HeadingPlugin } from './plugins/heading';
import { withCursors, withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useModel } from '@umijs/max';
import randomColor from 'randomcolor';
import { CursorData } from './types';
import * as Y from 'yjs';
import ImagePlugin from './plugins/image';

function makeCursorData(uid: number, writeable: boolean): CursorData {
  return {
    color: randomColor({
      luminosity: 'dark',
      alpha: 1,
      format: 'hex',
    }),
    uid,
    writeable,
  };
}

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
    key: 'insert',
    plugins: [new ImagePlugin()],
  },
];

const Element: React.FC<RenderElementProps> = (props) => {
  const style: CSSProperties = {};

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
    if (plugin instanceof ElementEditorPlugin) {
      plugin.applyStyle(props, style);
    }
  }

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
    if (plugin instanceof ElementEditorPlugin) {
      const node = plugin.render(props, style);
      if (node) {
        return node;
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

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
    if (plugin instanceof LeafEditorPlugin) {
      plugin.applyStyle(props, style);
    }
  }

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
    if (plugin instanceof LeafEditorPlugin) {
      const node = plugin.render(props, style);
      if (node) {
        return node;
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

export interface EditorProps {
  provider: HocuspocusProvider;
  writeable: boolean;
  extraPlugins?: EditorPluginGroup[];
}

export const EditorContext = createContext<{
  provider: HocuspocusProvider;
  writeable: boolean;
}>({});

const Editor: React.FC<EditorProps> = ({
  provider,
  writeable,
  extraPlugins,
}) => {
  const { currentUser } = useModel('currentUser');

  const [value, onChange] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const plugins = useMemo(() => {
    return (extraPlugins?.length ?? 0) > 0
      ? [...PLUGINS, ...extraPlugins!]
      : PLUGINS;
  }, [extraPlugins]);

  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText) as Y.XmlText;

    let e = withReact(
      withYHistory(
        withCursors(
          withYjs(createEditor(), sharedType, { autoConnect: false }),
          provider.awareness,
          {
            data: currentUser?.uid
              ? makeCursorData(currentUser.uid, writeable)
              : undefined,
          },
        ),
      ),
    );

    plugins
      .flatMap((x) => x.plugins)
      .forEach((plugin) => {
        e = plugin.withEditor(e);
      });

    return e;
  }, [
    plugins,
    currentUser?.uid,
    writeable,
    provider.awareness,
    provider.document,
  ]);

  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor);
  }, [editor]);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const toolbarClassname = useEmotionCss(({ token }) => ({
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: token.colorBgElevated,
  }));

  return (
    <EditorContext.Provider value={{ provider, writeable }}>
      <Slate
        editor={editor}
        value={value}
        onChange={(v) => {
          console.log('doc: ', v);
          onChange(v);
        }}
      >
        <RemoteCursorOverlay className="position-relative">
          <Toolbar
            plugins={plugins}
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
    </EditorContext.Provider>
  );
};

export default Editor;
