import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  ProFormCheckbox,
  ProFormText,
  ProConfigProvider,
  LoginForm,
} from '@ant-design/pro-components';
import { Link } from '@umijs/max';

async function onFinish(formData: Record<string, any>) {
  console.log(formData);
  return true;
}

const LoginPage: React.FC = () => {
  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm title="登录" subTitle=" " onFinish={onFinish}>
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
