import FileTable from '@/components/FileTable';
import { FileInfo, FolderInfo } from '@/services/files/entities';
import { mergePath, splitPath } from '@/utils/path';
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { useSearchParams } from '@umijs/max';
import { Alert, Space, Spin } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect } from 'react';
import { ShareOperationBar } from './ShareOperationBar';
import { history } from 'umi';
import { ShareBreadcrumb } from '@/components/ShareBreadcrumb';

const SharePage: React.FC = () => {
  const model = useModel('Share.model');

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  const routerParams = useParams();
  useEffect(() => {
    let path = splitPath(searchParams.get('path') ?? '');

    let shareId: number | undefined = Number.parseInt(routerParams.id);
    if (isNaN(shareId)) {
      history.push('/');
      return;
    }

    model.updateParams({ shareId, path, initialized: true });
  }, [searchParams]);

  if (model.error) {
    return <div>{model.error.message}</div>;
  }

  const rowSelection: TableRowSelection<FileInfo> = {
    selectedRowKeys: model.selectedFiles.map((value) => value.fid),
    onChange: (_: React.Key[], selectedRows: FileInfo[]) => {
      model.setSelectedFiles(selectedRows);
    },
  };

  return (
    <Spin spinning={model.loading}>
      <PageContainer
        breadcrumb={undefined}
        title={model.share?.title}
        extra={<ShareOperationBar />}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {model.share?.expired === true ? (
            <Alert message="分享已失效" type="error" />
          ) : null}

          <ShareBreadcrumb
            shareId={model.params.shareId}
            path={model.params.path}
          />

          <FileTable
            dataSource={model.files}
            pagination={false}
            recordLink={(record) => {
              if (record instanceof FolderInfo) {
                return `/share?shareId=${model.params.shareId}&path=${mergePath(
                  [...model.params.path, record.filename],
                )}`;
              } else {
                return `/doc?from=share&shareId=${
                  model.params.shareId
                }&path=${mergePath([...model.params.path, record.filename])}`;
              }
            }}
            rowSelection={rowSelection}
          />
        </Space>
      </PageContainer>
    </Spin>
  );
};

export default SharePage;
