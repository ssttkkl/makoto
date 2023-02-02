import { getFileInfo } from '@/services/space';
import { FileInfo } from '@/services/space/entities';
import useRequest from '@ahooksjs/use-request';
import { useState } from 'react';

export default () => {
  const [path, setPath] = useState('');

  const { data, error, loading, refresh } = useRequest(
    async () => {
      const file = await getFileInfo({ path, depth: 1 });
      if (file.children) {
        file.children.sort((a: FileInfo, b: FileInfo) => {
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          } else {
            return a.filename.localeCompare(b.filename);
          }
        });
      }
      return file;
    },
    {
      refreshDeps: [path],
    },
  );

  return { path, setPath, data, error, loading, refresh };
};
