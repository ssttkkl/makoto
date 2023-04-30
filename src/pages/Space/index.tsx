import FileTable from '@/components/FileTable';
import { useModel, useSearchParams } from '@umijs/max';
import { Space, Spin } from 'antd';
import { useEffect } from 'react';
import { mergePath, splitPath } from '@/utils/path';
import { FileInfo, FolderInfo, LinkInfo } from '@/services/files/entities';
import { TableRowSelection } from 'antd/es/table/interface';
import SpaceOperationBar from './SpaceOperationBar';
import { SpaceBreadcrumb } from '@/components/SpaceBreadcrumb';

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
        <SpaceBreadcrumb path={model.params.path} />

        <SpaceOperationBar />

        <FileTable
          dataSource={model.data?.children}
          pagination={false}
          recordLink={(record) => {
            if (record instanceof LinkInfo && record.ref === null) {
              return undefined;
            }

            if (record instanceof FolderInfo) {
              return `/space?path=${mergePath([
                ...model.params.path,
                record.filename,
              ])}`;
            } else {
              return `/doc?path=${mergePath([
                ...model.params.path,
                record.filename,
              ])}`;
            }
          }}
          rowSelection={rowSelection}
          selectColumns={['filename', 'type', 'mtime']}
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
