import { getFileInfo } from '@/services/space';
import useRequest from '@ahooksjs/use-request';
import { useState } from 'react';

export default () => {
  const [path, setPath] = useState('');

  const { data, error, loading } = useRequest(
    () => {
      return getFileInfo({ path, depth: 1 });
    },
    {
      refreshDeps: [path],
    },
  );

  return { path, setPath, data, error, loading };
};
