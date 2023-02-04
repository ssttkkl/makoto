import { Button, ButtonProps } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { mergePath } from '@/utils/path';
import { createSpaceFile } from '@/services/space';
import { FileOutlined, FolderOutlined } from '@ant-design/icons';

export const CreateFileFormButton: React.FC<{
  title: string;
  placeholder: string;
  onFinish: (filename: string) => Promise<boolean>;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <ModalForm<{ filename: string }>
      title={props.title}
      trigger={<Button {...props.btnProps}>{props.title}</Button>}
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      onFinish={(values) => props.onFinish(values.filename)}
    >
      <ProFormText name="filename" placeholder={props.placeholder} />
    </ModalForm>
  );
};

export const CreateFolderFormButton: React.FC<{
  basePath: string[];
  onFinish?: () => void;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <CreateFileFormButton
      title="新建目录"
      placeholder="目录名"
      btnProps={{
        icon: <FolderOutlined />,
        ...props.btnProps,
      }}
      onFinish={async (filename) => {
        await createSpaceFile({
          type: 'folder',
          basePath: mergePath(props.basePath),
          filename,
        });
        if (props?.onFinish) props.onFinish();
        return true;
      }}
    />
  );
};

export const CreateDocumentFormButton: React.FC<{
  basePath: string[];
  onFinish?: () => void;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <CreateFileFormButton
      title="新建文档"
      placeholder="文档名"
      btnProps={{
        icon: <FileOutlined />,
        ...props.btnProps,
      }}
      onFinish={async (filename) => {
        await createSpaceFile({
          type: 'document',
          basePath: mergePath(props.basePath),
          filename,
        });
        if (props?.onFinish) props.onFinish();
        return true;
      }}
    />
  );
};
