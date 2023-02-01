import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  ProFormCheckbox,
  ProFormText,
  ProConfigProvider,
  LoginForm,
  ProFormInstance,
} from '@ant-design/pro-components';
import { useSearchParams } from '@umijs/max';
import { Link, useLocation, useModel, history } from '@umijs/max';
import { message } from 'antd';
import { useRef } from 'react';

interface LoginFormRecord {
  username: string;
  password: string;
  autoLogin: boolean;
}

const LoginPage: React.FC = () => {
  const formRef = useRef<ProFormInstance<LoginFormRecord>>();

  const { login } = useModel('currentUser');

  const [urlParams] = useSearchParams();
  const redirect = urlParams.get('redirect') ?? '/';

  async function onFinish(values: LoginFormRecord) {
    await login(values.username, values.password);
    message.success('登录成功!');

    history.push(redirect);
  }

  let initialValues: any = {};
  const location = useLocation();
  if (location.state) {
    initialValues = location.state;
    console.debug('initialValues:', initialValues);
  }

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          title="登录"
          subTitle=" "
          onFinish={onFinish}
          formRef={formRef}
        >
          <ProFormText
            name="username"
            initialValue={initialValues.username ?? ''}
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

          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <Link
              to="/register"
              style={{
                float: 'right',
              }}
            >
              注册
            </Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default LoginPage;
