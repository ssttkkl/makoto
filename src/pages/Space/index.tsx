import FileTable from '@/components/FileTable';
import { useModel, useSearchParams } from '@umijs/max';
import { Button, Space, Spin } from 'antd';
import { useEffect } from 'react';
import PathBreadcrumb from '@/components/PathBreadcrumb';

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
          <PathBreadcrumb
            path={path}
            itemLink={(path) => `/space?path=${path}`}
          />

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
