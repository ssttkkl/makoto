import ShareTable from '@/components/ShareTable';
import { Share } from '@/services/share/entities';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Space, Spin } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect } from 'react';
import { OwnSharesOperationBar } from './OwnShareOperationBar';

const OwnSharesPage: React.FC = () => {
  const model = useModel('OwnShares.model');

  // 在从别的页面切换回来时刷新数据
  useEffect(() => {
    model.updateParams({});
    model.refresh();
  }, []);

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
      <PageContainer breadcrumb={undefined}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <OwnSharesOperationBar
            shares={model.selectedShares}
            refresh={model.refresh}
          />
          <ShareTable
            dataSource={model.shares}
            pagination={false}
            rowSelection={rowSelection}
            selectColumns={[
              'title',
              'permission',
              'allowLink',
              'ctime',
              'etime',
            ]}
          />
        </Space>
      </PageContainer>
    </Spin>
  );
};

export default OwnSharesPage;
