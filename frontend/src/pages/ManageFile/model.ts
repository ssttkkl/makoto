import {
  getFileInfo,
  getLinksReferencingFile,
  getSharesContainingFile,
} from '@/services/files';
import { useUpdater } from '@/utils/hooks';
import { useRequest } from '@/utils/request';

export interface ManageFilePageSearchParams {
  fid: number;
}

export default () => {
  const [params, updateParams] = useUpdater<ManageFilePageSearchParams>({
    fid: 0,
  });

  const fileReq = useRequest(
    async () => {
      if (params.fid === 0) {
        return undefined;
      }
      return await getFileInfo({ fid: params.fid });
    },
    {
      refreshDeps: [params.fid],
    },
  );

  const sharesReq = useRequest(
    async () => {
      if (params.fid === 0) {
        return undefined;
      }
      return await getSharesContainingFile({ fid: params.fid });
    },
    {
      refreshDeps: [params.fid],
    },
  );

  const linksReq = useRequest(
    async () => {
      if (params.fid === 0) {
        return undefined;
      }
      return await getLinksReferencingFile({ fid: params.fid });
    },
    {
      refreshDeps: [params.fid],
    },
  );

  return {
    params,
    updateParams,
    fileReq,
    linksReq,
    sharesReq,
    async refresh() {
      await fileReq.refresh();
      await linksReq.refresh();
      await sharesReq.refresh();
    },
  };
};
