import { LogoutOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel } from '@umijs/max';
import { Spin } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import HeaderDropdown from '@/components/HeaderDropdown';
import { UserAvatarWithNickname } from '@/components/UserAvatar';
import { logout } from '@/services/auth';

const menuItems = [
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

const AvatarDropdown: React.FC = () => {
  const { currentUser } = useModel('currentUser');

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
        logout();
        return;
      }
    },
    [logout],
  );

  if (!currentUser) {
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
