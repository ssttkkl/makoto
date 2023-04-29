import ShareTable from '@/components/ShareTable';
import { Share } from '@/services/share/entities';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Checkbox, Spin } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect } from 'react';

const RecentSharesPage: React.FC = () => {
  const model = useModel('RecentShares.model');

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
        <ShareTable
          dataSource={model.shares}
          pagination={false}
          rowSelection={rowSelection}
          selectColumns={['title', 'owner', 'etime']}
        />
      </PageContainer>
    </Spin>
  );
};

export default RecentSharesPage;
