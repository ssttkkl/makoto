import React, { ReactElement, ReactNode, useState } from 'react';
import { Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';
import { FileInfo, FileType, LinkInfo } from '@/services/files/entities';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import TableMainColumnCell from '../TableMainColumnCell';

export interface FileTableProps extends TableProps<FileInfo> {
  recordLink: (record: FileInfo) => string;
  renderOperations?: (record: FileInfo) => ReactNode;
  collapseOperations?: boolean;
}

function getFileRealType(file: FileInfo) {
  let type = file.type;
  if (type === 'link') {
    type = (file as LinkInfo).ref.type;
  }
  return type;
}

const FileTable: React.FC<FileTableProps> = (props) => {
  const filenameClassname = useEmotionCss(() => ({
    paddingInlineStart: '8px',
  }));

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number>();

  const columns: ColumnsType<FileInfo> = [
    {
      title: '文件名',
      dataIndex: 'filename',
      key: 'filename',
      render: (value: string, record: FileInfo, index: number) => {
        let icon: ReactElement | null;
        switch (getFileRealType(record)) {
          case 'document':
            icon = <FileOutlined />;
            break;
          case 'folder':
            icon = <FolderOutlined />;
            break;
          default:
            icon = null;
            break;
        }

        return (
          <TableMainColumnCell
            href={props.recordLink(record)}
            addon={
              props.renderOperations ? props.renderOperations(record) : null
            }
            collapseAddon={props.collapseOperations}
            hideAddon={hoveredRowIndex !== index}
          >
            {icon}
            <span className={filenameClassname}>{value}</span>
          </TableMainColumnCell>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (_: FileType, record: FileInfo) => {
        switch (getFileRealType(record)) {
          case 'document':
            return '文档';
          case 'folder':
            return '目录';
          default:
            return '-';
        }
      },
    },
    {
      title: '修改时间',
      dataIndex: 'mtime',
      key: 'mtime',
      render: (value: Date) => value?.toLocaleString() ?? '-',
    },
  ];

  return (
    <Table<FileInfo>
      columns={columns}
      rowKey="fid"
      onRow={(_, index) => ({
        onMouseEnter: () => setHoveredRowIndex(index),
        onMouseLeave: () => setHoveredRowIndex(undefined),
      })}
      {...props}
    />
  );
};

export default FileTable;
