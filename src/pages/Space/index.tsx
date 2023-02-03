import FileTable from '@/components/FileTable';
import { useModel, useSearchParams } from '@umijs/max';
import { Button, ButtonProps, Space, Spin } from 'antd';
import { useEffect } from 'react';
import PathBreadcrumb from '@/components/PathBreadcrumb';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { createFile } from '@/services/files';

const CreateFile: React.FC<{
  title: string;
  placeholder: string;
  onFinish: (filename: string) => Promise<boolean>;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <ModalForm<{ filename: string }>
      title={props.title}
      trigger={<Button {...props.btnProps}>{props.title}</Button>}
      autoFocusFirstInput
      modalProps={{ destroyOnClose: true }}
      onFinish={(values) => props.onFinish(values.filename)}
    >
      <ProFormText name="filename" placeholder={props.placeholder} />
    </ModalForm>
  );
};

const CreateFolder: React.FC<{
  parentFid?: number;
  onFinish?: () => void;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <CreateFile
      title="新建目录"
      placeholder="目录名"
      btnProps={{
        ...props.btnProps,
        disabled:
          props.parentFid === undefined ? true : props.btnProps?.disabled,
      }}
      onFinish={async (filename) => {
        await createFile({
          type: 'folder',
          parentFid: props.parentFid,
          filename,
        });
        if (props?.onFinish) props.onFinish();
        return true;
      }}
    />
  );
};

const CreateDocument: React.FC<{
  parentFid?: number;
  onFinish?: () => void;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <CreateFile
      title="新建文档"
      placeholder="文档名"
      btnProps={props.btnProps}
      onFinish={async (filename) => {
        await createFile({
          type: 'document',
          parentFid: props.parentFid,
          filename,
        });
        if (props?.onFinish) props.onFinish();
        return true;
      }}
    />
  );
};

const SpacePage: React.FC = () => {
  const { setPath, data, error, loading, refresh } = useModel('Space.model');

  // 让参数的path单向同步到model里
  const [searchParams] = useSearchParams();
  let path = searchParams.get('path') ?? '';
  path = path === '/' ? '' : path;
  useEffect(() => setPath(path), [path]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Spin spinning={loading}>
      <div>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <PathBreadcrumb
            path={path}
            itemLink={(path) => `/space?path=${path}`}
          />

          <Space wrap>
            <CreateDocument
              parentFid={data?.fid}
              btnProps={{ type: 'primary' }}
              onFinish={refresh}
            />
            <CreateFolder parentFid={data?.fid} onFinish={refresh} />
          </Space>

          <FileTable
            dataSource={data?.children}
            pagination={false}
            recordLink={(record) => `/space?path=${path}/${record.filename}`}
          />
        </Space>
      </div>
    </Spin>
  );
};

export default SpacePage;
