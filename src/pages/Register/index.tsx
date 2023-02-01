import { register } from '@/services/users';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText, LoginForm } from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Link, history } from '@umijs/max';
import { message } from 'antd';
import { useCallback } from 'react';

interface RegisterFormRecord {
  username: string;
  password: string;
  nickname: string;
}

const RegisterPage: React.FC = () => {
  const [urlParams] = useSearchParams();
  const redirect = urlParams.get('redirect') ?? '/';

  const onFinish = useCallback(
    async function (values: RegisterFormRecord) {
      await register(values);

      message.success('注册成功');
      history.push(`/login?redirect=${redirect}`, {
        username: values.username,
      });
    },
    [redirect],
  );

  return (
    <div
      style={{
        flex: '1',
        padding: '32px 0',
      }}
    >
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
          to={`/login?redirect=${redirect}`}
          style={{
            float: 'right',
            marginBlockEnd: 24,
          }}
        >
          已有帐号？ 登录
        </Link>
      </LoginForm>
    </div>
  );
};

export default RegisterPage;
