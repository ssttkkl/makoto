import React from 'react';
import { Button, Space, Table } from 'antd';

import { ColumnsType } from 'antd/es/table';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';

export interface FileData {
  key: string;
  filename: string;
  type: string;
  last_modified: string;
}

export interface FileListProps {
  pathname: string;
  data: FileData[];
}

const FileList: React.FC<FileListProps> = (props) => {
  const columns: ColumnsType<FileData> = [
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (text, record) => {
        const icon =
          record.type === 'document' ? <FileOutlined /> : <FolderOutlined />;
        const target = props.pathname + '/' + text;
        return (
          <Link to={'/space?pathname=' + target}>
            <Space>
              {icon}
              {text}
            </Space>
          </Link>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Last Modified',
      dataIndex: 'last_modified',
      key: 'last-modified',
    },
  ];
  return (
    <>
      <Space wrap>
        <Button type="primary">New Document</Button>
        <Button>New Folder</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={props.data}
        style={{ margin: '16px 0 0 0' }}
      />
    </>
  );
};

export default FileList;
