import { getRecycleBin } from '@/services/recycle-bin';
import { RecycleBinEntity } from '@/services/recycle-bin/entities';
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
      return await getRecycleBin();
    },
    {
      refreshDeps: [initialized],
    },
  );

  const [selectedEntities, setSelectedEntities] = useState<RecycleBinEntity[]>(
    [],
  );

  return {
    params,
    updateParams,
    entities: data as RecycleBinEntity[] | undefined,
    loading,
    error,
    refresh,
    selectedEntities,
    setSelectedEntities,
  };
};
