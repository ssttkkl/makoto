import { saveAsDocx } from '@/components/Editor/plugins/save/docx';
import FileInfoDescription from '@/components/FileInfoDescription';
import {
  InfoCircleOutlined,
  MenuOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { MenuProps, Dropdown, App } from 'antd';
import Button from 'antd/es/button';
import { useCallback } from 'react';
import { useSlate } from 'slate-react';

export const DocMenu: React.FC = () => {
  const { modal } = App.useApp();
  const { file } = useModel('Doc.model', (model) => ({
    file: model.file,
  }));

  const editor = useSlate();
  const items: MenuProps['items'] = [
    {
      key: 'save-docx',
      label: '保存为DOCX文档',
      icon: <SaveOutlined />,
    },
    {
      key: 'file-info',
      label: '文件信息',
      icon: <InfoCircleOutlined />,
    },
  ];

  const onClick: MenuProps['onClick'] = useCallback(
    async ({ key }) => {
      switch (key) {
        case 'save-docx':
          await saveAsDocx(file?.filename, editor.children);
          break;
        case 'file-info':
          modal.info({
            title: '文件信息',
            content: <FileInfoDescription file={file} />,
          });
          break;
      }
    },
    [editor],
  );

  return (
    <Dropdown menu={{ items, onClick }}>
      <Button>
        <MenuOutlined />
      </Button>
    </Dropdown>
  );
};
