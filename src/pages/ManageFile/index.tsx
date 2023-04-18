import ShareTable from '@/components/ShareTable';
import { getFileInfo, getLinksReferencingFile } from '@/services/files';
import { LinkInfo } from '@/services/files/entities';
import { getSharesContainingFile } from '@/services/files';
import { Share } from '@/services/share/entities';
import { useRequest } from '@/utils/request';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Spin, Tabs, TabsProps } from 'antd';
import { history } from 'umi';
import { getFileIcon } from '@/utils/file';
import { FileOutlined } from '@ant-design/icons';
import FileTable from '@/components/FileTable';

const ManageShares: React.FC<{ shares: Share[] }> = ({ shares }) => {
  return (
    <ShareTable
      dataSource={shares}
      selectColumns={['title', 'permission', 'allowLink', 'ctime', 'etime']}
      pagination={false}
    />
  );
};
const ManageLinks: React.FC<{ links: LinkInfo[] }> = ({ links }) => {
  return (
    <FileTable
      dataSource={links}
      selectColumns={['owner', 'ctime']}
      pagination={false}
    />
  );
};

const ManageFilePage: React.FC<{ fid: number }> = ({ fid }) => {
  const fileReq = useRequest(
    async () => {
      return await getFileInfo({ fid });
    },
    {
      refreshDeps: [fid],
    },
  );

  const sharesReq = useRequest(
    async () => {
      return await getSharesContainingFile({ fid });
    },
    {
      refreshDeps: [fid],
    },
  );

  const linksReq = useRequest(
    async () => {
      return await getLinksReferencingFile({ fid });
    },
    {
      refreshDeps: [fid],
    },
  );

  const items: TabsProps['items'] = [
    {
      key: 'shares',
      label: `管理分享`,
      children: (
        <Spin spinning={sharesReq.loading}>
          {sharesReq.data ? (
            <ManageShares shares={sharesReq.data as Share[]} />
          ) : null}
        </Spin>
      ),
    },
    {
      key: 'links',
      label: `管理链接`,
      children: (
        <Spin spinning={linksReq.loading}>
          {linksReq.data ? (
            <ManageLinks links={linksReq.data as LinkInfo[]} />
          ) : null}
        </Spin>
      ),
    },
  ];

  const Icon = fileReq.data ? getFileIcon(fileReq.data) : FileOutlined;

  return (
    <PageContainer
      title={
        <>
          <Icon />
          <span style={{ paddingInline: '8px 0' }}>
            {fileReq.data?.filename}
          </span>
        </>
      }
      breadcrumb={undefined}
    >
      <Tabs defaultActiveKey="shares" items={items} />
    </PageContainer>
  );
};

export default () => {
  const [searchParams] = useSearchParams();
  const rawFid = searchParams.get('fid');

  if (rawFid !== null) {
    const fid = Number.parseInt(rawFid);
    if (!Number.isNaN(fid)) {
      return <ManageFilePage fid={fid} />;
    }
  } else {
    history.push('/space');
    return null;
  }
};
