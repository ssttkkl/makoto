import {
  ModalForm,
  ModalFormProps,
  ProFormText,
} from '@ant-design/pro-components';
import { mergePath } from '@/utils/path';
import { createSpaceFile } from '@/services/space';

interface CreateFileFormData {
  filename: string;
}

const CreateFileForm: React.FC<
  ModalFormProps<CreateFileFormData> & {
    placeholder: string;
  }
> = ({ placeholder, ...modalFormProps }) => {
  return (
    <ModalForm<CreateFileFormData>
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      {...modalFormProps}
    >
      <ProFormText name="filename" placeholder={placeholder} />
    </ModalForm>
  );
};

export const CreateFolderFormButton: React.FC<
  ModalFormProps<CreateFileFormData> & {
    basePath: string[];
  }
> = ({ basePath, onFinish, ...modalFormProps }) => {
  return (
    <CreateFileForm
      title="新建目录"
      placeholder="目录名"
      onFinish={async (formData) => {
        await createSpaceFile({
          type: 'folder',
          basePath: mergePath(basePath),
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
  ModalFormProps<CreateFileFormData> & {
    basePath: string[];
  }
> = ({ basePath, onFinish, ...modalFormProps }) => {
  return (
    <CreateFileForm
      title="新建文档"
      placeholder="文档名"
      onFinish={async (formData) => {
        await createSpaceFile({
          type: 'document',
          basePath: mergePath(basePath),
          filename: formData.filename,
        });
        if (onFinish) onFinish(formData);
        return true;
      }}
      {...modalFormProps}
    />
  );
};
