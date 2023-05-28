import React, { ReactNode, useState } from 'react';
import { Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { FileInfo, FileType, LinkInfo } from '@/services/files/entities';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import TableMainColumnCell from '../TableMainColumnCell';
import { getFileIcon, getFileRealType } from '@/utils/file';
import { UserAvatarWithNickname } from '../UserAvatar';
import { useFriendlyDateTimeFormatter } from '@/utils/hooks';

type FileTableColumns =
  | 'filename'
  | 'type'
  | 'owner'
  | 'lastModifyUser'
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
  originFile?: boolean;
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
  const formatDate = useFriendlyDateTimeFormatter();
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
      render: (value: number, record: T) => {
        const data: FileInfo = getData(record, dataSourcePath);
        if (props.originFile !== true && data instanceof LinkInfo) {
          if (data.ref?.ownerUid) {
            return <UserAvatarWithNickname uid={data.ref?.ownerUid} />;
          } else {
            return '（原文件已被移除）';
          }
        } else {
          return <UserAvatarWithNickname uid={value} />;
        }
      },
    },
    {
      title: '最近修改者',
      dataIndex: [...dataSourcePath, 'lastModifyUserUid'],
      key: 'lastModifyUser',
      render: (_: number | undefined, record: T) => {
        const data = getData(record, dataSourcePath);
        const value =
          data instanceof LinkInfo
            ? data.ref?.lastModifyUserUid
            : data.lastModifyUserUid;

        if (value) {
          return <UserAvatarWithNickname uid={value} />;
        } else {
          return '-';
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: [...dataSourcePath, 'ctime'],
      key: 'ctime',
      render: (_: Date | undefined, record: T) => {
        const data = getData(record, dataSourcePath);
        const value =
          props.originFile !== true && data instanceof LinkInfo
            ? data.ref?.ctime
            : data.ctime;
        return formatDate(value);
      },
    },
    {
      title: '最近修改时间',
      dataIndex: [...dataSourcePath, 'mtime'],
      key: 'mtime',
      render: (_: Date | undefined, record: T) => {
        const data = getData(record, dataSourcePath);
        const value = data instanceof LinkInfo ? data.ref?.mtime : data.mtime;
        return formatDate(value);
      },
    },
    {
      title: '最近访问时间',
      dataIndex: [...dataSourcePath, 'atime'],
      key: 'atime',
      render: (_: Date | undefined, record: T) => {
        const data = getData(record, dataSourcePath);
        const value = data instanceof LinkInfo ? data.ref?.atime : data.atime;
        return formatDate(value);
      },
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
