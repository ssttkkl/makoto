import { ArrowUpOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Breadcrumb, Button, Space } from 'antd';

export interface PathBreadcrumbProps {
  home: React.ReactNode;
  path: string[];
  itemLink: (path: string[]) => string | null;
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

    const link = props.itemLink(targetPath);
    if (link) {
      items.push(
        <Breadcrumb.Item key={`${i + 1}-${props.path[i]}`}>
          <Link to={link}>{props.path[i]}</Link>
        </Breadcrumb.Item>,
      );
    } else {
      items.push(
        <Breadcrumb.Item key={`${i + 1}-${props.path[i]}`}>
          {props.path[i]}
        </Breadcrumb.Item>,
      );
    }
  }

  const upperLink = props.itemLink(upperPath);
  const upperBtn = (
    <Button disabled={items.length === 0}>
      <ArrowUpOutlined />
    </Button>
  );

  const homeLink = props.itemLink([]);

  return (
    <Space>
      {upperLink ? <Link to={upperLink}>{upperBtn}</Link> : upperBtn}
      <Breadcrumb>
        <Breadcrumb.Item key={0}>
          {homeLink ? <Link to={homeLink}>{props.home}</Link> : props.home}
        </Breadcrumb.Item>
        {items}
      </Breadcrumb>
    </Space>
  );
};

export default PathBreadcrumb;
