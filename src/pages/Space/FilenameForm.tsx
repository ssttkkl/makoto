import {
  ModalForm,
  ModalFormProps,
  ProFormText,
} from '@ant-design/pro-components';
import { mergePath } from '@/utils/path';
import { createSpaceFile, renameSpaceFile } from '@/services/space';

interface FilenameFormData {
  filename: string;
}

const FilenameForm: React.FC<
  ModalFormProps<FilenameFormData> & {
    placeholder: string;
  }
> = ({ placeholder, ...modalFormProps }) => {
  return (
    <ModalForm<FilenameFormData>
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      {...modalFormProps}
    >
      <ProFormText name="filename" placeholder={placeholder} />
    </ModalForm>
  );
};

export const CreateFolderFormButton: React.FC<
  ModalFormProps<FilenameFormData> & {
    basePath: string[];
  }
> = ({ basePath, onFinish, ...modalFormProps }) => {
  return (
    <FilenameForm
      title="新建目录"
      placeholder="目录名"
      onFinish={async (formData) => {
        await createSpaceFile({
          type: 'folder',
          path: mergePath(basePath),
          filename: formData.filename,
        });
        if (onFinish) onFinish(formData);
        return true;
      }}
      {...modalFormProps}
    />
  );
};

export const CreateDocumentFormButton: React.FC<
  ModalFormProps<FilenameFormData> & {
    basePath: string[];
  }
> = ({ basePath, onFinish, ...modalFormProps }) => {
  return (
    <FilenameForm
      title="新建文档"
      placeholder="文档名"
      onFinish={async (formData) => {
        await createSpaceFile({
          type: 'document',
          path: mergePath(basePath),
          filename: formData.filename,
        });
        if (onFinish) onFinish(formData);
        return true;
      }}
      {...modalFormProps}
    />
  );
};

export const RenameFileFormButton: React.FC<
  ModalFormProps<FilenameFormData> & {
    basePath: string[];
    oldFilename: string;
  }
> = ({ basePath, oldFilename, onFinish, ...modalFormProps }) => {
  return (
    <FilenameForm
      title="重命名"
      placeholder="文件名"
      initialValues={{ filename: oldFilename }}
      onFinish={async (formData) => {
        await renameSpaceFile({
          path: mergePath([...basePath, oldFilename]),
          newFilename: formData.filename,
        });
        if (onFinish) onFinish(formData);
        return true;
      }}
      {...modalFormProps}
    />
  );
};
