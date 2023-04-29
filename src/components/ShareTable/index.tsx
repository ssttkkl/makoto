import React, { ReactElement, useState } from 'react';
import { Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { Share } from '@/services/share/entities';
import TableMainColumnCell from '../TableMainColumnCell';
import { User } from '@/services/users/entities';
import { FilePermissionEnum } from '@/services/files/entities';
import { mapPermission } from '@/utils/permission';
import { UserAvatarWithNickname } from '../UserAvatar';

function shareLink(share: Share): string {
  return `/share/${share.shareId}`;
}

type ShareTableColumns =
  | 'title'
  | 'owner'
  | 'permission'
  | 'allowLink'
  | 'ctime'
  | 'etime';

export interface ShareTableProps extends TableProps<Share> {
  selectColumns?: ShareTableColumns[];
  renderOperations?: (record: Share) => ReactElement;
  collapseOperations?: boolean;
}

const ShareTable: React.FC<ShareTableProps> = (props) => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number>();

  let columns: ColumnsType<Share> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (value: string, record: Share, index: number) => {
        return (
          <TableMainColumnCell
            href={shareLink(record)}
            addon={
              props.renderOperations ? props.renderOperations(record) : null
            }
            collapseAddon={props.collapseOperations}
            hideAddon={hoveredRowIndex !== index}
          >
            {value}
          </TableMainColumnCell>
        );
      },
    },
    {
      title: '分享人',
      dataIndex: 'owner',
      key: 'owner',
      render: (value: User) => <UserAvatarWithNickname user={value} />,
    },
    {
      title: '权限',
      dataIndex: 'permission',
      key: 'permission',
      render: (value: FilePermissionEnum) => mapPermission(value),
    },
    {
      title: '允许链接',
      dataIndex: 'allowLink',
      key: 'allowLink',
      render: (value: boolean) => (value ? '是' : '否'),
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      key: 'ctime',
      render: (value: Date) => value.toLocaleString(),
    },
    {
      title: '失效时间',
      dataIndex: 'etime',
      key: 'etime',
      render: (value: Date, record) => {
        if (record.expired) {
          return '已失效';
        } else {
          return value.toLocaleString();
        }
      },
    },
  ];

  if (props.selectColumns !== undefined) {
    const selectedColumns: ColumnsType<Share> = [];
    props.selectColumns.forEach((x) => {
      const col = columns.find((y) => y.key === x);
      if (col !== undefined) {
        selectedColumns.push(col);
      }
    });
    columns = selectedColumns;
  }

  return (
    <Table<Share>
      columns={columns}
      rowKey="shareId"
      onRow={(_, index) => ({
        onMouseEnter: () => setHoveredRowIndex(index),
        onMouseLeave: () => setHoveredRowIndex(undefined),
      })}
      {...props}
    />
  );
};

export default ShareTable;
