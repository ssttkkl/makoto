import { getOwnShares } from '@/services/share';
import { Share } from '@/services/share/entities';
import { useRequest } from '@/utils/request';
import { useState } from 'react';

export default () => {
  const { data, loading, error, refresh } = useRequest(async () => {
    return await getOwnShares();
  });

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  return {
    shares: data as Share[] | undefined,
    loading,
    error,
    selectedShares,
    setSelectedShares,
    refresh,
  };
};
