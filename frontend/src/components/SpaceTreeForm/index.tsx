import SpaceTree from '@/components/SpaceTree';
import { FilePath } from '@/utils/path';
import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import { Form } from 'antd';

export interface SpaceTreeFormData {
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

export default SpaceTreeForm;
