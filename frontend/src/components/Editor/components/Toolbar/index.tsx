import { Divider, Space } from 'antd';
import { CSSProperties, ReactElement } from 'react';
import { EditorPluginGroup } from '../../plugins/types';

export interface ToolbarProps {
  plugins: EditorPluginGroup[];
  writeable?: boolean;
  className?: string;
  style?: CSSProperties;
}

const Toolbar: React.FC<ToolbarProps> = ({
  plugins,
  writeable,
  className,
  style,
}) => {
  const children: ReactElement[] = [];

  plugins.forEach((item, i) => {
    let cnt = 0;
    for (const { key, toolbarItem } of item.plugins) {
      if (toolbarItem) {
        let node: React.ReactNode | null = null;
        if (writeable && toolbarItem.renderWriteable) {
          node = toolbarItem.renderWriteable();
        } else if (!writeable && toolbarItem.renderReadonly) {
          node = toolbarItem.renderReadonly();
        }

        if (node) {
          children.push(<div key={`item-${key}`}>{node}</div>);
          cnt++;
        }
      }
    }

    if (cnt > 0 && i !== plugins.length - 1) {
      children.push(<Divider key={`divider-${item.key}`} type="vertical" />);
    }
  });

  return (
    <div className={className} style={style}>
      <Space wrap>{children}</Space>
    </div>
  );
};

export default Toolbar;
