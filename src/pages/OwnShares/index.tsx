import ShareTable from '@/components/ShareTable';
import { Share } from '@/services/share/entities';
import { useModel } from '@umijs/max';
import { Spin } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';

const OwnSharesPage: React.FC = () => {
  const model = useModel('OwnShares.model');

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
    <Spin spinning={false}>
      <ShareTable
        dataSource={model.shares}
        pagination={false}
        rowSelection={rowSelection}
        selectColumns={['title', 'permission', 'ctime', 'etime']}
      />
    </Spin>
  );
};

export default OwnSharesPage;
