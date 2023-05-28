import { Button, Checkbox, Space, Spin } from 'antd';
import { useModel } from '@umijs/max';
import ShareTable from '@/components/ShareTable';
import { TableRowSelection } from 'antd/es/table/interface';
import { Share } from '@/services/share/entities';
import { FavSharesOperationBar } from './FavShareOperationBar';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect } from 'react';

const FavSharesPage: React.FC = () => {
  const model = useModel('FavShares.model');

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
    <Spin spinning={model.loading}>
      <PageContainer
        breadcrumb={undefined}
        extra={
          <Button
            onClick={() => model.setExcludeExpired(!model.excludeExpired)}
          >
            <Checkbox checked={model.excludeExpired}>只显示未失效分享</Checkbox>
          </Button>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <FavSharesOperationBar />

          <ShareTable
            dataSource={model.shares}
            pagination={false}
            rowSelection={rowSelection}
            renderOperations={(share) => (
              <FavSharesOperationBar mini shares={[share]} />
            )}
            selectColumns={['title', 'owner', 'etime']}
          />
        </Space>
      </PageContainer>
    </Spin>
  );
};

export default FavSharesPage;
