import {
  DocumentInfo,
  FileInfo,
  FolderInfo,
  LinkInfo,
} from '@/services/files/entities';
import { getShareFileInfo } from '@/services/share';
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

  const { loading, data, error, refresh } = useRequest(
    async () => {
      if (params.path.length === 0) {
        throw new Error('file cannot be folder');
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
  if (data instanceof LinkInfo) {
    unrefFile = data.ref;
  } else if (data instanceof DocumentInfo) {
    unrefFile = data;
  }

  return {
    params,
    updateParams,
    file: data as DocumentInfo | LinkInfo,
    unrefFile,
    loading,
    error,
    refresh,
  };
};
