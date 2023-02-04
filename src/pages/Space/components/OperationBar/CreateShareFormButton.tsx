import { FileInfo, FilePermissionEnum } from '@/services/files/entities';
import { createShare } from '@/services/share';
import { mergePath } from '@/utils/path';
import { ShareAltOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import {
  Button,
  ButtonProps,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
} from 'antd';

interface CreateShareFormData {
  name: string;
  expiresIn: string;
  permission: FilePermissionEnum;
  allowLink: boolean;
  customExpirationDays: number;
}

const CreateShareFormButton: React.FC<{
  path: string[];
  files: FileInfo[];
  onFinish?: () => Promise<void>;
  btnProps?: ButtonProps;
}> = (props) => {
  const [form] = Form.useForm<CreateShareFormData>();

  const triggerBtn = (
    <Button icon={<ShareAltOutlined />} {...props.btnProps}>
      分享
    </Button>
  );

  const onFinish = async (values: CreateShareFormData) => {
    // 转换为毫秒
    let expiresIn = 0;
    if (values.expiresIn === 'custom') {
      expiresIn = values.customExpirationDays * 86400000;
    } else {
      expiresIn = Number.parseInt(values.expiresIn.slice(0, -1)) * 86400000;
    }

    const share = await createShare({
      name: values.name,
      filePath: props.files.map((value) =>
        mergePath([...props.path, value.filename]),
      ),
      permission: values.permission,
      expiresIn,
      allowLink: values.allowLink,
    });

    // TODO
    const shareLink = `http://localhost:8000/share?shareId=${share.shareId}`;

    Modal.success({
      title: '分享成功',
      content: <a href={shareLink}>{shareLink}</a>,
    });

    if (props.onFinish) {
      await props.onFinish();
    }
    return true;
  };

  return (
    <ModalForm<CreateShareFormData>
      title="创建分享"
      form={form}
      trigger={triggerBtn}
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="分享名"
        initialValue={props.files[0].filename}
      >
        <Input />
      </Form.Item>

      <Form.Item name="expiresIn" label="过期时间" initialValue="1d">
        <Radio.Group>
          <Radio value="1d">1天</Radio>
          <Radio value="7d">7天</Radio>
          <Radio value="30d">30天</Radio>
          <Radio value="custom" {...props}>
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

export default CreateShareFormButton;
