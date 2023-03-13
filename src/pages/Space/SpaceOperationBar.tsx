import { OperationBar, OperationGroup } from '@/components/OperationBar';
import { OperationButton } from '@/components/OperationButton';
import { DocumentInfo, FileInfo, LinkInfo } from '@/services/files/entities';
import { getProfile } from '@/services/profiles';
import { moveIntoRecycleBin } from '@/services/recycle-bin';
import { mergePath } from '@/utils/path';
import { mapPermission } from '@/utils/permission';
import {
  CopyOutlined,
  DeleteOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  ScissorOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Descriptions, message, Modal } from 'antd';
import { useCallback } from 'react';
import {
  CreateDocumentFormButton,
  CreateFolderFormButton,
} from './CreateFileForm';
import CreateShareForm from './CreateShareForm';

const SpaceOperationBar: React.FC<{
  files?: FileInfo[];
  mini?: boolean;
}> = ({ files: _files, mini: _mini }) => {
  const model = useModel('Space.model');

  const files = _files === undefined ? model.selectedFiles : _files;
  const mini = _mini === true;

  const renderShare = useCallback(
    (key: string, mini: boolean) => (
      <CreateShareForm
        key={key}
        path={model.params.path}
        files={files}
        trigger={
          <OperationButton
            type="primary"
            title="分享"
            icon={<ShareAltOutlined />}
            mini={mini}
          />
        }
      />
    ),
    [files, model.params.path],
  );

  const renderCreateDocument = useCallback(
    (key: string, mini: boolean) => (
      <CreateDocumentFormButton
        key={key}
        basePath={model.params.path}
        onFinish={async () => {
          await model.refresh();
          return true;
        }}
        trigger={
          <OperationButton
            type="primary"
            title="新建文档"
            icon={<FileOutlined />}
            mini={mini}
          />
        }
      />
    ),
    [model.refresh, model.params.path],
  );

  const renderCreateFolder = useCallback(
    (key: string, mini: boolean) => (
      <CreateFolderFormButton
        key={key}
        basePath={model.params.path}
        onFinish={async () => {
          await model.refresh();
          return true;
        }}
        trigger={
          <OperationButton
            title="新建目录"
            icon={<FolderOutlined />}
            mini={mini}
          />
        }
      />
    ),
    [model.refresh, model.params.path],
  );

  const op: OperationGroup[] = [];

  if (files.length !== 0) {
    if (!mini) {
      op.push([
        {
          key: 'share',
          title: '分享',
          render: renderShare,
        },
      ]);
    }

    const basic = [
      {
        key: 'copy',
        title: '复制',
        icon: <CopyOutlined />,
      },
      {
        key: 'move',
        title: '移动',
        icon: <ScissorOutlined />,
      },
      {
        key: 'delete',
        title: '删除',
        icon: <DeleteOutlined />,
        btnProps: {
          danger: true,
        },
        onClick: async () => {
          await moveIntoRecycleBin({
            path: files.map((x) =>
              mergePath([...model.params.path, x.filename]),
            ),
          });
          message.success('成功将文件移到回收站');
          model.setSelectedFiles([]);
          await model.refresh();
        },
      },
    ];

    if (files.length === 1) {
      basic.push({
        key: 'rename',
        title: '重命名',
        icon: <EditOutlined />,
      });
    }

    op.push(basic);

    if (files.length === 1) {
      op.push([
        {
          key: 'info',
          title: '文件信息',
          icon: <InfoCircleOutlined />,
          onClick: async () => {
            const originFile = files[0];
            const file =
              originFile instanceof LinkInfo ? originFile.ref : originFile;
            const owner = await getProfile({ uid: file.ownerUid });

            if (file instanceof DocumentInfo) {
              Modal.info({
                title: '分享信息',
                content: (
                  <Descriptions column={1}>
                    <Descriptions.Item label="文件名">
                      {file.filename}
                    </Descriptions.Item>
                    <Descriptions.Item label="文件类型">
                      {originFile instanceof LinkInfo ? '文档（链接）' : '文档'}
                    </Descriptions.Item>
                    <Descriptions.Item label="所有者">
                      {owner.nickname}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                      {file.ctime.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="修改时间">
                      {file.mtime.toLocaleString()}
                    </Descriptions.Item>
                    {originFile instanceof LinkInfo ? (
                      <Descriptions.Item label="权限">
                        {mapPermission(originFile.permission)}
                      </Descriptions.Item>
                    ) : null}
                  </Descriptions>
                ),
              });
            }
          },
        },
        {
          key: 'share-manage',
          title: '管理分享与链接',
          icon: <DeploymentUnitOutlined />,
        },
      ]);
    }
  } else {
    op.push([
      {
        key: 'create-document',
        title: '新建文档',
        render: renderCreateDocument,
      },
      {
        key: 'create-folder',
        title: '新建目录',
        render: renderCreateFolder,
      },
    ]);
  }

  return <OperationBar operations={op} mini={mini} />;
};

export default SpaceOperationBar;
