import { ReactElement } from 'react';
import { EditorPlugin } from './base';

export interface EditorPluginGroup {
  key: string;
  plugins: EditorPlugin[];
}

export interface ToolbarItem {
  title: string;
  renderWriteable?: () => ReactElement;
  renderReadonly?: () => ReactElement;
}
