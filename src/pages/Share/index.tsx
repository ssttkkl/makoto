import FileTable from '@/components/FileTable';
import PathBreadcrumb from '@/components/PathBreadcrumb';
import { FileInfo, FolderInfo } from '@/services/files/entities';
import { mergePath, splitPath } from '@/utils/path';
import { UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useSearchParams } from '@umijs/max';
import { Alert, Space, Spin } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect } from 'react';
import { ShareOperationBar } from './ShareOperationBar';

const SharePage: React.FC = () => {
  const model = useModel('Share.model');

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let path = splitPath(searchParams.get('path') ?? '');

    let shareId: number | undefined = undefined;
    let rawShareId = searchParams.get('shareId');
    if (rawShareId !== null) {
      shareId = Number.parseInt(rawShareId);
    }

    model.setParams({ shareId, path });
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
      <PageContainer title={model.share?.title} extra={<ShareOperationBar />}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {model.share?.expired === true ? (
            <Alert message="分享已失效" type="error" />
          ) : null}

          <PathBreadcrumb
            home={
              <>
                <UserOutlined />
                <span>分享</span>
              </>
            }
            path={model.params.path}
            itemLink={(path) =>
              `/share?shareId=${model.params.shareId}&path=${mergePath(path)}`
            }
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
                return `/doc?shareId=${model.params.shareId}&fid=${record.fid}`;
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
