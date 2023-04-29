import { getOwnShares } from '@/services/share';
import { Share } from '@/services/share/entities';
import { useUpdater } from '@/utils/hooks';
import { useRequest } from '@/utils/request';
import { useState } from 'react';

export default () => {
  const [params, updateParams, initialized] = useUpdater({});

  const { data, loading, error, refresh } = useRequest(
    async () => {
      if (!initialized) {
        return undefined;
      }
      return await getOwnShares();
    },
    {
      refreshDeps: [initialized],
    },
  );

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  return {
    params,
    updateParams,
    shares: data as Share[] | undefined,
    loading,
    error,
    refresh() {
      setSelectedShares([]);
      return refresh();
    },
    selectedShares,
    setSelectedShares,
  };
};
