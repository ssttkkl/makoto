import { FilePath, mergePath } from '@/utils/path';
import { UserOutlined } from '@ant-design/icons';
import PathBreadcrumb from '../PathBreadcrumb';

export const SpaceBreadcrumb: React.FC<{
  path: FilePath;
}> = ({ path }) => {
  return (
    <PathBreadcrumb
      home={
        <>
          <UserOutlined />
          <span>我的空间</span>
        </>
      }
      path={path}
      itemLink={(p) => `/space?path=${mergePath(p)}`}
    />
  );
};
