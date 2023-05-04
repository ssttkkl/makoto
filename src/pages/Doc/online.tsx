import { onStatusParameters, WebSocketStatus } from '@hocuspocus/provider';
import { Badge } from 'antd';
import Button from 'antd/es/button';
import { useContext, useEffect, useState } from 'react';
import { EditorContext } from '../../components/Editor';

export const OnlineStatus: React.FC = () => {
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
      case WebSocketStatus.Connecting:
        return <Badge status="processing" text="连接中" />;
      case WebSocketStatus.Disconnected:
        return <Badge status="error" text="已断开连接" />;
      default:
        return null;
    }
  };

  return status !== WebSocketStatus.Connected ? (
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
  ) : null;
};
