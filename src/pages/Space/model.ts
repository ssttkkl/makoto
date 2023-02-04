import { FolderInfo } from '@/services/files/entities';
import { getSpaceFileInfo } from '@/services/space';
import { mergePath, splitPath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { sortFiles } from '@/utils/sortFiles';
import { useState } from 'react';

export interface SpacePageSearchParams {
  path: string[];
}

export default () => {
  const [params, originSetParams] = useState<SpacePageSearchParams>({
    path: [],
  });

  const { data, loading, error, refresh } = useRequest(
    async () => {
      const path = mergePath(params.path);
      const file = (await getSpaceFileInfo({ path, depth: 1 })) as FolderInfo;
      if (file.children) {
        sortFiles(file.children);
      }
      return file;
    },
    {
      refreshDeps: [params],
    },
  );

  function setParams(value: URLSearchParams) {
    let path = splitPath(value.get('path') ?? '');
    originSetParams({ path });
  }

  return {
    params,
    setParams,
    data: data as FolderInfo,
    loading,
    error,
    refresh,
  };
};
