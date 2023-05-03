import { FilePath } from '@/utils/path';

export type DocFromSpace = {
  from: 'space';
  path: FilePath;
};

export type DocFromShare = {
  from: 'share';
  path: FilePath;
  shareId: number;
};

export type DocFrom = DocFromShare | DocFromSpace;
