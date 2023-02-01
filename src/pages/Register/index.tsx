import { register } from '@/services/users';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  ProFormText,
  ProConfigProvider,
  LoginForm,
  ProFormInstance,
} from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { message } from 'antd';
import { useRef } from 'react';

const RegisterPage: React.FC = () => {
  const formRef = useRef<
    ProFormInstance<{
      username: string;
      nickname: string;
      password: string;
      passwordRepeated: string;
    }>
  >();

  async function onFinish(values: any) {
    try {
      await register({
        username: values.username,
        password: values.password,
        nickname: values.nickname,
      });
      message.success('注册成功');
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('发送请求时出了点问题');
      }
    }
  }

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          title="注册"
          subTitle=" "
          submitter={{
            // 配置按钮文本
            searchConfig: {
              resetText: '重置',
              submitText: '注册',
            },
          }}
          onFinish={onFinish}
          formRef={formRef}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'用户名'}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText
            name="nickname"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'昵称'}
            rules={[
              {
                required: true,
                message: '请输入昵称!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <ProFormText.Password
            name="passwordRepeated"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'确认密码'}
            rules={[
              {
                required: true,
                message: '请确认密码！',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          />
          <Link
            to="/login"
            style={{
              float: 'right',
              marginBlockEnd: 24,
            }}
          >
            已有帐号？ 登录
          </Link>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default RegisterPage;
