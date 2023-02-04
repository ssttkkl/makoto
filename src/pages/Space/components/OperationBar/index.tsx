import { FileInfo } from '@/services/files/entities';
import { Button, Space } from 'antd';
import {
  CreateDocumentFormButton,
  CreateFolderFormButton,
} from './CreateFileFormButton';
import CreateShareFormButton from './CreateShareFormButton';

const OperationBar: React.FC<{
  path: string[];
  selectedFiles: FileInfo[];
  refresh: () => Promise<void>;
}> = (props) => {
  const btn: React.ReactNode[] = [];
  if (props.selectedFiles.length !== 0) {
    btn.push(
      <CreateShareFormButton
        key="share"
        path={props.path}
        files={props.selectedFiles}
        btnProps={{ type: 'primary' }}
      />,
    );
    btn.push(<Button>复制</Button>);
    btn.push(<Button>移动</Button>);
    btn.push(<Button danger>删除</Button>);

    if (props.selectedFiles.length === 1) {
      btn.push(<Button>重命名</Button>);
    }
  } else {
    btn.push(
      <CreateDocumentFormButton
        key="create-document"
        basePath={props.path}
        btnProps={{ type: 'primary' }}
        onFinish={props.refresh}
      />,
    );

    btn.push(
      <CreateFolderFormButton
        key="create-folder"
        basePath={props.path}
        onFinish={props.refresh}
      />,
    );
  }

  return <Space wrap>{btn}</Space>;
};

export default OperationBar;
