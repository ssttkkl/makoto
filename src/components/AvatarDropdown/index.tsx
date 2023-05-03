import { LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useLocation, useModel } from '@umijs/max';
import { App, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import HeaderDropdown from '@/components/HeaderDropdown';
import { UserAvatarWithNickname } from '@/components/UserAvatar';
import { logout } from '@/services/auth';
import { Link } from '@umijs/max';

const menuItems = [
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

const AvatarDropdown: React.FC = () => {
  const { message } = App.useApp();
  const { currentUser, isLoggedIn, loading } = useModel('currentUser');
  const loc = useLocation();

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      width: '120px',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const paddingLeftClassName = useEmotionCss(({ token }) => ({
    paddingInlineStart: token.paddingXS,
  }));

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        logout({ redirectToLoginPage: true });
        message.success('退出登录成功');
        return;
      }
    },
    [logout],
  );

  if (loading) {
    return (
      <span className={actionClassName}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  } else if (currentUser) {
    return (
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        <span className={actionClassName}>
          <UserAvatarWithNickname user={currentUser} />
        </span>
      </HeaderDropdown>
    );
  } else {
    return (
      <Link to={`/login?redirect=` + loc.pathname} className={actionClassName}>
        <UserOutlined />
        <span className={paddingLeftClassName}>登录</span>
      </Link>
    );
  }
};

export default AvatarDropdown;
