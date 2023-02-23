import { Space, Spin } from 'antd';
import { useModel } from '@umijs/max';
import ShareTable from '@/components/ShareTable';
import { TableRowSelection } from 'antd/es/table/interface';
import { Share } from '@/services/share/entities';
import { FavSharesOperationBar } from './FavShareOperationBar';

const FavSharesPage: React.FC = () => {
  const model = useModel('FavShares.model');

  if (model.error) {
    return <div>{model.error.message}</div>;
  }

  const rowSelection: TableRowSelection<Share> = {
    selectedRowKeys: model.selectedShares.map((value) => value.shareId),
    onChange: (_: React.Key[], selectedRows: Share[]) => {
      model.setSelectedShares(selectedRows);
    },
  };

  return (
    <Spin spinning={model.loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <FavSharesOperationBar />

        <ShareTable
          dataSource={model.shares}
          pagination={false}
          rowSelection={rowSelection}
          renderOperations={(share) => (
            <FavSharesOperationBar mini shares={[share]} />
          )}
        />
      </Space>
    </Spin>
  );
};

export default FavSharesPage;
