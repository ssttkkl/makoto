import {
  DocumentInfo,
  FileInfo,
  FilePermissionEnum,
  FolderInfo,
  LinkInfo,
} from '@/services/files/entities';
import { getShareFileInfo, getShareInfo } from '@/services/share';
import { Share } from '@/services/share/entities';
import { getSpaceFileInfo } from '@/services/space';
import { useUpdater } from '@/utils/hooks';
import { FilePath, mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';

export interface DocSearchParams {
  from: 'space' | 'share';
  path: FilePath;
  shareId?: number;
}

export default () => {
  const [params, updateParams] = useUpdater<DocSearchParams>({
    from: 'space',
    path: [],
  });

  const share = useRequest(
    async () => {
      if (params.from === 'share') {
        if (!params.shareId) {
          throw new Error('shareId is required');
        }
        return await getShareInfo({ shareId: params.shareId });
      } else {
        return null;
      }
    },
    {
      refreshDeps: [params],
    },
  );

  const file = useRequest(
    async () => {
      if (params.path.length === 0) {
        return;
      }

      let file: FileInfo;
      if (params.from === 'share') {
        if (!params.shareId) {
          throw new Error('shareId is required');
        }
        file = await getShareFileInfo({
          shareId: params.shareId,
          path: mergePath(params.path),
        });
      } else {
        file = await getSpaceFileInfo({ path: mergePath(params.path) });
      }
      if (
        file instanceof FolderInfo ||
        (file instanceof LinkInfo && file.ref instanceof FolderInfo)
      ) {
        throw new Error('file cannot be folder');
      }
      return file;
    },
    {
      refreshDeps: [params],
    },
  );

  let unrefFile: FileInfo | undefined = undefined;
  if (file.data instanceof LinkInfo) {
    unrefFile = file.data.ref;
  } else if (file.data instanceof DocumentInfo) {
    unrefFile = file.data;
  }

  let writeable = false;
  if (params.from === 'space') {
    writeable =
      file.data instanceof DocumentInfo ||
      (file.data instanceof LinkInfo &&
        Boolean(file.data.permission & FilePermissionEnum.W));
  } else if (params.from === 'share') {
    writeable = Boolean((share.data?.permission ?? 0) & FilePermissionEnum.W);
  }

  return {
    params,
    updateParams,
    file: file.data as DocumentInfo | LinkInfo | undefined,
    unrefFile,
    share: share.data as Share | null | undefined,
    writeable,
    loading: file.loading || share.loading,
    error: file.error ?? share.error,
    refresh: async () => {
      await share.refresh();
      await file.refresh();
    },
  };
};
