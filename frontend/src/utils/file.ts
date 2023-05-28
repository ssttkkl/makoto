import { FileInfo, FolderInfo, LinkInfo } from '@/services/files/entities';
import { FileOutlined, FolderFilled } from '@ant-design/icons';

export function getFileRealType(file: FileInfo): 'folder' | 'document' | '' {
  if (file instanceof LinkInfo) {
    const ref = (file as LinkInfo).ref;
    if (ref !== null) {
      return getFileRealType(ref);
    } else {
      return '';
    }
  } else if (file instanceof FolderInfo) {
    return 'folder';
  } else {
    return 'document';
  }
}

export function getFileIcon(file: FileInfo) {
  switch (getFileRealType(file)) {
    case 'folder':
      return FolderFilled;
    default:
      return FileOutlined;
  }
}

export function sortFiles(files: FileInfo[]) {
  files.sort((a: FileInfo, b: FileInfo) => {
    const aType = getFileRealType(a);
    const bType = getFileRealType(b);
    if (aType !== bType) {
      return aType === 'folder' ? -1 : 1;
    } else {
      return a.filename.localeCompare(b.filename);
    }
  });
}
