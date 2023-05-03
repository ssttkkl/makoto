import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useLocation, useModel } from '@umijs/max';
import { App, MenuProps, Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useContext } from 'react';
import HeaderDropdown from '@/components/HeaderDropdown';
import { UserAvatar, UserAvatarWithNickname } from '@/components/UserAvatar';
import { logout } from '@/services/auth';
import { Link } from '@umijs/max';
import { RouteContext } from '@ant-design/pro-components';
import Tooltip from 'antd/es/tooltip';

const AvatarDropdown: React.FC = () => {
  const { message } = App.useApp();
  const { currentUser, loading } = useModel('currentUser');
  const loc = useLocation();
  const { collapsed, isMobile } = useContext(RouteContext);

  const mini = !isMobile && collapsed;

  const actionClassName = useEmotionCss(({ token }) => ({
    display: 'flex',
    width: '120px',
    height: '48px',
    marginLeft: 'auto',
    overflow: 'hidden',
    alignItems: 'center',
    padding: [0, token.paddingXS],
    cursor: 'pointer',
    borderRadius: token.borderRadius,
  }));

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

  const menuItems: MenuProps['items'] = [
    {
      key: 'currentUser',
      icon: <UserOutlined />,
      label: currentUser?.nickname,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

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
          {mini ? (
            <UserAvatar user={currentUser} size="small" tooltip={false} />
          ) : (
            <UserAvatarWithNickname user={currentUser} />
          )}
        </span>
      </HeaderDropdown>
    );
  } else {
    return (
      <Link to={`/login?redirect=` + loc.pathname} className={actionClassName}>
        {mini ? (
          <Tooltip title="登录">
            <UserOutlined />
          </Tooltip>
        ) : (
          <>
            <UserOutlined />
            <span className={paddingLeftClassName}>登录</span>
          </>
        )}
      </Link>
    );
  }
};

export default AvatarDropdown;
