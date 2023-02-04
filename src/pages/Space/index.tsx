import FileTable from '@/components/FileTable';
import { useModel, useSearchParams } from '@umijs/max';
import { Button, ButtonProps, Space, Spin } from 'antd';
import { useEffect } from 'react';
import PathBreadcrumb from '@/components/PathBreadcrumb';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { UserOutlined } from '@ant-design/icons';
import { mergePath } from '@/utils/path';
import { createSpaceFile } from '@/services/space';

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
  basePath: string[];
  onFinish?: () => void;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <CreateFile
      title="新建目录"
      placeholder="目录名"
      btnProps={props.btnProps}
      onFinish={async (filename) => {
        await createSpaceFile({
          type: 'folder',
          basePath: mergePath(props.basePath),
          filename,
        });
        if (props?.onFinish) props.onFinish();
        return true;
      }}
    />
  );
};

const CreateDocument: React.FC<{
  basePath: string[];
  onFinish?: () => void;
  btnProps?: ButtonProps;
}> = (props) => {
  return (
    <CreateFile
      title="新建文档"
      placeholder="文档名"
      btnProps={props.btnProps}
      onFinish={async (filename) => {
        await createSpaceFile({
          type: 'document',
          basePath: mergePath(props.basePath),
          filename,
        });
        if (props?.onFinish) props.onFinish();
        return true;
      }}
    />
  );
};

const SpacePage: React.FC = () => {
  const { params, setParams, data, error, loading, refresh } =
    useModel('Space.model');

  // 将参数单向同步到model里
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setParams(searchParams);
  }, [searchParams]);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <PathBreadcrumb
          home={
            <>
              <UserOutlined />
              <span>我的空间</span>
            </>
          }
          path={params.path}
          itemLink={(path) => `/space?path=${mergePath(path)}`}
        />

        <Space wrap>
          <CreateDocument
            basePath={params?.path}
            btnProps={{ type: 'primary' }}
            onFinish={refresh}
          />
          <CreateFolder basePath={params?.path} onFinish={refresh} />
        </Space>

        <FileTable
          dataSource={data?.children}
          pagination={false}
          recordLink={(record) =>
            `/space?path=${mergePath([...params.path, record.filename])}`
          }
        />
      </Space>
    </Spin>
  );
};

export default SpacePage;
