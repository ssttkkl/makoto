import { FileInfo, FilePermissionEnum } from '@/services/files/entities';
import { createShare } from '@/services/share';
import { mergePath } from '@/utils/path';
import { absolutePath } from '@/utils/url';
import { ModalForm, ModalFormProps } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { App, Form, Input, InputNumber, Radio } from 'antd';

interface CreateShareFormData {
  title: string;
  expiresIn: string;
  permission: FilePermissionEnum;
  allowLink: boolean;
  customExpirationDays: number;
}

const CreateShareForm: React.FC<
  ModalFormProps<CreateShareFormData> & {
    path: string[];
    files: FileInfo[];
    onFinish?: () => Promise<boolean>;
  }
> = ({ path, files, onFinish: _onFinish, ...modalFormProps }) => {
  const { modal } = App.useApp();

  const onFinish = async (values: CreateShareFormData) => {
    // 转换为毫秒
    let expiresIn = 0;
    if (values.expiresIn === 'custom') {
      expiresIn = values.customExpirationDays * 86400000;
    } else {
      expiresIn = Number.parseInt(values.expiresIn.slice(0, -1)) * 86400000;
    }

    const share = await createShare({
      title: values.title,
      filePath: files.map((value) => mergePath([...path, value.filename])),
      permission: values.permission,
      expiresIn,
      allowLink: values.allowLink,
    });

    const url = absolutePath(`/share/${share.shareId}`);
    console.log(url);

    modal.success({
      title: '分享成功',
      content: (
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    });

    if (_onFinish) {
      return await _onFinish();
    } else {
      return true;
    }
  };

  return (
    <ModalForm<CreateShareFormData>
      title="创建分享"
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      onFinish={onFinish}
      {...modalFormProps}
    >
      <Form.Item name="title" label="分享标题" initialValue={files[0].filename}>
        <Input />
      </Form.Item>

      <Form.Item name="expiresIn" label="过期时间" initialValue="1d">
        <Radio.Group>
          <Radio value="1d">1天</Radio>
          <Radio value="7d">7天</Radio>
          <Radio value="30d">30天</Radio>
          <Radio value="custom">
            <Form.Item name="customExpirationDays" noStyle>
              <InputNumber
                size="small"
                placeholder="自定义"
                min={1}
                max={9999}
                style={{ maxWidth: '8em' }}
              />
            </Form.Item>
            <span style={{ padding: '0 0 0 8px' }}>天</span>
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="permission"
        label="权限"
        initialValue={FilePermissionEnum.R}
      >
        <Radio.Group>
          <Radio.Button value={FilePermissionEnum.R}>只读</Radio.Button>
          <Radio.Button value={FilePermissionEnum.RW}>可读写</Radio.Button>
          <Radio.Button value={FilePermissionEnum.RWX}>
            可读写、可再次分享
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="allowLink"
        label="允许链接到个人空间"
        initialValue={false}
      >
        <Radio.Group>
          <Radio.Button value={true}>是</Radio.Button>
          <Radio.Button value={false}>否</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </ModalForm>
  );
};

export default CreateShareForm;
