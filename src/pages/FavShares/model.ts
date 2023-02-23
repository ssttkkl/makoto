import { getFavShares } from '@/services/share';
import { Share, ShareFav } from '@/services/share/entities';
import { useRequest } from '@/utils/request';
import { useState } from 'react';

export default () => {
  const [excludeExpired, setExcludeExpired] = useState<boolean>(false);

  const { data, loading, error, refresh } = useRequest(
    async () => {
      return await getFavShares({ excludeExpired });
    },
    {
      refreshDeps: [excludeExpired],
    },
  );

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  return {
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
