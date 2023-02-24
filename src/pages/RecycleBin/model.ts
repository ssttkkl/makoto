import { getRecycleBin } from '@/services/recycle-bin';
import { RecycleBinEntity } from '@/services/recycle-bin/entities';
import { useRequest } from '@/utils/request';
import { useState } from 'react';

export default () => {
  const { data, loading, error, refresh } = useRequest(async () => {
    return await getRecycleBin();
  });

  const [selectedEntities, setSelectedEntities] = useState<RecycleBinEntity[]>(
    [],
  );

  return {
    entities: data as RecycleBinEntity[] | undefined,
    loading,
    error,
    refresh,
    selectedEntities,
    setSelectedEntities,
  };
};
