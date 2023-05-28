import {
  ModalForm,
  ModalFormProps,
  ProFormText,
} from '@ant-design/pro-components';

export interface FilenameFormData {
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

export default FilenameForm;
