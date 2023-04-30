import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { useCallback } from 'react';
import { useSlate } from 'slate-react';
import { EditorPlugin } from '../base';
import { ToolbarItem } from '../types';
import { saveAsDocx } from './docx';

const FileMenu: React.FC = () => {
  const editor = useSlate();
  const items: MenuProps['items'] = [
    {
      key: 'save-docx',
      label: '导出为DOCX文档',
    },
  ];
  const onClick: MenuProps['onClick'] = useCallback(
    async ({ key }) => {
      switch (key) {
        case 'save-docx':
          await saveAsDocx(editor.children);
      }
    },
    [editor],
  );

  return (
    <Dropdown menu={{ items, onClick }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          文件
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export class FilePlugin extends EditorPlugin {
  key: string = 'file';
  toolbarItem: ToolbarItem = {
    title: '文件',
    renderReadonly: () => <FileMenu />,
    renderWriteable: () => <FileMenu />,
  };
}
