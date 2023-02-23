import React, { ReactElement, useState } from 'react';
import { Table } from 'antd';

import { ColumnsType, TableProps } from 'antd/es/table';
import { Share } from '@/services/share/entities';
import TableMainColumnCell from '../TableMainColumnCell';
import { User } from '@/services/users/entities';

function shareLink(share: Share): string {
  return `/share?shareId=${share.shareId}`;
}

export interface ShareTableProps extends TableProps<Share> {
  renderOperations?: (record: Share) => ReactElement;
  collapseOperations?: boolean;
}

const ShareTable: React.FC<ShareTableProps> = (props) => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number>();

  const columns: ColumnsType<Share> = [
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
      render: (value: User) => value.nickname,
    },
    {
      title: '失效时间',
      dataIndex: 'etime',
      key: 'etime',
    },
  ];

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
