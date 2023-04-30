import React, {
  useCallback,
  CSSProperties,
  useState,
  useMemo,
  useEffect,
  createContext,
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
import { withCursors, withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useModel } from '@umijs/max';
import randomColor from 'randomcolor';
import { CursorData } from './types';
import * as Y from 'yjs';
import { SaveDocxPlugin } from './plugins/save/docx';

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
    key: 'file',
    plugins: [new SaveDocxPlugin()],
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

const Element: React.FC<RenderElementProps> = (props) => {
  const style: CSSProperties = {};
  let children = props.children;

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
    if (plugin instanceof ElementEditorPlugin) {
      const element = plugin.processElement(props, style);
      if (element !== undefined) {
        children = element;
      }
    }
  }

  return (
    // @ts-ignore
    <div key={props.element.key} {...props.attributes} style={style}>
      {children}
    </div>
  );
};

const Leaf: React.FC<RenderLeafProps> = (props) => {
  const style: CSSProperties = {};
  let children = props.children;

  for (const plugin of PLUGINS.flatMap((group) => group.plugins)) {
    if (plugin instanceof LeafEditorPlugin) {
      const element = plugin.processLeaf(props, style);
      if (element !== undefined) {
        children = element;
      }
    }
  }

  return (
    // @ts-ignore
    <span key={props.leaf.key} {...props.attributes} style={style}>
      {children}
    </span>
  );
};

export interface EditorProps {
  provider: HocuspocusProvider;
  writeable: boolean;
}

export const EditorContext = createContext<EditorProps>({});

const Editor: React.FC<EditorProps> = ({ provider, writeable }) => {
  const { currentUser } = useModel('currentUser');

  const [value, setValue] = useState<Descendant[]>([]);

  useEffect(() => {
    console.log(value);
  }, [value]);

  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText) as Y.XmlText;

    let e = withReact(
      withYHistory(
        withCursors(
          withYjs(createEditor(), sharedType, { autoConnect: false }),
          provider.awareness,
          {
            data: currentUser
              ? makeCursorData(currentUser.uid, writeable)
              : undefined,
          },
        ),
      ),
    );

    PLUGINS.flatMap((x) => x.plugins).forEach((plugin) => {
      e = plugin.withEditor(e);
    });

    return e;
  }, [PLUGINS, currentUser, provider.awareness, provider.document]);

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

  return (
    <EditorContext.Provider value={{ provider, writeable }}>
      <Slate editor={editor} value={value} onChange={setValue}>
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
    </EditorContext.Provider>
  );
};

export default Editor;
