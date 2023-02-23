import FileTable from '@/components/FileTable';
import { useModel, useSearchParams } from '@umijs/max';
import { Space, Spin } from 'antd';
import { useEffect } from 'react';
import PathBreadcrumb from '@/components/PathBreadcrumb';
import { UserOutlined } from '@ant-design/icons';
import { mergePath, splitPath } from '@/utils/path';
import { FileInfo } from '@/services/files/entities';
import { TableRowSelection } from 'antd/es/table/interface';
import SpaceOperationBar from './SpaceOperationBar';

const SpacePage: React.FC = () => {
  const {
    params,
    setParams,
    data,
    error,
    loading,
    selectedFiles,
    setSelectedFiles,
  } = useModel('Space.model');

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let path = splitPath(searchParams.get('path') ?? '');
    setParams({ path });
  }, [searchParams]);

  const rowSelection: TableRowSelection<FileInfo> = {
    selectedRowKeys: selectedFiles.map((value) => value.fid),
    onChange: (_: React.Key[], selectedRows: FileInfo[]) => {
      setSelectedFiles(selectedRows);
    },
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <PathBreadcrumb
          home={
            <>
              <UserOutlined />
              <span>我的空间</span>
            </>
          }
          path={params.path}
          itemLink={(path) => `/space?path=${mergePath(path)}`}
        />

        <SpaceOperationBar />

        <FileTable
          dataSource={data?.children}
          pagination={false}
          recordLink={(record) => {
            if (record.type === 'folder') {
              return `/space?path=${mergePath([
                ...params.path,
                record.filename,
              ])}`;
            } else {
              return `/doc?fid=${record.fid}`;
            }
          }}
          rowSelection={rowSelection}
          renderOperations={(record) => (
            <SpaceOperationBar mini files={[record]} />
          )}
          collapseOperations={true}
        />
      </Space>
    </Spin>
  );
};

export default SpacePage;
