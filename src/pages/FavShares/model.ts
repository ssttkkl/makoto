import { getFavShares } from '@/services/share';
import { Share, ShareFav } from '@/services/share/entities';
import { useRequest } from '@/utils/request';
import { useState } from 'react';

export default () => {
  const { data, loading, error, refresh } = useRequest(async () => {
    return await getFavShares();
  });

  const [selectedShares, setSelectedShares] = useState<Share[]>([]);

  return {
    shares: (data as ShareFav[] | undefined)?.map((x: ShareFav) => x.share),
    loading,
    error,
    selectedShares,
    setSelectedShares,
    refresh,
  };
};
