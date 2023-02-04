import { FileInfo } from '@/services/files/entities';

export function sortFiles(files: FileInfo[]) {
  files.sort((a: FileInfo, b: FileInfo) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    } else {
      return a.filename.localeCompare(b.filename);
    }
  });
}
