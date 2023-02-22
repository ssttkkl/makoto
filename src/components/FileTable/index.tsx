import React, { ReactElement, useState } from 'react';
import { Button, Popover, Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { FileOutlined, FolderOutlined, MoreOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { FileInfo, FileType, LinkInfo } from '@/services/files/entities';
import { useEmotionCss } from '@ant-design/use-emotion-css';

export interface FileListProps extends TableProps<FileInfo> {
  recordLink: (record: FileInfo) => string;
  renderFileOperation?: (record: FileInfo) => ReactElement;
}

function getFileRealType(file: FileInfo) {
  let type = file.type;
  if (type === 'link') {
    type = (file as LinkInfo).ref.type;
  }
  return type;
}

const FileTable: React.FC<FileListProps> = (props) => {
  const addonClassname = useEmotionCss(() => ({
    display: 'inline',
    float: 'right',
  }));

  const hiddenClassname = useEmotionCss(() => ({
    visibility: 'hidden',
  }));

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
          <>
            <Link to={props.recordLink(record)}>
              {icon}
              <span className={filenameClassname}>{value}</span>
            </Link>
            {props.renderFileOperation ? (
              <div
                className={
                  addonClassname +
                  ' ' +
                  (hoveredRowIndex !== index ? hiddenClassname : '')
                }
              >
                <Popover content={props.renderFileOperation(record)}>
                  <Button type="text" size="small" icon={<MoreOutlined />} />
                </Popover>
              </div>
            ) : null}
          </>
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
