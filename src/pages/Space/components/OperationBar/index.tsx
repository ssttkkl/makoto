import TooltipButton from '@/components/TooltipButton';
import { FileInfo } from '@/services/files/entities';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  ScissorOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { ButtonProps, Space } from 'antd';
import { ReactElement } from 'react';
import {
  CreateDocumentFormButton,
  CreateFolderFormButton,
} from './CreateFileFormButton';
import CreateShareForm from './CreateShareFormButton';

const SpaceOperationBar: React.FC<{
  files?: FileInfo[];
  mini?: boolean;
  onClickItem?: (item: ReactElement) => Promise<void>;
}> = ({ files: _files, mini: _mini }) => {
  const model = useModel('Space.model');

  const files = _files === undefined ? model.selectedFiles : _files;
  const mini = _mini === true;

  const extraBtnProps: ButtonProps = {};
  if (mini) {
    extraBtnProps.size = 'small';
    extraBtnProps.children = null;
    extraBtnProps.type = 'text';
  }

  const btn: React.ReactNode[] = [];
  if (files.length !== 0) {
    if (!mini) {
      btn.push(
        <CreateShareForm
          key="share"
          path={model.params.path}
          files={files}
          trigger={
            <TooltipButton
              icon={<ShareAltOutlined />}
              type="primary"
              children="分享"
              title="分享"
              hideTootip={!mini}
              {...extraBtnProps}
            />
          }
        />,
      );
    }

    btn.push(
      <TooltipButton
        icon={<CopyOutlined />}
        children="复制"
        title="复制"
        hideTootip={!mini}
        {...extraBtnProps}
      />,
    );

    btn.push(
      <TooltipButton
        icon={<ScissorOutlined />}
        children="移动"
        title="移动"
        hideTootip={!mini}
        {...extraBtnProps}
      />,
    );

    btn.push(
      <TooltipButton
        icon={<DeleteOutlined />}
        children="删除"
        title="删除"
        hideTootip={!mini}
        danger
        {...extraBtnProps}
      />,
    );

    if (files.length === 1) {
      btn.push(
        <TooltipButton
          icon={<EditOutlined />}
          children="重命名"
          title="重命名"
          hideTootip={!mini}
          {...extraBtnProps}
        />,
      );
    }
  } else {
    btn.push(
      <CreateDocumentFormButton
        key="create-document"
        basePath={model.params.path}
        onFinish={async () => {
          await model.refresh();
          return true;
        }}
        trigger={
          <TooltipButton
            icon={<FileOutlined />}
            type="primary"
            children="新建文档"
            title="新建文档"
            hideTootip={!mini}
            {...extraBtnProps}
          />
        }
      />,
    );

    btn.push(
      <CreateFolderFormButton
        key="create-folder"
        basePath={model.params.path}
        trigger={
          <TooltipButton
            icon={<FolderOutlined />}
            children="新建目录"
            title="新建目录"
            hideTootip={!mini}
            {...extraBtnProps}
          />
        }
        onFinish={async () => {
          await model.refresh();
          return true;
        }}
      />,
    );
  }

  return <Space wrap>{btn}</Space>;
};

export default SpaceOperationBar;
