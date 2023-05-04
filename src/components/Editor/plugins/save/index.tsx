import { SaveOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { useCallback } from 'react';
import { useSlate } from 'slate-react';
import { EditorPlugin } from '../base';
import { ToolbarItem } from '../types';
import { saveAsDocx } from './docx';

const SaveMenu: React.FC = () => {
  const editor = useSlate();
  const items: MenuProps['items'] = [
    {
      key: 'save-docx',
      label: '保存为DOCX文档',
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
          <SaveOutlined />
          保存为
        </Space>
      </a>
    </Dropdown>
  );
};

export class SavePlugin extends EditorPlugin {
  key: string = 'save';
  toolbarItem: ToolbarItem = {
    title: '保存为',
    renderReadonly: () => <SaveMenu />,
    renderWriteable: () => <SaveMenu />,
  };
}
