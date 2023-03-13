import FileTable from '@/components/FileTable';
import { RecycleBinEntity } from '@/services/recycle-bin/entities';
import { mergePath, splitPath } from '@/utils/path';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Space, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect } from 'react';
import { RecycleBinOperationBar } from './RecycleBinOperationBar';

const RecycleBinPage: React.FC = () => {
  const model = useModel('RecycleBin.model');

  // 在从别的页面切换回来时刷新数据
  useEffect(() => {
    model.refresh();
  }, []);

  if (model.error) {
    return <div>{model.error.message}</div>;
  }

  const rowSelection: TableRowSelection<RecycleBinEntity> = {
    selectedRowKeys: model.selectedEntities.map((value) => value.entityId),
    onChange: (_: React.Key[], selectedRows: RecycleBinEntity[]) => {
      model.setSelectedEntities(selectedRows);
    },
  };

  const extraColumns: ColumnsType<RecycleBinEntity> = [
    {
      title: '原位置',
      dataIndex: 'path',
      key: 'path',
      render: (value: string) => {
        const path = splitPath(value);
        path.pop();
        return mergePath(path);
      },
    },
    {
      title: '删除时间',
      dataIndex: 'ctime',
      key: 'ctime',
      render: (value: Date) => value.toLocaleString(),
    },
  ];

  return (
    <Spin spinning={false}>
      <PageContainer breadcrumb={undefined}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <RecycleBinOperationBar />
          <FileTable
            rowKey="entityId"
            dataSource={model.entities}
            dataSourcePath={['file']}
            pagination={false}
            rowSelection={rowSelection}
            selectColumns={['filename', 'type']}
            extraColumns={extraColumns}
            renderOperations={(record) => (
              <RecycleBinOperationBar entities={[record]} mini />
            )}
          />
        </Space>
      </PageContainer>
    </Spin>
  );
};

export default RecycleBinPage;
