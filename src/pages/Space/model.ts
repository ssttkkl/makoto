import { FileInfo, FolderInfo } from '@/services/files/entities';
import { getSpaceFileInfo } from '@/services/space';
import { FilePath, mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { sortFiles } from '@/utils/sortFiles';
import { useState } from 'react';
import { useUpdater } from '@/utils/hooks';

export interface SpacePageSearchParams {
  path: FilePath;
}

export default () => {
  const [params, updateParams] = useUpdater<SpacePageSearchParams>({
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
      refreshDeps: [params.path],
    },
  );

  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);

  return {
    params,
    updateParams,
    data: data as FolderInfo,
    loading,
    error,
    refresh,
    selectedFiles,
    setSelectedFiles,
  };
};
