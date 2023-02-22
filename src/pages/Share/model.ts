import { FileInfo, FolderInfo } from '@/services/files/entities';
import { getShareFileInfo, getShareInfo } from '@/services/share';
import { Share } from '@/services/share/entities';
import { mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { sortFiles } from '@/utils/sortFiles';
import { useState } from 'react';

export interface SharePageSearchParams {
  shareId?: number;
  path: string[];
}

export default () => {
  const [params, setParams] = useState<SharePageSearchParams>({
    path: [],
  });

  const share = useRequest(
    async () => {
      if (params.shareId === undefined) {
        return undefined;
      }

      return await getShareInfo({ shareId: params.shareId });
    },
    {
      refreshDeps: [params.shareId],
    },
  );

  const files = useRequest(
    async () => {
      if (share.data === undefined) {
        return undefined;
      }

      if (params.path.length === 0) {
        sortFiles(share.data.files);
        return share.data.files;
      } else {
        const parent = (await getShareFileInfo({
          shareId: share.data.shareId,
          path: mergePath(params.path),
          depth: 1,
        })) as FolderInfo;
        sortFiles(parent.children as FileInfo[]);
        return parent.children;
      }
    },
    {
      refreshDeps: [share.data, params.path],
    },
  );

  const loading = share.loading || files.loading;
  const error = share.error ?? files.error;

  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);

  return {
    params,
    setParams,
    share: share.data as Share | undefined,
    files: files.data as FileInfo[] | undefined,
    refresh: share.refresh,
    loading,
    error,
    selectedFiles,
    setSelectedFiles,
  };
};
