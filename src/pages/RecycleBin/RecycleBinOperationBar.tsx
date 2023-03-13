import { OperationBar, OperationGroup } from '@/components/OperationBar';
import { deleteForever, moveOutFromRecycleBin } from '@/services/recycle-bin';
import { RecycleBinEntity } from '@/services/recycle-bin/entities';
import { CloseOutlined, UndoOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { message } from 'antd';

export const RecycleBinOperationBar: React.FC<{
  entities?: RecycleBinEntity[];
  mini?: boolean;
}> = ({ entities: _entities, mini: _mini }) => {
  const model = useModel('RecycleBin.model');

  const entities = _entities === undefined ? model.selectedEntities : _entities;
  const allEntities = model.entities;
  const mini = _mini === true;

  const op: OperationGroup[] = [
    [
      {
        key: 'moveOut',
        title: entities.length !== 0 ? '还原' : '全部还原',
        icon: <UndoOutlined />,
        btnProps: {
          type: 'primary',
          disabled: allEntities.length === 0,
        },
        onClick: async () => {
          const entitiesToMoveOut =
            entities.length !== 0 ? entities : allEntities;
          await moveOutFromRecycleBin({
            entityId: entitiesToMoveOut.map((x) => x.entityId),
          });
          model.setSelectedEntities([]);
          message.success('还原文件成功');
          await model.refresh();
        },
      },
      {
        key: 'deleteForever',
        title: entities.length !== 0 ? '永久删除' : '清空回收站',
        icon: <CloseOutlined />,
        btnProps: {
          danger: true,
          disabled: allEntities.length === 0,
        },
        onClick: async () => {
          const entitiesToDelete =
            entities.length !== 0 ? entities : allEntities;
          await deleteForever({
            entityId: entitiesToDelete.map((x) => x.entityId),
          });
          model.setSelectedEntities([]);
          message.success('永久删除文件成功');
          await model.refresh();
        },
      },
    ],
  ];

  return <OperationBar operations={op} mini={mini} />;
};
