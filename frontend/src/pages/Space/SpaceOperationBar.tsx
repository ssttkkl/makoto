import FileInfoDescription from '@/components/FileInfoDescription';
import FilenameForm from '@/components/FilenameForm';
import { OperationBar, OperationGroup } from '@/components/OperationBar';
import { OperationButton } from '@/components/OperationButton';
import { FileInfo, LinkInfo } from '@/services/files/entities';
import { moveIntoRecycleBin } from '@/services/recycle-bin';
import { createSpaceFile, renameSpaceFile } from '@/services/space';
import { mergePath } from '@/utils/path';
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
import { App } from 'antd';
import { useCallback } from 'react';
import CreateShareForm from './CreateShareForm';
import { CopyFileFormButton, MoveFileFormButton } from './FileFormButton';

const SpaceOperationBar: React.FC<{
  files?: FileInfo[];
  mini?: boolean;
}> = ({ files: _files, mini: _mini }) => {
  const model = useModel('Space.model', (model) => ({
    params: model.params,
    refresh: model.refresh,
    selectedFiles: model.selectedFiles,
    setSelectedFiles: model.setSelectedFiles,
  }));
  const { message, modal } = App.useApp();

  const files = _files === undefined ? model.selectedFiles : _files;
  const mini = _mini === true;

  const shareOp = {
    key: 'share',
    title: '分享',
    render: useCallback(
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
    ),
  };

  const copyOp = {
    key: 'copy',
    title: '复制',
    render: useCallback(
      (key: string, mini: boolean) => (
        <CopyFileFormButton
          key={key}
          basePath={model.params.path}
          files={files}
          onFinish={async () => {
            message.success('复制文件成功');
            await model.refresh();
            return true;
          }}
          trigger={
            <OperationButton title="复制" icon={<CopyOutlined />} mini={mini} />
          }
        />
      ),
      [model.refresh, model.params.path, files],
    ),
  };

  const moveOp = {
    key: 'move',
    title: '移动',
    render: useCallback(
      (key: string, mini: boolean) => (
        <MoveFileFormButton
          key={key}
          basePath={model.params.path}
          files={files}
          onFinish={async () => {
            message.success('移动文件成功');
            await model.refresh();
            return true;
          }}
          trigger={
            <OperationButton
              title="移动"
              icon={<ScissorOutlined />}
              mini={mini}
            />
          }
        />
      ),
      [model.refresh, model.params.path, files],
    ),
  };

  const deleteOp = {
    key: 'delete',
    title: '删除',
    icon: <DeleteOutlined />,
    btnProps: {
      danger: true,
    },
    onClick: async () => {
      await moveIntoRecycleBin({
        path: files.map((x) => mergePath([...model.params.path, x.filename])),
      });
      message.success('成功将文件移到回收站');
      model.setSelectedFiles([]);
      await model.refresh();
    },
  };

  const renameOp = {
    key: 'rename',
    title: '重命名',
    render: useCallback(
      (key: string, mini: boolean) => (
        <FilenameForm
          key={key}
          title="重命名"
          placeholder="文件名"
          onFinish={async (formData) => {
            await renameSpaceFile({
              path: mergePath([...model.params.path, files[0].filename]),
              newFilename: formData.filename,
            });
            message.success('重命名文件成功');
            await model.refresh();
            return true;
          }}
          trigger={
            <OperationButton
              title="重命名"
              icon={<EditOutlined />}
              mini={mini}
            />
          }
        />
      ),
      [model.refresh, model.params.path, files],
    ),
  };

  const infoOp = {
    key: 'info',
    title: '文件信息',
    icon: <InfoCircleOutlined />,
    onClick: async () => {
      modal.info({
        title: '文件信息',
        content: <FileInfoDescription file={files[0]} />,
      });
    },
  };

  const manageFileOp = {
    key: 'manage-file',
    title: '管理分享与链接',
    icon: <DeploymentUnitOutlined />,
    onClick: async () => {
      window.open(`/file-manage?fid=${files[0].fid}`);
    },
  };

  const createDocumentOp = {
    key: 'create-document',
    title: '新建文档',
    render: useCallback(
      (key: string, mini: boolean) => (
        <FilenameForm
          key={key}
          title="新建文档"
          placeholder="文档名"
          onFinish={async (formData) => {
            await createSpaceFile({
              type: 'document',
              path: mergePath(model.params.path),
              filename: formData.filename,
            });
            message.success('新建文档成功');
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
    ),
  };

  const createFolderOp = {
    key: 'create-folder',
    title: '新建目录',
    render: useCallback(
      (key: string, mini: boolean) => (
        <FilenameForm
          key={key}
          title="新建目录"
          placeholder="目录名"
          onFinish={async (formData) => {
            await createSpaceFile({
              type: 'folder',
              path: mergePath(model.params.path),
              filename: formData.filename,
            });
            message.success('新建目录成功');
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
    ),
  };

  const op: OperationGroup[] = [];

  if (files.some((x) => x instanceof LinkInfo && x.ref === null)) {
    // 断开的链接只允许删除操作
    op.push([deleteOp]);
  } else if (files.length !== 0) {
    op.push([shareOp]);

    const basic: OperationGroup = [copyOp, moveOp, deleteOp];
    if (files.length === 1) {
      basic.push(renameOp);
    }
    op.push(basic);

    if (files.length === 1) {
      const meta = [infoOp];
      if (!(files[0] instanceof LinkInfo)) {
        meta.push(manageFileOp);
      }
      op.push(meta);
    }
  } else {
    op.push([createDocumentOp, createFolderOp]);
  }

  return <OperationBar operations={op} mini={mini} />;
};

export default SpaceOperationBar;
