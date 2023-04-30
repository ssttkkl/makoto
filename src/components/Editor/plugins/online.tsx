import { onStatusParameters, WebSocketStatus } from '@hocuspocus/provider';
import { Badge } from 'antd';
import Button from 'antd/es/button';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from '..';
import { EditorPlugin } from './base';
import { ToolbarItem } from './types';

const OnlineStatus: React.FC = () => {
  const { provider } = useContext(EditorContext);
  const [status, setStatus] = useState(WebSocketStatus.Disconnected);

  const statusListener = ({ status: s }: onStatusParameters) => {
    setStatus(s);
  };

  useEffect(() => {
    provider.on('status', statusListener);
    return () => {
      provider.off('status', statusListener);
    };
  }, [provider]);

  const badge = () => {
    switch (status) {
      case WebSocketStatus.Connected:
        return <Badge status="success" text="在线" />;
      case WebSocketStatus.Connecting:
        return <Badge status="processing" text="连接中" />;
      case WebSocketStatus.Disconnected:
        return <Badge status="error" text="离线" />;
      default:
        return null;
    }
  };

  return (
    <Button
      type="text"
      onClick={async () => {
        if (status === WebSocketStatus.Disconnected) {
          await provider.connect();
        }
      }}
    >
      {badge()}
    </Button>
  );
};

export class OnlinePlugin extends EditorPlugin {
  key = 'online';
  toolbarItem: ToolbarItem = {
    title: '在线状态',
    renderReadonly: () => <OnlineStatus />,
    renderWriteable: () => <OnlineStatus />,
  };
}
