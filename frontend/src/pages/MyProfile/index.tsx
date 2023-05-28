import { PageContainer } from '@ant-design/pro-components';
import { Tabs, TabsProps } from 'antd';
import { BasicProfile } from './BasicProfile';
import { ChangePassword } from './Password';

export default () => {
  const items: TabsProps['items'] = [
    {
      key: 'basic',
      label: '基本信息',
      children: <BasicProfile />,
    },
    {
      key: 'change-password',
      label: '修改密码',
      children: <ChangePassword />,
    },
  ];
  return (
    <PageContainer breadcrumb={undefined}>
      <Tabs items={items} />
    </PageContainer>
  );
};
