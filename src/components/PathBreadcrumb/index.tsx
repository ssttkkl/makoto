import { ArrowUpOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Breadcrumb, Button, Space } from 'antd';

export interface PathBreadcrumbProps {
  path: string;
  itemLink: (path: string) => string;
}

const PathBreadcrumb: React.FC<PathBreadcrumbProps> = (props) => {
  const path = props.path.split('/').filter((value) => value.length > 0);

  let targetPath = '';
  let upperPath = '';

  const items = path.map((p, idx) => {
    upperPath = targetPath;

    targetPath += '/';
    targetPath += p;

    return (
      <Breadcrumb.Item key={`${idx + 1}-${p}`}>
        <Link to={props.itemLink(targetPath)}>{p}</Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <Space>
      <Link to={props.itemLink(upperPath)}>
        <Button disabled={items.length === 0}>
          <ArrowUpOutlined />
        </Button>
      </Link>
      <Breadcrumb>
        <Breadcrumb.Item key={0}>
          <Link to={props.itemLink('/')}>
            <UserOutlined />
            <span>我的空间</span>
          </Link>
        </Breadcrumb.Item>
        {items}
      </Breadcrumb>
    </Space>
  );
};

export default PathBreadcrumb;
