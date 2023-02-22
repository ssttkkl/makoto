import { FileInfo } from '@/services/files/entities';
import { createSpaceLink } from '@/services/space';
import { mergePath } from '@/utils/path';
import { useModel } from '@umijs/max';
import { Button, ButtonProps, message } from 'antd';

const LinkButton: React.FC<ButtonProps> = (props) => {
  const model = useModel('Share.model');

  async function onClick() {
    if (model.share === undefined || model.files === undefined) {
      return;
    }

    const linkFiles: FileInfo[] =
      model.selectedFiles.length === 0 ? model.files : model.selectedFiles;

    await createSpaceLink({
      basePath: '/',
      shareId: model.share.shareId,
      links: linkFiles.map((x) => {
        return { filename: x.filename, refPath: mergePath(model.params.path) };
      }),
    });
    message.success('成功链接文件到我的空间');
  }

  return (
    <Button onClick={onClick} {...props}>
      {model.selectedFiles.length === 0 ? '链接所有文件' : '链接选中文件'}
    </Button>
  );
};

export default LinkButton;
