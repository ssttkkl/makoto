import { getRecentShares } from '@/services/share';
import { Share } from '@/services/share/entities';
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
      return await getRecentShares({ excludeExpired });
    },
    {
      refreshDeps: [initialized, excludeExpired],
    },
  );

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  return {
    params,
    updateParams,
    shares: data as Share[] | undefined,
    loading,
    error,
    refresh,
    selectedShares,
    setSelectedShares,
    excludeExpired,
    setExcludeExpired,
  };
};
