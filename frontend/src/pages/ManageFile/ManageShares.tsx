import ShareTable from '@/components/ShareTable';
import { Share } from '@/services/share/entities';
import { useModel } from '@umijs/max';
import { Space, Spin } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';
import { OwnSharesOperationBar } from '../OwnShares/OwnShareOperationBar';

const ManageShares: React.FC = () => {
  const { sharesReq } = useModel('ManageFile.model', ({ sharesReq }) => ({
    sharesReq,
  }));

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  const rowSelection: TableRowSelection<Share> = {
    selectedRowKeys: selectedShares.map((value) => value.shareId),
    onChange: (_: React.Key[], selectedRows: Share[]) => {
      setSelectedShares(selectedRows);
    },
  };

  const refresh = () => {
    setSelectedShares([]);
    return sharesReq.refresh();
  };

  return (
    <Spin spinning={sharesReq.loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <OwnSharesOperationBar shares={selectedShares} refresh={refresh} />
        <ShareTable
          dataSource={sharesReq.data as Share[] | undefined}
          selectColumns={['title', 'permission', 'allowLink', 'ctime', 'etime']}
          pagination={false}
          rowSelection={rowSelection}
        />
      </Space>
    </Spin>
  );
};

export default ManageShares;
