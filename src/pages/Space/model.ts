import { FileInfo, FolderInfo } from '@/services/files/entities';
import { getSpaceFileInfo } from '@/services/space';
import { mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { sortFiles } from '@/utils/sortFiles';
import { useState } from 'react';

export interface SpacePageSearchParams {
  path: string[];
}

export default () => {
  const [params, setParams] = useState<SpacePageSearchParams>({
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

  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);

  return {
    params,
    setParams,
    data: data as FolderInfo,
    loading,
    error,
    refresh,
    selectedFiles,
    setSelectedFiles,
  };
};
