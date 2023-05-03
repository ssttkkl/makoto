import {
  DocumentInfo,
  FileInfo,
  FilePermissionEnum,
  LinkInfo,
} from '@/services/files/entities';
import { getShareFileInfo, getShareInfo } from '@/services/share';
import { Share } from '@/services/share/entities';
import { getSpaceFileInfo } from '@/services/space';
import { getFileRealType } from '@/utils/file';
import { useUpdater } from '@/utils/hooks';
import { mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { useModel } from '@umijs/max';
import { useMemo } from 'react';
import { DocFrom } from './types';

export type DocSearchParams = DocFrom;

export default () => {
  const [params, updateParams, initialized] = useUpdater<DocSearchParams>({
    from: 'space',
    path: [],
  });

  const { currentUser, isLoggedIn } = useModel('currentUser');

  const share = useRequest(
    async () => {
      if (!initialized) {
        return undefined;
      }

      if (params.from === 'share') {
        return await getShareInfo({ shareId: params.shareId });
      } else {
        return null;
      }
    },
    {
      refreshDeps: [initialized, params],
    },
  );

  const file = useRequest(
    async () => {
      if (!initialized) {
        return undefined;
      }

      let file: FileInfo;
      if (params.from === 'share') {
        file = await getShareFileInfo({
          shareId: params.shareId,
          path: mergePath(params.path),
        });
      } else {
        file = await getSpaceFileInfo({ path: mergePath(params.path) });
      }
      if (getFileRealType(file) !== 'document') {
        throw new Error('file is not a document');
      }
      return file;
    },
    {
      refreshDeps: [initialized, params],
    },
  );

  let unrefFile: FileInfo | null | undefined = undefined;
  if (file.data instanceof LinkInfo) {
    unrefFile = file.data.ref;
  } else {
    unrefFile = file.data;
  }

  const writeable: boolean = useMemo(() => {
    if (params.from === 'space') {
      return (
        file.data instanceof DocumentInfo ||
        (file.data instanceof LinkInfo &&
          Boolean(file.data.permission & FilePermissionEnum.W))
      );
    } else {
      return (
        Boolean((share.data?.permission ?? 0) & FilePermissionEnum.W) &&
        isLoggedIn
      );
    }
  }, [params.from, file.data, share.data?.permission, isLoggedIn]);

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
