import FileList, { FileData } from '@/components/FileList';
import { ArrowUpOutlined, UserOutlined } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { Link } from '@umijs/max';
import { Breadcrumb, Button, Space } from 'antd';

const data: FileData[] = [
  {
    key: '1',
    filename: 'A',
    type: 'folder',
    last_modified: '2023/1/30 16:18',
  },
  {
    key: '2',
    filename: 'B',
    type: 'document',
    last_modified: '2023/1/30 16:18',
  },
];

const CurrentPath: React.FC<{ pathname: string }> = (props) => {
  const path = props.pathname.split('/').filter((value) => value.length > 0);

  const items = [];

  let targetPathname = '';
  let upperPathname = '';

  for (let p of path) {
    upperPathname = targetPathname;

    targetPathname += '/';
    targetPathname += p;

    items.push(
      <Breadcrumb.Item>
        <Link to={'/space?pathname=' + targetPathname}>{p}</Link>
      </Breadcrumb.Item>,
    );
  }

  return (
    <Space>
      <Link to={'/space?pathname=' + upperPathname}>
        <Button disabled={items.length === 0}>
          <ArrowUpOutlined />
        </Button>
      </Link>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/space">
            <UserOutlined />
            <span>My Space</span>
          </Link>
        </Breadcrumb.Item>
        {items}
      </Breadcrumb>
    </Space>
  );
};

const SpacePage: React.FC = () => {
  const [searchParams] = useSearchParams();

  let pathname = searchParams.get('pathname');
  if (pathname === null || pathname === '/') {
    pathname = '';
  }

  return (
    <div>
      <div style={{ margin: '0 0 16px 0' }}>
        <CurrentPath pathname={pathname} />
      </div>

      <FileList pathname={pathname} data={data} />
    </div>
  );
};

export default SpacePage;
