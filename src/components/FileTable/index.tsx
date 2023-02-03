import React from 'react';
import { Space, Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { FileInfo } from '@/services/files/entities';

export interface FileListProps extends TableProps<FileInfo> {
  recordLink: (record: FileInfo) => string;
}

const FileTable: React.FC<FileListProps> = (props) => {
  const columns: ColumnsType<FileInfo> = [
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      render: (value, record) => {
        const icon =
          record.type === 'document' ? <FileOutlined /> : <FolderOutlined />;
        return (
          <Link to={props.recordLink(record)}>
            <Space>
              {icon}
              {value}
            </Space>
          </Link>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (value) => (value === 'document' ? '文档' : '目录'),
    },
    {
      title: '修改时间',
      dataIndex: 'mtime',
      key: 'mtime',
      render: (value: Date) => value?.toLocaleString() ?? '-',
    },
  ];

  return <Table columns={columns} rowKey="fid" {...props} />;
};

export default FileTable;
