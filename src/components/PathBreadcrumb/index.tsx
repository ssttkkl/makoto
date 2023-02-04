import { ArrowUpOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Breadcrumb, Button, Space } from 'antd';

export interface PathBreadcrumbProps {
  home: React.ReactNode;
  path: string[];
  itemLink: (path: string[]) => string;
}

const PathBreadcrumb: React.FC<PathBreadcrumbProps> = (props) => {
  let targetPath: string[] = [];
  let upperPath: string[] = [];
  const items: React.ReactNode[] = [];

  for (let i = 0; i < props.path.length; i++) {
    if (i > 0) {
      upperPath.push(props.path[i - 1]);
    }
    targetPath.push(props.path[i]);
    items.push(
      <Breadcrumb.Item key={`${i + 1}-${props.path[i]}`}>
        <Link to={props.itemLink(targetPath)}>{props.path[i]}</Link>
      </Breadcrumb.Item>,
    );
  }

  return (
    <Space>
      <Link to={props.itemLink(upperPath)}>
        <Button disabled={items.length === 0}>
          <ArrowUpOutlined />
        </Button>
      </Link>
      <Breadcrumb>
        <Breadcrumb.Item key={0}>
          <Link to={props.itemLink([])}>{props.home}</Link>
        </Breadcrumb.Item>
        {items}
      </Breadcrumb>
    </Space>
  );
};

export default PathBreadcrumb;
