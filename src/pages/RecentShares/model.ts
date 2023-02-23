import { getRecentShares } from '@/services/share';
import { Share } from '@/services/share/entities';
import { useRequest } from '@/utils/request';
import { useState } from 'react';

export default () => {
  const [excludeExpired, setExcludeExpired] = useState<boolean>(false);

  const { data, loading, error, refresh } = useRequest(
    async () => {
      return await getRecentShares({ excludeExpired });
    },
    {
      refreshDeps: [excludeExpired],
    },
  );

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  return {
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
