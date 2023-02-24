import { MoreOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Link } from '@umijs/max';
import { Button, Popover } from 'antd';
import { ReactNode } from 'react';

const TableMainColumnCell: React.FC<{
  children?: ReactNode;
  href?: string;
  addon?: ReactNode;
  collapseAddon?: boolean;
  hideAddon?: boolean;
}> = ({ children, href, addon, collapseAddon, hideAddon }) => {
  const addonClassname = useEmotionCss(() => ({
    display: 'inline',
    float: 'right',
  }));

  const hiddenClassname = useEmotionCss(() => ({
    visibility: 'hidden',
  }));

  return (
    <>
      {href ? <Link to={href}>{children}</Link> : children}
      {addon ? (
        <div
          className={
            addonClassname + ' ' + (hideAddon === true ? hiddenClassname : '')
          }
        >
          {collapseAddon === true ? (
            <Popover content={addon}>
              <Button type="text" size="small" icon={<MoreOutlined />} />
            </Popover>
          ) : (
            addon
          )}
        </div>
      ) : null}
    </>
  );
};

export default TableMainColumnCell;
