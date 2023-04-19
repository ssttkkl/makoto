import React, { ReactNode, useState } from 'react';
import { Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { FileInfo, FileType, LinkInfo } from '@/services/files/entities';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import TableMainColumnCell from '../TableMainColumnCell';
import { getFileIcon, getFileRealType } from '@/utils/file';
import UserNickname from '../Username';

type FileTableColumns =
  | 'filename'
  | 'type'
  | 'owner'
  | 'ctime'
  | 'mtime'
  | 'atime';

export interface FileTableProps<T extends object = any> extends TableProps<T> {
  dataSourcePath?: string[];
  selectColumns?: FileTableColumns[];
  extraColumns?: ColumnsType<T>;
  recordLink?: (record: FileInfo) => string | undefined;
  renderOperations?: (record: T) => ReactNode;
  collapseOperations?: boolean;
}

function getData<T, U>(record: T, path: string[]): U {
  let x = record;
  for (const p of path) {
    // @ts-ignore
    x = x[p];
  }
  // @ts-ignore
  return x;
}

type FileTableType<T extends object = any> = React.FC<FileTableProps<T>>;

function FileTable<T extends object = any>(
  props: FileTableProps<T>,
): ReactNode {
  const filenameClassname = useEmotionCss(() => ({
    paddingInlineStart: '8px',
  }));

  const dataSourcePath =
    props.dataSourcePath !== undefined ? props.dataSourcePath : [];

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number>();

  let columns: ColumnsType<T> = [
    {
      title: '文件名',
      dataIndex: [...dataSourcePath, 'filename'],
      key: 'filename',
      render: (value: string, record: T, index: number) => {
        const data: FileInfo = getData(record, dataSourcePath);
        const Icon = getFileIcon(data);

        return (
          <TableMainColumnCell
            href={props.recordLink ? props.recordLink(data) : undefined}
            target={getFileRealType(data) === 'document' ? '_blank' : undefined}
            addon={
              props.renderOperations ? props.renderOperations(record) : null
            }
            collapseAddon={props.collapseOperations}
            hideAddon={hoveredRowIndex !== index}
          >
            <Icon />
            <span className={filenameClassname}>{value}</span>
          </TableMainColumnCell>
        );
      },
    },
    {
      title: '类型',
      dataIndex: [...dataSourcePath, 'type'],
      key: 'type',
      render: (_: FileType, record: T) => {
        const data: FileInfo = getData(record, dataSourcePath);
        switch (getFileRealType(data)) {
          case 'document':
            return '文档' + (data instanceof LinkInfo ? '（链接）' : '');
          case 'folder':
            return '目录' + (data instanceof LinkInfo ? '（链接）' : '');
          default:
            return '（原文件已被移除）';
        }
      },
    },
    {
      title: '所有者',
      dataIndex: [...dataSourcePath, 'ownerUid'],
      key: 'owner',
      render: (value: number) => <UserNickname uid={value} />,
    },
    {
      title: '创建时间',
      dataIndex: [...dataSourcePath, 'ctime'],
      key: 'ctime',
      render: (value: Date) => value?.toLocaleString() ?? '-',
    },
    {
      title: '上次修改时间',
      dataIndex: [...dataSourcePath, 'mtime'],
      key: 'mtime',
      render: (value: Date) => value?.toLocaleString() ?? '-',
    },
    {
      title: '上次访问时间',
      dataIndex: [...dataSourcePath, 'atime'],
      key: 'atime',
      render: (value: Date) => value?.toLocaleString() ?? '-',
    },
  ];

  if (props.selectColumns !== undefined) {
    const selectedColumns: ColumnsType<T> = [];
    props.selectColumns.forEach((x) => {
      const col = columns.find((y) => y.key === x);
      if (col !== undefined) {
        selectedColumns.push(col);
      }
    });
    columns = selectedColumns;
  }

  if (props.extraColumns !== undefined) {
    columns = [...columns, ...props.extraColumns];
  }

  return (
    <Table<T>
      columns={columns}
      rowKey="fid"
      onRow={(_, index) => ({
        onMouseEnter: () => setHoveredRowIndex(index),
        onMouseLeave: () => setHoveredRowIndex(undefined),
      })}
      {...props}
    />
  );
}

export default FileTable as FileTableType;
