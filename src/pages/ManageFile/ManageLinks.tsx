import FileTable from '@/components/FileTable';
import { OperationBar, OperationGroup } from '@/components/OperationBar';
import { setLinkReferencingToNull } from '@/services/files';
import { LinkInfo } from '@/services/files/entities';
import { DisconnectOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { message, Space, Spin } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useState } from 'react';

const ManageLinksOperationBar: React.FC<{
  links: LinkInfo[];
  mini?: boolean;
  refresh?: () => Promise<any>;
}> = ({ links, mini: _mini, refresh }) => {
  const mini = _mini === true;

  const op: OperationGroup[] = [
    [
      {
        key: 'set-null',
        title: '移除链接',
        icon: <DisconnectOutlined />,
        btnProps: {
          disabled: links.length === 0,
        },
        onClick: async () => {
          for (const x of links) {
            await setLinkReferencingToNull({ fid: x.fid });
          }
          message.success('成功移除链接');
          if (refresh) {
            await refresh();
          }
        },
      },
    ],
  ];

  return <OperationBar operations={op} mini={mini} />;
};

const ManageLinks: React.FC = () => {
  const { linksReq } = useModel('ManageFile.model', ({ linksReq }) => ({
    linksReq,
  }));

  const [selectedLinks, setSelectedLinks] = useState<LinkInfo[]>([]);

  const rowSelection: TableRowSelection<LinkInfo> = {
    selectedRowKeys: selectedLinks.map((value) => value.fid),
    onChange: (_: React.Key[], selectedRows: LinkInfo[]) => {
      setSelectedLinks(selectedRows);
    },
  };

  const refresh = () => {
    setSelectedLinks([]);
    return linksReq.refresh();
  };

  return (
    <Spin spinning={linksReq.loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <ManageLinksOperationBar links={selectedLinks} refresh={refresh} />
        <FileTable
          dataSource={linksReq.data as LinkInfo[] | undefined}
          selectColumns={['owner', 'ctime']}
          pagination={false}
          rowSelection={rowSelection}
          renderOperations={(link) => (
            <ManageLinksOperationBar mini links={[link]} refresh={refresh} />
          )}
        />
      </Space>
    </Spin>
  );
};

export default ManageLinks;
