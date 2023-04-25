import SpaceTree from '@/components/SpaceTree';
import { FileInfo } from '@/services/files/entities';
import { copySpaceFile, moveSpaceFile } from '@/services/space';
import { FilePath, mergePath } from '@/utils/path';
import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import { Form } from 'antd';

interface SpaceTreeFormData {
  path: FilePath;
}

const SpaceTreeWrapper: React.FC<{
  value?: FilePath;
  onChange?: (value: FilePath) => void;
}> = ({ value, onChange }) => {
  return (
    <SpaceTree
      selectedPath={value}
      onSelect={(path) => {
        if (onChange) onChange(path);
      }}
    />
  );
};

const SpaceTreeForm: React.FC<ModalFormProps<SpaceTreeFormData>> = (props) => {
  return (
    <ModalForm<SpaceTreeFormData>
      modalProps={{ destroyOnClose: true }}
      {...props}
    >
      <Form.Item name="path">
        <SpaceTreeWrapper />
      </Form.Item>
    </ModalForm>
  );
};

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
