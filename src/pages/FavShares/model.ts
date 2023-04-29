import { getFavShares } from '@/services/share';
import { Share, ShareFav } from '@/services/share/entities';
import { useUpdater } from '@/utils/hooks';
import { useRequest } from '@/utils/request';
import { useState } from 'react';

export default () => {
  const [params, updateParams, initialized] = useUpdater({});

  const [excludeExpired, setExcludeExpired] = useState<boolean>(false);

  const { data, loading, error, refresh } = useRequest(
    async () => {
      if (!initialized) {
        return undefined;
      }
      return await getFavShares({ excludeExpired });
    },
    {
      refreshDeps: [initialized, excludeExpired],
    },
  );

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  return {
    params,
    updateParams,
    shares: (data as ShareFav[] | undefined)?.map((x: ShareFav) => x.share),
    loading,
    error,
    refresh,
    selectedShares,
    setSelectedShares,
    excludeExpired,
    setExcludeExpired,
  };
};
