import FileTable from '@/components/FileTable';
import PathBreadcrumb from '@/components/PathBreadcrumb';
import { mergePath, splitPath } from '@/utils/path';
import { StarOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useSearchParams } from '@umijs/max';
import { Button, Space, Spin } from 'antd';
import { useEffect } from 'react';

const SharePage: React.FC = () => {
  const { error, params, setParams, share, files } = useModel('Share.model');

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let path = splitPath(searchParams.get('path') ?? '');

    let shareId: number | undefined = undefined;
    let rawShareId = searchParams.get('shareId');
    if (rawShareId !== null) {
      shareId = Number.parseInt(rawShareId);
    }

    setParams({ shareId, path });
  }, [searchParams]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Spin spinning={false}>
      <PageContainer
        title={share?.name}
        extra={
          <Space>
            <Button type="primary" icon={<StarOutlined />}>
              收藏
            </Button>
            <Button>全部链接到我的空间</Button>
          </Space>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <PathBreadcrumb
            home={
              <>
                <UserOutlined />
                <span>分享</span>
              </>
            }
            path={params.path}
            itemLink={(path) =>
              `/share?shareId=${params.shareId}&path=${mergePath(path)}`
            }
          />

          <FileTable
            dataSource={files}
            pagination={false}
            recordLink={(record) => {
              if (record.type === 'folder') {
                return `/share?shareId=${params.shareId}&path=${mergePath([
                  ...params.path,
                  record.filename,
                ])}`;
              } else {
                return `/doc?shareId=${params.shareId}&fid=${record.fid}`;
              }
            }}
          />
        </Space>
      </PageContainer>
    </Spin>
  );
};

export default SharePage;
