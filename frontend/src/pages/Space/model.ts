import { FileInfo, FolderInfo, LinkInfo } from '@/services/files/entities';
import { getSpaceFileInfo } from '@/services/space';
import { FilePath, mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { sortFiles } from '@/utils/file';
import { useEffect, useState } from 'react';
import { useUpdater } from '@/utils/hooks';

export interface SpacePageSearchParams {
  path: FilePath;
}

export default () => {
  const [params, updateParams, initialized] = useUpdater<SpacePageSearchParams>(
    {
      path: [],
    },
  );

  const {
    data: file,
    loading,
    error,
    refresh,
  } = useRequest(
    async () => {
      if (!initialized) {
        return undefined;
      }

      const path = mergePath(params.path);
      const file = await getSpaceFileInfo({ path, depth: 1 });
      return file;
    },
    {
      refreshDeps: [initialized, params.path],
    },
  );

  const unrefFile: FolderInfo | null =
    file instanceof LinkInfo ? file.ref : file;

  useEffect(() => {
    if (unrefFile?.children) {
      sortFiles(unrefFile.children);
    }
  }, [unrefFile]);

  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  useEffect(() => setSelectedFiles([]), [params.path]);

  return {
    initialized,
    params,
    updateParams,
    file: file as FolderInfo,
    unrefFile,
    loading,
    error,
    refresh,
    selectedFiles,
    setSelectedFiles,
  };
};
