import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useLocation, useModel } from '@umijs/max';
import { Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import { UserAvatarWithNickname } from '../UserAvatar';

const menuItems = [
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '个人设置',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

const AvatarDropdown: React.FC = () => {
  const { currentUser, loading, logout } = useModel('currentUser');

  const loc = useLocation();

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = useCallback(async () => {
    await logout();
    history.push('/login?redirect=' + loc.pathname);
  }, [loc]);

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

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
        return;
      }
    },
    [loginOut],
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
  } else {
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
  }
};

export default AvatarDropdown;
