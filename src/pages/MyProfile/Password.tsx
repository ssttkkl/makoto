import { updatePassword } from '@/services/users';
import { useModel } from '@umijs/max';
import { App, Button, Form, Input } from 'antd';

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  newPassword2: string;
}

export const ChangePassword: React.FC = () => {
  const { message } = App.useApp();
  const { logout } = useModel('currentUser');

  const onFinish = async ({
    oldPassword,
    newPassword,
  }: ChangePasswordFormData) => {
    await updatePassword({ oldPassword, newPassword });
    message.success('修改成功，请重新登录');
    await logout();
  };

  return (
    <Form
      name="change-password"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="oldPassword"
        label="旧密码"
        rules={[
          {
            required: true,
            message: '请输入旧密码！',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[
          {
            required: true,
            message: '请输入新密码！',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword2"
        label="确认新密码"
        rules={[
          {
            required: true,
            message: '请确认新密码！',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          修改
        </Button>
      </Form.Item>
    </Form>
  );
};
