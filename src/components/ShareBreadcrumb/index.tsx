import { FilePath, mergePath } from '@/utils/path';
import { ShareAltOutlined } from '@ant-design/icons';
import PathBreadcrumb from '../PathBreadcrumb';

export const ShareBreadcrumb: React.FC<{
  shareId: number;
  path: FilePath;
}> = ({ shareId, path }) => {
  return (
    <PathBreadcrumb
      home={
        <>
          <ShareAltOutlined />
          <span>分享</span>
        </>
      }
      path={path}
      itemLink={(p) => `/share?shareId=${shareId}&path=${mergePath(p)}`}
    />
  );
};
