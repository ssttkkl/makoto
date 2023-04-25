import { FileInfo } from '@/services/files/entities';
import { PageContainer } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Spin, Tabs, TabsProps } from 'antd';
import { history } from 'umi';
import { getFileIcon } from '@/utils/file';
import { FileOutlined } from '@ant-design/icons';
import ManageLinks from './ManageLinks';
import ManageShares from './ManageShares';
import FileInfoDescription from '@/components/FileInfoDescription';
import { useModel } from '@umijs/max';
import { useEffect } from 'react';

const ManageFilePage: React.FC = () => {
  const model = useModel('ManageFile.model');

  // 在从别的页面切换回来时刷新数据
  useEffect(() => {
    model.refresh();
  }, []);

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let fid = NaN;
    const rawFid = searchParams.get('fid');
    if (rawFid !== null) {
      fid = Number.parseInt(rawFid);
    }

    if (Number.isNaN(fid)) {
      history.push('/');
      return;
    }

    model.updateParams({ fid });
  }, [searchParams]);

  const file = model.fileReq.data as FileInfo | undefined;

  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: '文件信息',
      children: (
        <Spin spinning={model.fileReq.loading}>
          {file ? <FileInfoDescription file={file} /> : null}
        </Spin>
      ),
    },
    {
      key: 'shares',
      label: '管理分享',
      children: <ManageShares />,
    },
    {
      key: 'links',
      label: '管理链接',
      children: <ManageLinks />,
    },
  ];

  const Icon = file ? getFileIcon(file) : FileOutlined;

  return (
    <PageContainer
      title={
        <>
          <Icon />
          <span style={{ paddingInline: '8px 0' }}>{file?.filename}</span>
        </>
      }
      breadcrumb={undefined}
    >
      <Tabs defaultActiveKey="shares" items={items} />
    </PageContainer>
  );
};

export default ManageFilePage;
