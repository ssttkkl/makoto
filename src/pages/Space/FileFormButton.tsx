import SpaceTreeForm, { SpaceTreeFormData } from '@/components/SpaceTreeForm';
import { FileInfo } from '@/services/files/entities';
import { copySpaceFile, moveSpaceFile } from '@/services/space';
import { FilePath, mergePath } from '@/utils/path';
import { ModalFormProps } from '@ant-design/pro-components';

export const CopyFileFormButton: React.FC<
  ModalFormProps<SpaceTreeFormData> & {
    basePath: FilePath;
    files: FileInfo[];
  }
> = ({ basePath, files, onFinish, ...modalFormProps }) => {
  return (
    <SpaceTreeForm
      title="复制文件"
      initialValues={{ path: basePath }}
      onFinish={async (formData) => {
        for (const file of files) {
          await copySpaceFile({
            path: mergePath([...basePath, file.filename]),
            destPath: mergePath(formData.path),
          });
        }
        if (onFinish) {
          return onFinish(formData);
        } else {
          return true;
        }
      }}
      {...modalFormProps}
    />
  );
};

export const MoveFileFormButton: React.FC<
  ModalFormProps<SpaceTreeFormData> & {
    basePath: FilePath;
    files: FileInfo[];
  }
> = ({ basePath, files, onFinish, ...modalFormProps }) => {
  return (
    <SpaceTreeForm
      title="移动文件"
      initialValues={{ path: basePath }}
      onFinish={async (formData) => {
        for (const file of files) {
          await moveSpaceFile({
            path: mergePath([...basePath, file.filename]),
            destPath: mergePath(formData.path),
          });
        }
        if (onFinish) {
          return onFinish(formData);
        } else {
          return true;
        }
      }}
      {...modalFormProps}
    />
  );
};
