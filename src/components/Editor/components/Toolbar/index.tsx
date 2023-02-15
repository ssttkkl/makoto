import { Divider, Space } from 'antd';
import { CSSProperties, ReactElement } from 'react';
import { EditorPluginGroup } from '../../plugins/types';

export interface ToolbarProps {
  plugins: EditorPluginGroup[];
  className?: string;
  style?: CSSProperties;
}

const Toolbar: React.FC<ToolbarProps> = ({ plugins, className, style }) => {
  const children: ReactElement[] = [];

  plugins.forEach((item, i) => {
    let cnt = 0;
    for (const { key, toolbarItem } of item.plugins) {
      if (toolbarItem) {
        children.push(<div key={`item-${key}`}>{toolbarItem.render()}</div>);
        cnt++;
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
