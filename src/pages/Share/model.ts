import { FileInfo, FolderInfo } from '@/services/files/entities';
import {
  getShareFileInfo,
  getShareInfo,
  putShareAccessRecord,
} from '@/services/share';
import { Share } from '@/services/share/entities';
import { useUpdater } from '@/utils/hooks';
import { mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { sortFiles } from '@/utils/file';
import { useState } from 'react';

export interface SharePageSearchParams {
  shareId: number;
  path: string[];
}

export default () => {
  const [params, updateParams, initialized] = useUpdater<SharePageSearchParams>(
    {
      shareId: 0,
      path: [],
    },
  );

  const share = useRequest(
    async () => {
      if (!initialized) {
        return undefined;
      }

      const result = await getShareInfo({ shareId: params.shareId });
      await putShareAccessRecord({ shareId: params.shareId });
      return result;
    },
    {
      refreshDeps: [initialized, params.shareId],
    },
  );

  const files = useRequest(
    async () => {
      if (share.data === undefined) {
        return undefined;
      }

      const shareData = share.data as Share;

      if (params.path.length === 0) {
        if (shareData.files !== undefined) {
          sortFiles(shareData.files);
          return shareData.files;
        } else {
          return [];
        }
      } else {
        const parent = (await getShareFileInfo({
          shareId: shareData.shareId,
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
    initialized,
    params,
    updateParams,
    share: share.data as Share | undefined,
    files: files.data as FileInfo[] | undefined,
    refresh: share.refresh,
    loading,
    error,
    selectedFiles,
    setSelectedFiles,
  };
};
