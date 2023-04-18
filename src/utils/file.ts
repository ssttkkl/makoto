import { FileInfo, FolderInfo, LinkInfo } from '@/services/files/entities';
import { FileOutlined, FolderFilled } from '@ant-design/icons';

export function getFileRealType(file: FileInfo): 'folder' | 'document' {
  if (file instanceof LinkInfo) {
    return getFileRealType((file as LinkInfo).ref);
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
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    } else {
      return a.filename.localeCompare(b.filename);
    }
  });
}
