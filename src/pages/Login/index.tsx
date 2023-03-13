import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText, LoginForm } from '@ant-design/pro-components';
import { useLocation, useSearchParams } from '@umijs/max';
import { Link, useModel, history } from '@umijs/max';
import { Form, message } from 'antd';
import { useCallback } from 'react';

interface LoginFormRecord {
  username: string;
  password: string;
  autoLogin: boolean;
}

const LoginPage: React.FC = () => {
  const { currentUser, login } = useModel('currentUser');

  const [urlParams] = useSearchParams();
  const redirect = urlParams.get('redirect') ?? '/';

  const loc = useLocation();
  const username = loc.state?.username ?? '';

  const onFinish = useCallback(
    async function (values: LoginFormRecord) {
      await login(values.username, values.password);
      message.success('登录成功!');

      history.push(redirect);
    },
    [redirect],
  );

  if (currentUser) {
    history.push(redirect);
  }

  return (
    <div
      style={{
        flex: '1',
        padding: '32px 0',
      }}
    >
      <LoginForm
        contentStyle={{
          minWidth: 280,
          maxWidth: '75vw',
        }}
        title="登录"
        subTitle=" "
        onFinish={onFinish}
        initialValues={{ username }}
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

        <Form.Item>
          <Link
            to={`/register?redirect=${redirect}`}
            style={{
              float: 'right',
            }}
          >
            注册
          </Link>
        </Form.Item>
      </LoginForm>
    </div>
  );
};

export default LoginPage;
