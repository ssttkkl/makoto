import FileTable from '@/components/FileTable';
import { useModel, useSearchParams } from '@umijs/max';
import { Space, Spin } from 'antd';
import { useEffect } from 'react';
import PathBreadcrumb from '@/components/PathBreadcrumb';
import { UserOutlined } from '@ant-design/icons';
import { mergePath, splitPath } from '@/utils/path';
import { FileInfo, FolderInfo } from '@/services/files/entities';
import { TableRowSelection } from 'antd/es/table/interface';
import SpaceOperationBar from './SpaceOperationBar';

const SpacePage: React.FC = () => {
  const model = useModel('Space.model');

  // 在从别的页面切换回来时刷新数据
  useEffect(() => {
    model.refresh();
  }, []);

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let path = splitPath(searchParams.get('path') ?? '');
    model.updateParams({ path });
  }, [searchParams]);

  const rowSelection: TableRowSelection<FileInfo> = {
    selectedRowKeys: model.selectedFiles.map((value) => value.fid),
    onChange: (_: React.Key[], selectedRows: FileInfo[]) => {
      model.setSelectedFiles(selectedRows);
    },
  };

  if (model.error) {
    return <div>{model.error.message}</div>;
  }

  return (
    <Spin spinning={model.loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <PathBreadcrumb
          home={
            <>
              <UserOutlined />
              <span>我的空间</span>
            </>
          }
          path={model.params.path}
          itemLink={(path) => `/space?path=${mergePath(path)}`}
        />

        <SpaceOperationBar />

        <FileTable
          dataSource={model.data?.children}
          pagination={false}
          recordLink={(record) => {
            if (record instanceof FolderInfo) {
              return `/space?path=${mergePath([
                ...model.params.path,
                record.filename,
              ])}`;
            } else {
              return `/doc?fid=${record.fid}`;
            }
          }}
          rowSelection={rowSelection}
          collapseOperations={true}
          renderOperations={(record) => (
            <SpaceOperationBar mini files={[record]} />
          )}
        />
      </Space>
    </Spin>
  );
};

export default SpacePage;
