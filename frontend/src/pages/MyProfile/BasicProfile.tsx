import { updateMyProfile } from '@/services/users';
import { useModel } from '@umijs/max';
import { App, Button, Form, Input } from 'antd';
import { useEffect } from 'react';

interface BasicProfileFormData {
  nickname: string;
}

export const BasicProfile: React.FC = () => {
  const { message } = App.useApp();
  const { currentUser, refresh } = useModel('currentUser');
  const [form] = Form.useForm<BasicProfileFormData>();

  useEffect(() => {
    form.setFieldValue('nickname', currentUser?.nickname);
  }, [currentUser]);

  const onFinish = async (values: BasicProfileFormData) => {
    await updateMyProfile(values);
    message.success('保存成功');
    await refresh();
  };

  return (
    <Form
      name="basic-profile"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
    >
      <Form.Item label="用户名">
        <span>{currentUser?.username}</span>
      </Form.Item>

      <Form.Item
        name="nickname"
        label="昵称"
        rules={[
          {
            required: true,
            message: '请输入昵称！',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};
