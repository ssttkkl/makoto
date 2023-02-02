import FileTable from '@/components/FileTable';
import { ArrowUpOutlined, UserOutlined } from '@ant-design/icons';
import { useModel, useSearchParams } from '@umijs/max';
import { Link } from '@umijs/max';
import { Breadcrumb, Button, Space, Spin } from 'antd';
import { useEffect } from 'react';

const CurrentPath: React.FC<{ path: string }> = (props) => {
  const path = props.path.split('/').filter((value) => value.length > 0);

  let targetPath = '';
  let upperPath = '';

  const items = path.map((p, idx) => {
    upperPath = targetPath;

    targetPath += '/';
    targetPath += p;

    return (
      <Breadcrumb.Item key={idx + 1}>
        <Link to={'/space?path=' + targetPath}>{p}</Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <Space>
      <Link to={'/space?path=' + upperPath}>
        <Button disabled={items.length === 0}>
          <ArrowUpOutlined />
        </Button>
      </Link>
      <Breadcrumb>
        <Breadcrumb.Item key={0}>
          <Link to="/space">
            <UserOutlined />
            <span>我的空间</span>
          </Link>
        </Breadcrumb.Item>
        {items}
      </Breadcrumb>
    </Space>
  );
};

const SpacePage: React.FC = () => {
  const { setPath, data, error, loading } = useModel('Space.model');

  // 让参数的path单向同步到model里
  const [searchParams] = useSearchParams();
  let path = searchParams.get('path') ?? '';
  path = path === '/' ? '' : path;
  useEffect(() => setPath(path), [path]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Spin spinning={loading}>
      <div>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <CurrentPath path={path} />

          <Space wrap>
            <Button type="primary">新建文档</Button>
            <Button>新建目录</Button>
          </Space>

          <FileTable
            dataSource={data?.children}
            pagination={false}
            recordLink={(record) => `/space?path=${path}/${record.filename}`}
          />
        </Space>
      </div>
    </Spin>
  );
};

export default SpacePage;
